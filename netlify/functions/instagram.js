// Netlify Function for Instagram API
exports.handler = async (event, context) => {
  // Set CORS headers
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Content-Type': 'application/json'
  };

  // Handle preflight OPTIONS request
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: ''
    };
  }

  // Only handle GET requests
  if (event.httpMethod !== 'GET') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    const accessToken = process.env.INSTAGRAM_ACCESS_TOKEN;
    
    if (!accessToken) {
      throw new Error('Instagram access token not configured');
    }

    // Fetch from Instagram API
    const response = await fetch(
      `https://graph.instagram.com/me/media?fields=id,media_type,media_url,permalink,caption,timestamp&limit=12&access_token=${accessToken}`
    );

    if (!response.ok) {
      throw new Error(`Instagram API error: ${response.status}`);
    }

    const data = await response.json();

    // Filter images, carousels, and videos
    const processedPosts = data.data
      .filter(post => post.media_type === 'IMAGE' || post.media_type === 'CAROUSEL_ALBUM' || post.media_type === 'VIDEO')
      .slice(0, 12);

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        data: processedPosts,
        total: processedPosts.length,
        source: 'instagram-api'
      })
    };

  } catch (error) {
    console.error('Instagram API error:', error);
    
    // Return mock data as fallback
    const mockPosts = [
      {
        id: 'mock_1',
        media_type: 'IMAGE',
        media_url: 'https://images.unsplash.com/800x1000/?anime,digital,art,colorful&sig=1',
        permalink: 'https://instagram.com/vilidaymond2',
        caption: 'Digital Art #1',
        timestamp: new Date(Date.now() - 86400000).toISOString()
      },
      {
        id: 'mock_2',
        media_type: 'IMAGE',
        media_url: 'https://images.unsplash.com/800x1000/?anime,character,design&sig=2',
        permalink: 'https://instagram.com/vilidaymond2',
        caption: 'Digital Art #2',
        timestamp: new Date(Date.now() - 172800000).toISOString()
      },
      {
        id: 'mock_3',
        media_type: 'IMAGE',
        media_url: 'https://images.unsplash.com/800x1000/?digital,fantasy,art&sig=3',
        permalink: 'https://instagram.com/vilidaymond2',
        caption: 'Digital Art #3',
        timestamp: new Date(Date.now() - 259200000).toISOString()
      },
      {
        id: 'mock_4',
        media_type: 'IMAGE',
        media_url: 'https://images.unsplash.com/800x1000/?abstract,digital,creative&sig=4',
        permalink: 'https://instagram.com/vilidaymond2',
        caption: 'Digital Art #4',
        timestamp: new Date(Date.now() - 345600000).toISOString()
      },
      {
        id: 'mock_5',
        media_type: 'IMAGE',
        media_url: 'https://images.unsplash.com/800x1000/?futuristic,art,design&sig=5',
        permalink: 'https://instagram.com/vilidaymond2',
        caption: 'Digital Art #5',
        timestamp: new Date(Date.now() - 432000000).toISOString()
      },
      {
        id: 'mock_6',
        media_type: 'IMAGE',
        media_url: 'https://images.unsplash.com/800x1000/?modern,artistic,digital&sig=6',
        permalink: 'https://instagram.com/vilidaymond2',
        caption: 'Digital Art #6',
        timestamp: new Date(Date.now() - 518400000).toISOString()
      }
    ];

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        data: mockPosts,
        total: mockPosts.length,
        source: 'mock-data',
        note: 'Using demo content - Instagram API unavailable'
      })
    };
  }
};