const CACHE_NAME = 'vilidaymond-portfolio-v1';
const STATIC_CACHE = 'vilidaymond-static-v1';
const DYNAMIC_CACHE = 'vilidaymond-dynamic-v1';
const IMAGE_CACHE = 'vilidaymond-images-v1';

// Assets to cache immediately
const STATIC_ASSETS = [
  '/',
  '/favicon.ico',
  '/manifest.json'
];

// Runtime caching strategies
const CACHE_STRATEGIES = {
  static: {
    cacheName: STATIC_CACHE,
    maxEntries: 50,
    maxAgeSeconds: 30 * 24 * 60 * 60, // 30 days
  },
  dynamic: {
    cacheName: DYNAMIC_CACHE,
    maxEntries: 100,
    maxAgeSeconds: 24 * 60 * 60, // 1 day
  },
  images: {
    cacheName: IMAGE_CACHE,
    maxEntries: 200,
    maxAgeSeconds: 7 * 24 * 60 * 60, // 7 days
  }
};

// Install event - cache essential assets
self.addEventListener('install', (event) => {
  console.log('Service Worker installing...');
  
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then((cache) => {
        console.log('Caching static assets');
        return cache.addAll(STATIC_ASSETS);
      })
      .then(() => {
        return self.skipWaiting();
      })
  );
});

// Activate event - cleanup old caches
self.addEventListener('activate', (event) => {
  console.log('Service Worker activating...');
  
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames
            .filter((cacheName) => {
              // Delete old versions
              return cacheName.includes('vilidaymond') && 
                     !Object.values(CACHE_STRATEGIES).some(strategy => 
                       strategy.cacheName === cacheName
                     ) &&
                     cacheName !== STATIC_CACHE;
            })
            .map((cacheName) => {
              console.log('Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            })
        );
      })
      .then(() => {
        return self.clients.claim();
      })
  );
});

// Fetch event - implement caching strategies
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);
  
  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }
  
  // Skip chrome-extension and other protocols
  if (!url.protocol.startsWith('http')) {
    return;
  }
  
  // Skip API calls (they should be handled by the app)
  if (url.pathname.startsWith('/api/')) {
    return;
  }

  event.respondWith(
    handleRequest(request)
  );
});

async function handleRequest(request) {
  const url = new URL(request.url);
  const strategy = getStrategy(url);
  
  try {
    switch (strategy.type) {
      case 'cacheFirst':
        return await cacheFirst(request, strategy);
      case 'networkFirst':
        return await networkFirst(request, strategy);
      case 'staleWhileRevalidate':
        return await staleWhileRevalidate(request, strategy);
      default:
        return fetch(request);
    }
  } catch (error) {
    console.error('Request failed:', error);
    return await handleFallback(request, error);
  }
}

function getStrategy(url) {
  // Images - cache first
  if (/\.(png|jpg|jpeg|gif|webp|avif|svg)$/i.test(url.pathname)) {
    return {
      type: 'cacheFirst',
      cacheName: IMAGE_CACHE,
      maxAge: CACHE_STRATEGIES.images.maxAgeSeconds
    };
  }
  
  // Static assets - cache first
  if (/\.(css|js|woff|woff2|ttf|eot)$/i.test(url.pathname) || 
      url.pathname.startsWith('/_next/static/')) {
    return {
      type: 'cacheFirst',
      cacheName: STATIC_CACHE,
      maxAge: CACHE_STRATEGIES.static.maxAgeSeconds
    };
  }
  
  // HTML pages - stale while revalidate
  if (url.pathname === '/' || 
      !url.pathname.includes('.') ||
      url.pathname.endsWith('.html')) {
    return {
      type: 'staleWhileRevalidate',
      cacheName: DYNAMIC_CACHE,
      maxAge: CACHE_STRATEGIES.dynamic.maxAgeSeconds
    };
  }
  
  // Default - network first
  return {
    type: 'networkFirst',
    cacheName: DYNAMIC_CACHE,
    maxAge: CACHE_STRATEGIES.dynamic.maxAgeSeconds
  };
}

