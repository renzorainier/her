import nodemailer from "nodemailer";

export async function POST(req) {
  const { email, message } = await req.json();

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: "youremail@example.com",
    subject: "New Form Submission",
    text: `Email: ${email}\nMessage: ${message}`,
  });

  return Response.json({ success: true });
}
