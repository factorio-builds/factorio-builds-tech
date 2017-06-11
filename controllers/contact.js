const nodemailer = require('nodemailer');
const mailgun = require('nodemailer-mailgun-transport');

const transporter = nodemailer.createTransport(
  mailgun({
    auth: {
      api_key: process.env.MAILGUN_KEY,
      domain: process.env.MAILGUN_DOMAIN,
    },
  })
);

/**
 * GET /contact
 * Contact form page.
 */
exports.getContact = (req, res) => {
  res.render('contact', {
    path: 'contact',
    title: 'Contact',
  });
};

/**
 * POST /contact
 * Send a contact form via Nodemailer.
 */
exports.postContact = (req, res) => {
  req.assert('name', 'Name cannot be blank').notEmpty();
  req.assert('email', 'Email is not valid').isEmail();
  req.assert('message', 'Message cannot be blank').notEmpty();

  const errors = req.validationErrors();

  if (errors) {
    req.flash('errors', errors);
    return res.redirect('/contact');
  }

  const mailOptions = {
    to: process.env.MAIL_TO,
    from: `${req.body.name} <${process.env.MAIL_NOREPLY}>`,
    sender: process.env.MAIL_NOREPLY,
    // TODO: fix me, reply to doesn't seem to be working
    replyTo: `${req.body.name} <${req.body.email}>`,
    subject: 'Contact Form | Factorio-Builds',
    text: `${req.body.email} wrote: ${req.body.message}`,
    // TODO: fix me, setting reply to through headers doesn't seem to be working either
    headers: {
      'Reply-To': `${req.body.name} <${req.body.email}>`,
    },
  };

  transporter.sendMail(mailOptions, (err) => {
    if (err) {
      req.flash('errors', { msg: err.message });
      return res.redirect('/contact');
    }
    req.flash('success', { msg: 'Email has been sent successfully!' });
    res.redirect('/contact');
  });
};
