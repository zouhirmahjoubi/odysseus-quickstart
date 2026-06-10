import express from 'express';
import pb from '../utils/pocketbaseClient.js';
import logger from '../utils/logger.js';

const router = express.Router();

// Helper function to validate email format
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// POST /contact/submit - Submit contact form
router.post('/submit', async (req, res) => {
  const { name, email, phone, subject, message } = req.body;

  // Validate required fields
  if (!name || !name.trim()) {
    return res.status(400).json({ error: 'Name is required' });
  }

  if (!email || !email.trim()) {
    return res.status(400).json({ error: 'Email is required' });
  }

  if (!isValidEmail(email)) {
    return res.status(400).json({ error: 'Email format is invalid' });
  }

  if (!subject || !subject.trim()) {
    return res.status(400).json({ error: 'Subject is required' });
  }

  if (!message || !message.trim()) {
    return res.status(400).json({ error: 'Message is required' });
  }

  if (message.trim().length < 10) {
    return res.status(400).json({ error: 'Message must be at least 10 characters long' });
  }

  // Validate file attachments if present
  let totalFileSize = 0;
  const attachmentPaths = [];

  if (req.files && Array.isArray(req.files)) {
    for (const file of req.files) {
      totalFileSize += file.size || 0;
    }

    if (totalFileSize > 10 * 1024 * 1024) {
      throw new Error('Total file size must not exceed 10MB');
    }

    // Store file paths for reference
    req.files.forEach((file) => {
      attachmentPaths.push(file.filename || file.originalname);
    });
  }

  // Create contact submission record
  const submission = await pb.collection('contact_submissions').create({
    name: name.trim(),
    email: email.trim(),
    phone: phone ? phone.trim() : '',
    subject: subject.trim(),
    message: message.trim(),
    attachments: attachmentPaths.length > 0 ? JSON.stringify(attachmentPaths) : '',
    status: 'new',
    submittedAt: new Date().toISOString(),
  });

  logger.info(`Contact submission created: id=${submission.id}, email=${email}`);

  res.json({
    success: true,
    submissionId: submission.id,
    message: 'Your message has been received. We will get back to you soon.',
  });
});

export default router;
