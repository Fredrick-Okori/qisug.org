import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { to, applicantName, reference, email, paymentSlipUrl } = await request.json();

    // Validate required fields
    if (!to || !applicantName || !reference || !email || !paymentSlipUrl) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // In production, you would use a real email service like:
    // - Resend (resend.com)
    // - SendGrid
    // - AWS SES
    // - Nodemailer with SMTP

    // For now, we'll log the email details and simulate success
    console.log('=== PAYMENT NOTIFICATION EMAIL ===');
    console.log(`To: ${to}`);
    console.log(`Subject: Payment Slip Received - ${reference}`);
    console.log(`Applicant: ${applicantName}`);
    console.log(`Applicant Email: ${email}`);
    console.log(`Reference: ${reference}`);
    console.log(`Payment Slip URL: ${paymentSlipUrl}`);
    console.log('===================================');

    // Simulate email sending delay
    await new Promise(resolve => setTimeout(resolve, 500));

    // Return success response
    return NextResponse.json({
      success: true,
      message: 'Payment notification email sent successfully',
      details: {
        to,
        subject: `Payment Slip Received - ${reference}`,
        applicantName,
        reference,
      }
    });

  } catch (error) {
    console.error('Error sending payment notification:', error);
    return NextResponse.json(
      { error: 'Failed to send payment notification' },
      { status: 500 }
    );
  }
}

