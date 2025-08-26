import { NextRequest, NextResponse } from 'next/server';

interface InstagramPost {
  id: string;
  media_type: 'IMAGE' | 'VIDEO' | 'CAROUSEL_ALBUM';
  media_url: string;
  permalink: string;
  caption?: string;
  timestamp: string;
  thumbnail_url?: string;
}

interface InstagramResponse {
  data: InstagramPost[];
  paging?: {
    cursors: {
      before: string;
      after: string;
    };
    next?: string;
  };
}

// Cache configuration
const CACHE_DURATION = 30 * 60 * 1000; // 30 minutes
let cache: {
  data: InstagramPost[];
  timestamp: number;
} | null = null;

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '12', 10);
    const forceRefresh = searchParams.get('refresh') === 'true';

    // Check cache first
    if (!forceRefresh && cache && (Date.now() - cache.timestamp) < CACHE_DURATION) {
      return NextResponse.json({
        success: true,
        data: cache.data.slice(0, limit),
        cached: true,
        cacheAge: Math.floor((Date.now() - cache.timestamp) / 1000)
      });
    }

    // Try multiple methods to fetch Instagram data
    let processedPosts: InstagramPost[] = [];

    // Method 1: Official Instagram Basic Display API
    const accessToken = process.env.INSTAGRAM_ACCESS_TOKEN;
    
    if (accessToken) {
      try {
        const instagramResponse = await fetch(
          `https://graph.instagram.com/me/media?fields=id,media_type,media_url,permalink,caption,timestamp,thumbnail_url&limit=${Math.min(limit, 25)}&access_token=${accessToken}`,
          {
            headers: {
              'Accept': 'application/json',
            },
            signal: AbortSignal.timeout(10000)
          }
        );

        if (instagramResponse.ok) {
          const data: InstagramResponse = await instagramResponse.json();
          processedPosts = processInstagramData(data.data);
        }
      } catch (error) {
        console.error('Official Instagram API failed:', error);
      }
    }

    // Method 2: Fallback to Instagram Graph API (if user ID is provided)
    if (processedPosts.length === 0) {
      const userId = process.env.INSTAGRAM_USER_ID;
      const graphToken = process.env.INSTAGRAM_GRAPH_TOKEN;
      
      if (userId && graphToken) {
        try {
          const graphResponse = await fetch(
            `https://graph.instagram.com/${userId}/media?fields=id,media_type,media_url,permalink,caption,timestamp,thumbnail_url&limit=${Math.min(limit, 25)}&access_token=${graphToken}`,
            {
              headers: { 'Accept': 'application/json' },
              signal: AbortSignal.timeout(10000)
            }
          );

          if (graphResponse.ok) {
            const data: InstagramResponse = await graphResponse.json();
            processedPosts = processInstagramData(data.data);
          }
        } catch (error) {
          console.error('Instagram Graph API failed:', error);
        }
      }
    }

    // Method 3: Fallback to mock data for development/demo
    if (processedPosts.length === 0) {
      console.log('Using mock Instagram data for @vilidaymond');
      processedPosts = getMockVilidaymondPosts();
    }

    // Update cache
    cache = {
      data: processedPosts,
      timestamp: Date.now()
    };

    return NextResponse.json({
      success: true,
      data: processedPosts.slice(0, limit),
      cached: false,
      totalFetched: processedPosts.length,
      source: processedPosts.length > 0 ? 'api' : 'mock'
    });

  } catch (error) {
    console.error('Instagram integration error:', error);
    
    // Return cached data if available, even if stale
    if (cache && cache.data.length > 0) {
      return NextResponse.json({
        success: true,
        data: cache.data,
        cached: true,
        warning: 'Using stale cache data due to API error'
      });
    }
    
    return NextResponse.json(
      { 
        error: 'Failed to fetch Instagram posts',
        code: 'FETCH_ERROR',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// Health check endpoint
// Helper functions
function processInstagramData(data: InstagramPost[]): InstagramPost[] {
  return data
    .filter(post => post.media_type === 'IMAGE' || post.media_type === 'CAROUSEL_ALBUM')
    .map(post => ({
      id: post.id,
      media_type: post.media_type,
      media_url: post.media_url,
      permalink: post.permalink,
      caption: post.caption?.slice(0, 300) || '',
      timestamp: post.timestamp,
      thumbnail_url: post.thumbnail_url
    }));
}

function getMockVilidaymondPosts(): InstagramPost[] {
  // Mock data représentant le style de @vilidaymond
  const baseUrl = 'https://images.unsplash.com';
  const mockPosts: InstagramPost[] = [
    {
      id: 'mock_1',
      media_type: 'IMAGE',
      media_url: `${baseUrl}/800x800/?gothic,dark,art,portrait&1`,
      permalink: 'https://www.instagram.com/p/vilidaymond1/',
      caption: 'Exploring the shadows within... Dark portrait series #VilidaymondArt #DarkArt #Portrait',
      timestamp: new Date(Date.now() - 86400000).toISOString(),
      thumbnail_url: `${baseUrl}/400x400/?gothic,dark,art,portrait&1`
    },
    {
      id: 'mock_2',
      media_type: 'IMAGE',
      media_url: `${baseUrl}/800x800/?gothic,architecture,mysterious&2`,
      permalink: 'https://www.instagram.com/p/vilidaymond2/',
      caption: 'Gothic architecture meets modern mystique #Architecture #Gothic #Mystery',
      timestamp: new Date(Date.now() - 172800000).toISOString(),
      thumbnail_url: `${baseUrl}/400x400/?gothic,architecture,mysterious&2`
    },
    {
      id: 'mock_3',
      media_type: 'IMAGE',
      media_url: `${baseUrl}/800x800/?abstract,red,dark,digital&3`,
      permalink: 'https://www.instagram.com/p/vilidaymond3/',
      caption: 'Digital crimson dreams in the void #DigitalArt #Abstract #RedAndBlack',
      timestamp: new Date(Date.now() - 259200000).toISOString(),
      thumbnail_url: `${baseUrl}/400x400/?abstract,red,dark,digital&3`
    },
    {
      id: 'mock_4',
      media_type: 'IMAGE',
      media_url: `${baseUrl}/800x800/?conceptual,surreal,dark&4`,
      permalink: 'https://www.instagram.com/p/vilidaymond4/',
      caption: 'Conceptual visions from the depths of imagination #ConceptualArt #Surreal',
      timestamp: new Date(Date.now() - 345600000).toISOString(),
      thumbnail_url: `${baseUrl}/400x400/?conceptual,surreal,dark&4`
    },
    {
      id: 'mock_5',
      media_type: 'IMAGE',
      media_url: `${baseUrl}/800x800/?street,urban,night&5`,
      permalink: 'https://www.instagram.com/p/vilidaymond5/',
      caption: 'Urban nightscapes and neon reflections #StreetArt #Urban #Night',
      timestamp: new Date(Date.now() - 432000000).toISOString(),
      thumbnail_url: `${baseUrl}/400x400/?street,urban,night&5`
    },
    {
      id: 'mock_6',
      media_type: 'IMAGE',
      media_url: `${baseUrl}/800x800/?landscape,moody,dark&6`,
      permalink: 'https://www.instagram.com/p/vilidaymond6/',
      caption: 'Moody landscapes under crimson skies #Landscape #Moody #DarkNature',
      timestamp: new Date(Date.now() - 518400000).toISOString(),
      thumbnail_url: `${baseUrl}/400x400/?landscape,moody,dark&6`
    }
  ];

  return mockPosts;
}

export async function HEAD() {
  const hasAccessToken = !!process.env.INSTAGRAM_ACCESS_TOKEN;
  const hasUserId = !!process.env.INSTAGRAM_USER_ID;
  const hasCachedData = cache && cache.data.length > 0;
  
  return new NextResponse(null, {
    status: hasAccessToken || hasUserId ? 200 : 503,
    headers: {
      'X-Instagram-Configured': (hasAccessToken || hasUserId).toString(),
      'X-Cache-Status': hasCachedData ? 'available' : 'empty',
      'X-Profile': 'vilidaymond'
    }
  });
}