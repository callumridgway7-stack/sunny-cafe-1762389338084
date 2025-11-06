const express = require('express');
const path = require('path');
const nodemailer = require('nodemailer');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Serve pages with clean URLs
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/about', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'about.html'));
});

app.get('/menu', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'menu.html'));
});

app.get('/contact', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'contact.html'));
});

// API for contact form
app.post('/api/contact', async (req, res) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.redirect('/contact?error=true');
  }

  // SMTP configuration - Use environment variables for production
  // For testing, Ethereal is used (generate credentials at ethereal.email)
  // For production, use services like Gmail, SendGrid, etc., and set SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS
  let transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.ethereal.email',
    port: process.env.SMTP_PORT || 587,
    secure: false, // true for 465
    auth: {
      user: process.env.SMTP_USER || 'your-test-user@ethereal.email',
      pass: process.env.SMTP_PASS || 'your-test-pass'
    }
  });

  const mailOptions = {
    from: email,
    to: 'hello@sunnycafe.com',
    subject: `Contact Form Submission from ${name}`,
    text: `Message: ${message}\n\nFrom: ${name} (${email})`
  };

  try {
    await transporter.sendMail(mailOptions);
    res.redirect('/contact?success=true');
  } catch (error) {
    console.error('Error sending email:', error);
    res.redirect('/contact?error=true');
  }
});

// Catch-all for 404
app.get('*', (req, res) => {
  res.status(404).send('Page not found');
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});