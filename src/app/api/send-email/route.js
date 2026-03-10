import { Resend } from "resend";

const resend = new Resend("re_W6Na6bTu_JXRE2AR1fRp9VM23XkzW7Fo3");

export async function POST() {
  try {
    await resend.emails.send({
      from: "onboarding@resend.dev",
      to: "renzopasagdan@gmail.com",
      subject: "Notification",
      text: "check firebase",
    });

    return Response.json({ success: true });
  } catch (error) {
    return Response.json({ error: error.message });
  }
}

