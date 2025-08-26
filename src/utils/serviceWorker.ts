interface ServiceWorkerConfig {
  swPath?: string;
  scope?: string;
  enableNotifications?: boolean;
  enableBackgroundSync?: boolean;
}

class ServiceWorkerManager {
  private registration: ServiceWorkerRegistration | null = null;
  private config: ServiceWorkerConfig;
  private isSupported: boolean;

  constructor(config: ServiceWorkerConfig = {}) {
    this.config = {
      swPath: '/sw.js',
      scope: '/',
      enableNotifications: false,
      enableBackgroundSync: false,
      ...config
    };
    
    this.isSupported = 'serviceWorker' in navigator;
  }

  async register(): Promise<ServiceWorkerRegistration | null> {
    if (!this.isSupported) {
      console.warn('Service Workers are not supported in this browser');
      return null;
    }

    try {
      this.registration = await navigator.serviceWorker.register(
        this.config.swPath!,
        { scope: this.config.scope }
      );

      console.log('Service Worker registered successfully:', this.registration);

      // Handle updates
      this.registration.addEventListener('updatefound', () => {
        this.handleUpdate();
      });

      // Check for existing updates
      if (this.registration.waiting) {
        this.handleUpdate();
      }

      // Setup message handling
      this.setupMessageHandling();

      // Request permissions if needed
      if (this.config.enableNotifications) {
        await this.requestNotificationPermission();
      }

      return this.registration;

    } catch (error) {
      console.error('Service Worker registration failed:', error);
      return null;
    }
  }

