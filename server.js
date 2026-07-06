const express = require('express');
const nodemailer = require('nodemailer');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Enable JSON parser middleware
app.use(express.json());

// Serving the current directory statically
app.use(express.static(path.join(__dirname)));

// Simple In-Memory Rate Limiting: max 5 bookings per 10 minutes per IP
const rateLimitWindowMs = 10 * 60 * 1000; // 10 minutes
const rateLimitMaxRequests = 5;
const ipRequestHistory = new Map();

// Cleanup rate limiting history periodically (every 10 minutes)
setInterval(() => {
  const now = Date.now();
  for (const [ip, history] of ipRequestHistory.entries()) {
    const activeRequests = history.filter(time => now - time < rateLimitWindowMs);
    if (activeRequests.length === 0) {
      ipRequestHistory.delete(ip);
    } else {
      ipRequestHistory.set(ip, activeRequests);
    }
  }
}, rateLimitWindowMs);

function checkRateLimit(req, res, next) {
  const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
  const now = Date.now();

  if (!ipRequestHistory.has(ip)) {
    ipRequestHistory.set(ip, [now]);
    return next();
  }

  const history = ipRequestHistory.get(ip);
  const activeRequests = history.filter(time => now - time < rateLimitWindowMs);
  activeRequests.push(now);
  ipRequestHistory.set(ip, activeRequests);

  if (activeRequests.length > rateLimitMaxRequests) {
    return res.status(429).json({
      success: false,
      message: 'Too many booking requests from this IP. Please try again in 10 minutes.'
    });
  }

  next();
}

// POST endpoint for trial booking
app.post('/api/trial-booking', checkRateLimit, async (req, res) => {
  const { name, phone, age, weight, experience } = req.body;

  // 1. Validation Checks
  if (!name || typeof name !== 'string' || name.trim().length === 0 || name.length > 100) {
    return res.status(400).json({ success: false, message: 'Invalid name. Name must be between 1 and 100 characters.' });
  }

  if (!phone || typeof phone !== 'string' || phone.trim().length === 0 || phone.length > 30) {
    return res.status(400).json({ success: false, message: 'Invalid phone number.' });
  }

  // Basic phone validation (digits, space, dashes, parentheses, optional leading +)
  const phoneRegex = /^\+?[0-9\s\-\(\)]+$/;
  if (!phoneRegex.test(phone.trim())) {
    return res.status(400).json({ success: false, message: 'Phone number contains invalid characters.' });
  }

  const ageInt = parseInt(age, 10);
  if (isNaN(ageInt) || ageInt < 12 || ageInt > 100) {
    return res.status(400).json({ success: false, message: 'Age must be a valid integer between 12 and 100.' });
  }

  if (!weight || typeof weight !== 'string' || weight.trim().length === 0 || weight.length > 30) {
    return res.status(400).json({ success: false, message: 'Invalid weight value.' });
  }

  const validExperiences = ['beginner', 'intermediate', 'advanced'];
  if (!experience || typeof experience !== 'string' || !validExperiences.includes(experience.toLowerCase())) {
    return res.status(400).json({ success: false, message: 'Please select a valid workout experience.' });
  }

  // 2. Email Configuration
  const emailUser = process.env.EMAIL_USER;
  const emailPass = process.env.EMAIL_APP_PASSWORD;
  const receiverEmail = process.env.TRIAL_RECEIVER_EMAIL || 'mohd.ali.khan.tech@gmail.com';

  if (!emailUser || !emailPass) {
    console.error('SERVER CONFIGURATION ERROR: EMAIL_USER or EMAIL_APP_PASSWORD is not set.');
    return res.status(500).json({
      success: false,
      message: 'Server mail configuration missing. Unable to submit booking.'
    });
  }

  // Setup SMTP Transporter for Gmail
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: emailUser,
      pass: emailPass
    }
  });

  const timestamp = new Date().toISOString();
  
  // Format experience value nicely
  const formattedExperience = experience.charAt(0).toUpperCase() + experience.slice(1);

  // Email Body Design
  const emailHtml = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 8px; background-color: #fafafa;">
      <h2 style="color: #ef233c; border-bottom: 2px solid #ef233c; padding-bottom: 10px; margin-top: 0; font-family: 'Arial Black', sans-serif;">
        NEW FREE TRIAL BOOKING
      </h2>
      <p style="font-size: 14px; color: #555;">A new booking session request has been received from the website:</p>
      <table style="width: 100%; border-collapse: collapse; margin-top: 15px;">
        <tr style="background-color: #f2f2f2;">
          <th style="padding: 10px; text-align: left; border: 1px solid #ddd; font-weight: bold; width: 35%;">Full Name</th>
          <td style="padding: 10px; border: 1px solid #ddd;">${name.trim()}</td>
        </tr>
        <tr>
          <th style="padding: 10px; text-align: left; border: 1px solid #ddd; font-weight: bold;">Mobile Number</th>
          <td style="padding: 10px; border: 1px solid #ddd;">${phone.trim()}</td>
        </tr>
        <tr style="background-color: #f2f2f2;">
          <th style="padding: 10px; text-align: left; border: 1px solid #ddd; font-weight: bold;">Age</th>
          <td style="padding: 10px; border: 1px solid #ddd;">${ageInt} Years</td>
        </tr>
        <tr>
          <th style="padding: 10px; text-align: left; border: 1px solid #ddd; font-weight: bold;">Weight</th>
          <td style="padding: 10px; border: 1px solid #ddd;">${weight.trim()}</td>
        </tr>
        <tr style="background-color: #f2f2f2;">
          <th style="padding: 10px; text-align: left; border: 1px solid #ddd; font-weight: bold;">Workout Experience</th>
          <td style="padding: 10px; border: 1px solid #ddd;">${formattedExperience}</td>
        </tr>
        <tr>
          <th style="padding: 10px; text-align: left; border: 1px solid #ddd; font-weight: bold;">Submitted At</th>
          <td style="padding: 10px; border: 1px solid #ddd; font-size: 12px; color: #888;">${timestamp}</td>
        </tr>
      </table>
      <div style="margin-top: 20px; font-size: 11px; color: #888; text-align: center; border-top: 1px dashed #ddd; padding-top: 10px;">
        XING Fitness Club website automated mail system.
      </div>
    </div>
  `;

  const mailOptions = {
    from: `"XING Fitness System" <${emailUser}>`,
    to: receiverEmail,
    subject: 'New Free Trial Booking - XING Fitness Club',
    html: emailHtml
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Booking email sent successfully for ${name} to ${receiverEmail}`);
    return res.status(200).json({
      success: true,
      message: 'Trial request submitted successfully.'
    });
  } catch (error) {
    console.error('ERROR SENDING EMAIL:', error);
    // Generic error response to client, preventing raw SMTP credential/server leakages
    return res.status(500).json({
      success: false,
      message: 'Unable to submit right now. Please try again.'
    });
  }
});

// Serve index.html as fallback for any non-API routes (SPA style if needed)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`XING Fitness server running at http://localhost:${PORT}`);
});