async function cacheFirst(request, strategy) {
  const cache = await caches.open(strategy.cacheName);
  const cached = await cache.match(request);
  
  if (cached && !isExpired(cached, strategy.maxAge)) {
    return cached;
  }
  
  try {
    const response = await fetch(request);
    if (response.ok) {
      await cache.put(request, response.clone());
    }
    return response;
  } catch (error) {
    if (cached) {
      return cached; // Return stale cache on network error
    }
    throw error;
  }
}

async function networkFirst(request, strategy) {
  try {
    const response = await fetch(request);
    if (response.ok) {
      const cache = await caches.open(strategy.cacheName);
      await cache.put(request, response.clone());
    }
    return response;
  } catch (error) {
    const cache = await caches.open(strategy.cacheName);
    const cached = await cache.match(request);
    if (cached) {
      return cached;
    }
    throw error;
  }
}

async function staleWhileRevalidate(request, strategy) {
  const cache = await caches.open(strategy.cacheName);
  const cached = await cache.match(request);
  
  // Start revalidation in background
  const fetchPromise = fetch(request).then((response) => {
    if (response.ok) {
      cache.put(request, response.clone());
    }
    return response;
  }).catch(() => {
    // Fail silently on background revalidation
  });
  
  // Return cached version immediately if available
  if (cached) {
    return cached;
  }
  
  // Wait for network if no cache
  return fetchPromise;
}

function isExpired(response, maxAge) {
  if (!maxAge) return false;
  
  const dateHeader = response.headers.get('date');
  if (!dateHeader) return false;
  
  const date = new Date(dateHeader);
  const now = new Date();
  const age = (now.getTime() - date.getTime()) / 1000;
  
  return age > maxAge;
}

async function handleFallback(request, error) {
  const url = new URL(request.url);
  
  // Return offline page for navigation requests
  if (request.mode === 'navigate') {
    const cache = await caches.open(STATIC_CACHE);
    const offline = await cache.match('/offline.html');
    if (offline) {
      return offline;
    }
  }
  
  // Return placeholder for images
  if (/\.(png|jpg|jpeg|gif|webp|avif)$/i.test(url.pathname)) {
    return new Response(
      '<svg width="400" height="300" xmlns="http://www.w3.org/2000/svg"><rect width="100%" height="100%" fill="#1a1a1a"/><text x="50%" y="50%" fill="#dc2626" text-anchor="middle" dy="0.3em">Image unavailable</text></svg>',
      { headers: { 'Content-Type': 'image/svg+xml' } }
    );
  }
  
  throw error;
}

// Handle background sync
self.addEventListener('sync', (event) => {
  if (event.tag === 'contact-form') {
    event.waitUntil(syncContactForms());
  }
});

async function syncContactForms() {
  // Handle offline form submissions
  // This would integrate with IndexedDB to store offline submissions
  console.log('Syncing contact forms...');
}

// Handle push notifications (if implemented)
self.addEventListener('push', (event) => {
  if (!event.data) return;
  
  const data = event.data.json();
  const options = {
    body: data.body,
    icon: '/favicon.ico',
    badge: '/favicon.ico',
    data: data.url,
    actions: [
      { action: 'view', title: 'View' },
      { action: 'close', title: 'Close' }
    ]
  };
  
  event.waitUntil(
    self.registration.showNotification(data.title, options)
  );
});

// Handle notification clicks
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  
  if (event.action === 'view' && event.notification.data) {
    event.waitUntil(
      clients.openWindow(event.notification.data)
    );
  }
});

// Periodic background sync for cache cleanup
self.addEventListener('periodicsync', (event) => {
  if (event.tag === 'cache-cleanup') {
    event.waitUntil(cleanupCaches());
  }
});

async function cleanupCaches() {
  const cacheNames = await caches.keys();
  
  for (const cacheName of cacheNames) {
    if (cacheName.includes('vilidaymond')) {
      const cache = await caches.open(cacheName);
      const requests = await cache.keys();
      const strategy = Object.values(CACHE_STRATEGIES).find(s => s.cacheName === cacheName);
      
      if (strategy && requests.length > strategy.maxEntries) {
        // Remove oldest entries
        const toDelete = requests.slice(0, requests.length - strategy.maxEntries);
        await Promise.all(toDelete.map(request => cache.delete(request)));
      }
    }
  }
}