  private handleUpdate() {
    if (!this.registration) return;

    const newWorker = this.registration.installing;
    if (!newWorker) return;

    newWorker.addEventListener('statechange', () => {
      if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
        // New version is available
        this.showUpdateAvailableNotification();
      }
    });
  }

  private showUpdateAvailableNotification() {
    // Custom update notification
    const notification = document.createElement('div');
    notification.className = 'sw-update-notification';
    notification.innerHTML = `
      <div class="fixed top-4 right-4 bg-primary-darkGray border border-primary-red p-4 rounded-lg shadow-lg z-50">
        <p class="text-secondary-white mb-2">New version available!</p>
        <button 
          id="sw-update-btn" 
          class="bg-primary-red hover:bg-primary-darkRed text-white px-4 py-2 rounded transition-colors"
        >
          Update Now
        </button>
        <button 
          id="sw-dismiss-btn" 
          class="ml-2 text-secondary-lightGray hover:text-white px-2 py-2 transition-colors"
        >
          Later
        </button>
      </div>
    `;

    document.body.appendChild(notification);

    // Handle update action
    const updateBtn = document.getElementById('sw-update-btn');
    const dismissBtn = document.getElementById('sw-dismiss-btn');

    updateBtn?.addEventListener('click', () => {
      this.activateWaitingServiceWorker();
      notification.remove();
    });

    dismissBtn?.addEventListener('click', () => {
      notification.remove();
    });

    // Auto dismiss after 10 seconds
    setTimeout(() => {
      if (document.body.contains(notification)) {
        notification.remove();
      }
    }, 10000);
  }

  private activateWaitingServiceWorker() {
    if (!this.registration || !this.registration.waiting) return;

    // Tell waiting SW to skip waiting and become active
    this.registration.waiting.postMessage({ type: 'SKIP_WAITING' });

    // Reload page when new SW is active
    navigator.serviceWorker.addEventListener('controllerchange', () => {
      window.location.reload();
    });
  }

  private setupMessageHandling() {
    navigator.serviceWorker.addEventListener('message', (event) => {
      const { type, payload } = event.data;

      switch (type) {
        case 'CACHE_UPDATED':
          console.log('Cache updated:', payload);
          break;
        
        case 'OFFLINE':
          this.handleOffline();
          break;
        
        case 'ONLINE':
          this.handleOnline();
          break;
        
        default:
          console.log('SW Message:', event.data);
      }
    });
  }

  private handleOffline() {
    // Show offline indicator
    const indicator = document.createElement('div');
    indicator.id = 'offline-indicator';
    indicator.className = 'fixed top-0 left-0 right-0 bg-yellow-600 text-white text-center py-2 z-50';
    indicator.textContent = 'You are offline. Some features may not be available.';
    document.body.appendChild(indicator);
  }

  private handleOnline() {
    // Remove offline indicator
    const indicator = document.getElementById('offline-indicator');
    if (indicator) {
      indicator.remove();
    }

    // Sync any pending data
    if (this.config.enableBackgroundSync && this.registration) {
      this.registration.sync.register('contact-form').catch(console.error);
    }
  }

  async requestNotificationPermission(): Promise<NotificationPermission> {
    if (!('Notification' in window)) {
      console.warn('Notifications are not supported');
      return 'denied';
    }

    if (Notification.permission === 'granted') {
      return 'granted';
    }

    if (Notification.permission === 'denied') {
      return 'denied';
    }

    // Request permission
    const permission = await Notification.requestPermission();
    return permission;
  }

  async subscribeToPush(): Promise<PushSubscription | null> {
    if (!this.registration) {
      console.error('Service Worker not registered');
      return null;
    }

    try {
      // You would need to replace this with your VAPID public key
      const subscription = await this.registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: this.urlB64ToUint8Array(
          'YOUR_VAPID_PUBLIC_KEY' // Replace with actual key
        )
      });

      console.log('Push subscription:', subscription);
      
      // Send subscription to your server
      await this.sendSubscriptionToServer(subscription);
      
      return subscription;

    } catch (error) {
      console.error('Push subscription failed:', error);
      return null;
    }
  }

  private urlB64ToUint8Array(base64String: string): Uint8Array {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
      .replace(/-/g, '+')
      .replace(/_/g, '/');

    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
  }

  private async sendSubscriptionToServer(subscription: PushSubscription): Promise<void> {
    try {
      await fetch('/api/push-subscription', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(subscription)
      });
    } catch (error) {
      console.error('Failed to send subscription to server:', error);
    }
  }

  async backgroundSync(tag: string): Promise<void> {
    if (!this.registration || !('sync' in this.registration)) {
      console.warn('Background Sync is not supported');
      return;
    }

    try {
      await this.registration.sync.register(tag);
      console.log('Background sync registered:', tag);
    } catch (error) {
      console.error('Background sync registration failed:', error);
    }
  }

  async getCacheStats(): Promise<any> {
    if (!this.registration || !this.registration.active) {
      return null;
    }

    return new Promise((resolve) => {
      const messageChannel = new MessageChannel();
      messageChannel.port1.onmessage = (event) => {
        resolve(event.data);
      };

      this.registration!.active!.postMessage(
        { type: 'GET_CACHE_STATS' },
        [messageChannel.port2]
      );
    });
  }

  async clearCaches(): Promise<void> {
    if ('caches' in window) {
      const cacheNames = await caches.keys();
      await Promise.all(
        cacheNames
          .filter(name => name.includes('vilidaymond'))
          .map(name => caches.delete(name))
      );
      console.log('Caches cleared');
    }
  }

  unregister(): Promise<boolean> {
    if (!this.registration) {
      return Promise.resolve(false);
    }

    return this.registration.unregister();
  }

  isRegistered(): boolean {
    return this.registration !== null;
  }

  getRegistration(): ServiceWorkerRegistration | null {
    return this.registration;
  }
}

// Singleton instance
export const serviceWorkerManager = new ServiceWorkerManager();

// React hook for service worker
export function useServiceWorker() {
  return {
    register: serviceWorkerManager.register.bind(serviceWorkerManager),
    backgroundSync: serviceWorkerManager.backgroundSync.bind(serviceWorkerManager),
    getCacheStats: serviceWorkerManager.getCacheStats.bind(serviceWorkerManager),
    clearCaches: serviceWorkerManager.clearCaches.bind(serviceWorkerManager),
    isRegistered: serviceWorkerManager.isRegistered.bind(serviceWorkerManager),
    subscribeToPush: serviceWorkerManager.subscribeToPush.bind(serviceWorkerManager)
  };
}