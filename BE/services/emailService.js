import nodemailer from "nodemailer";

function createTransporter() {
  if (process.env.SMTP_HOST) {
    return nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT || 587),
      secure: process.env.SMTP_SECURE === "true",
      auth:
        process.env.SMTP_USER && process.env.SMTP_PASSWORD
          ? {
              user: process.env.SMTP_USER,
              pass: process.env.SMTP_PASSWORD,
            }
          : undefined,
    });
  }

  return nodemailer.createTransport({
    streamTransport: true,
    newline: "unix",
    buffer: true,
  });
}

export async function sendPasswordResetEmail({ to, name, resetUrl }) {
  const transporter = createTransporter();
  const info = await transporter.sendMail({
    from: process.env.MAIL_FROM || "GIS Tourism <no-reply@gis.local>",
    to,
    subject: "Reset your password",
    text: `Hi ${name},\n\nOpen this link to reset your password:\n${resetUrl}\n\nThe link expires soon. If you did not request it, you can ignore this email.`,
    html: `<p>Hi ${name},</p><p>Open this link to reset your password:</p><p><a href="${resetUrl}">${resetUrl}</a></p><p>The link expires soon. If you did not request it, you can ignore this email.</p>`,
  });

  if (info.message?.toString && !process.env.SMTP_HOST) {
    console.log(info.message.toString());
  }

  return info;
}
