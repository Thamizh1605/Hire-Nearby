const nodemailer = require('nodemailer');

// Create transporter - use console transport by default, or SMTP if configured
const createTransporter = () => {
  if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
    return nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT || 587,
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    });
  }
  
  // Console transport for development/testing
  return nodemailer.createTransport({
    streamTransport: true,
    newline: 'unix',
    buffer: true
  });
};

const transporter = createTransporter();

/**
 * Send email notification (logs to console if SMTP not configured)
 */
async function sendEmail(to, subject, text, html) {
  try {
    const mailOptions = {
      from: process.env.SMTP_USER || 'noreply@hire-nearby.com',
      to,
      subject,
      text,
      html
    };

    if (process.env.SMTP_HOST) {
      const info = await transporter.sendMail(mailOptions);
      console.log('Email sent:', info.messageId);
      return info;
    } else {
      // Log email to console
      console.log('=== EMAIL NOTIFICATION ===');
      console.log('To:', to);
      console.log('Subject:', subject);
      console.log('Text:', text);
      if (html) console.log('HTML:', html);
      console.log('========================');
      return { messageId: 'console-logged' };
    }
  } catch (error) {
    console.error('Email error:', error);
    // Don't throw - email failures shouldn't break the app
    return null;
  }
}

/**
 * Send notification emails for various events
 */
async function sendNewOfferNotification(requesterEmail, providerName, jobTitle) {
  return sendEmail(
    requesterEmail,
    'New Offer Received',
    `You received a new offer from ${providerName} for job: ${jobTitle}`,
    `<p>You received a new offer from <strong>${providerName}</strong> for job: <strong>${jobTitle}</strong></p>`
  );
}

async function sendOfferAcceptedNotification(providerEmail, requesterName, jobTitle) {
  return sendEmail(
    providerEmail,
    'Offer Accepted',
    `Your offer for "${jobTitle}" has been accepted by ${requesterName}`,
    `<p>Your offer for "<strong>${jobTitle}</strong>" has been accepted by <strong>${requesterName}</strong></p>`
  );
}

async function sendBookingStartedNotification(requesterEmail, providerName) {
  return sendEmail(
    requesterEmail,
    'Job Started',
    `${providerName} has started the job`,
    `<p><strong>${providerName}</strong> has started the job.</p>`
  );
}

async function sendBookingCompletedNotification(requesterEmail, providerName) {
  return sendEmail(
    requesterEmail,
    'Job Completed',
    `${providerName} has marked the job as completed. Please review and pay.`,
    `<p><strong>${providerName}</strong> has marked the job as completed. Please review and pay.</p>`
  );
}

async function sendPaymentReceivedNotification(providerEmail, amount) {
  return sendEmail(
    providerEmail,
    'Payment Received',
    `You received a payment of $${amount}`,
    `<p>You received a payment of <strong>$${amount}</strong></p>`
  );
}

module.exports = {
  sendEmail,
  sendNewOfferNotification,
  sendOfferAcceptedNotification,
  sendBookingStartedNotification,
  sendBookingCompletedNotification,
  sendPaymentReceivedNotification
};

