import { NextRequest, NextResponse } from 'next/server';

// Netlify Functions configuration
export const config = {
  runtime: 'nodejs18.x'
};

interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
  honeypot?: string; // Bot detection field
}

// Simple rate limiting store (in production, use Redis or similar)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const limit = rateLimitStore.get(ip);
  
  if (!limit || now > limit.resetTime) {
    // Reset or create new limit
    rateLimitStore.set(ip, { count: 1, resetTime: now + 60000 }); // 1 minute window
    return false;
  }
  
  if (limit.count >= 5) { // Max 5 requests per minute
    return true;
  }
  
  limit.count++;
  return false;
}

function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

function sanitizeInput(input: string): string {
  return input.trim().slice(0, 1000); // Limit length and trim whitespace
}

export async function POST(request: NextRequest) {
  try {
    // Get client IP for rate limiting
    const ip = request.ip || request.headers.get('x-forwarded-for') || 'unknown';
    
    // Check rate limit
    if (isRateLimited(ip)) {
      return NextResponse.json(
        { error: 'Too many requests. Please try again later.' },
        { status: 429 }
      );
    }

    const body: ContactFormData = await request.json();
    
    // Honeypot check (bot detection)
    if (body.honeypot && body.honeypot.length > 0) {
      // This looks like a bot submission
      return NextResponse.json(
        { error: 'Invalid submission' },
        { status: 400 }
      );
    }

    // Validate required fields
    if (!body.name || !body.email || !body.message) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Validate email format
    if (!validateEmail(body.email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Sanitize inputs
    const sanitizedData = {
      name: sanitizeInput(body.name),
      email: sanitizeInput(body.email),
      subject: body.subject ? sanitizeInput(body.subject) : 'Portfolio Contact',
      message: sanitizeInput(body.message)
    };

    // Validate sanitized data lengths
    if (sanitizedData.name.length < 2 || sanitizedData.message.length < 10) {
      return NextResponse.json(
        { error: 'Name must be at least 2 characters and message at least 10 characters' },
        { status: 400 }
      );
    }

    // Here you would typically:
    // 1. Send email via service like SendGrid, Resend, or Nodemailer
    // 2. Save to database
    // 3. Send to Slack/Discord webhook
    // 4. Add to CRM system
    
    // For now, we'll simulate processing and log the data
    console.log('Contact form submission:', {
      ...sanitizedData,
      timestamp: new Date().toISOString(),
      ip: ip
    });

    // Simulate email sending (replace with actual email service)
    await simulateEmailSend(sanitizedData);

    return NextResponse.json(
      {
        success: true,
        message: 'Your message has been sent successfully! I\'ll get back to you soon.',
        timestamp: new Date().toISOString()
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('Contact form error:', error);
    
    return NextResponse.json(
      { 
        error: 'Internal server error. Please try again later.',
        code: 'INTERNAL_ERROR'
      },
      { status: 500 }
    );
  }
}

// Simulate email sending - replace with actual service
async function simulateEmailSend(data: Omit<ContactFormData, 'honeypot'>) {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // In a real implementation, you'd use something like:
  /*
  import { Resend } from 'resend';
  const resend = new Resend(process.env.RESEND_API_KEY);
  
  await resend.emails.send({
    from: 'portfolio@vilidaymond.com',
    to: 'contact@vilidaymond.com',
    subject: `Portfolio Contact: ${data.subject}`,
    html: `
      <h2>New contact from ${data.name}</h2>
      <p><strong>Email:</strong> ${data.email}</p>
      <p><strong>Subject:</strong> ${data.subject}</p>
      <p><strong>Message:</strong></p>
      <p>${data.message.replace(/\n/g, '<br>')}</p>
    `
  });
  */
  
  return true;
}

export async function GET() {
  return NextResponse.json(
    { error: 'Method not allowed' },
    { status: 405 }
  );
}