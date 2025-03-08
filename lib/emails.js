import moment from 'moment';
import {
  resend,
  ShiftExchangeReqEmail,
  ShiftExchangeResponseEmail,
} from './resend';

export async function sendShiftExchangeRequest({
  to,
  requesterName,
  shiftDate,
  shiftTime,
  requestId,
}) {
  // const requestLink = `${process.env.NEXTAUTH_URL}/shift-exchange/${requestId}/respond`;
  const requestLink = `${process.env.NEXTAUTH_URL}/user/my-overview?requestId=${requestId}&action=respond`;

  try {
    const data = await resend.emails.send({
      from: process.env.EMAIL_FROM || 'onboarding@resend.dev',
      to,
      subject: 'New Shift Exchange Request',
      react: ShiftExchangeReqEmail({
        requesterName,
        shiftDate,
        shiftTime,
        requestLink,
      }),
    });

    console.log('Data😉', data);
    return { success: true, data };
  } catch (error) {
    console.error('Failed to send shift exchange request email:', error);
    return { success: false, error };
  }
}

export async function sendShiftExchangeResponse({
  to,
  responderName,
  status,
  shiftDate,
  shiftTime,
}) {
  try {
    const data = await resend.emails.send({
      from: process.env.EMAIL_FROM || 'onboarding@resend.dev',
      to,
      subject: `Shift Exchange Request ${status}`,
      react: ShiftExchangeResponseEmail({
        responderName,
        status,
        shiftDate,
        shiftTime,
      }),
    });

    return { success: true, data };
  } catch (error) {
    console.error('Failed to send shift exchange response email:', error);
    return { success: false, error };
  }
}

export const verificationEmail = ({ firstName, verificationUrl }) => {
  return `
    <h2>Welcome ${firstName}!</h2>
    <p>You've been invited to join the employee portal.</p>
    <p>Click the button below to complete your registration:</p>
    <p><a href="${verificationUrl}" style="padding: 10px 20px; background-color: #8e49ff; color: white; text-decoration: none; border-radius: 5px;">Sign In to Portal</a></p>
    <p style="color: #666; font-size: 14px;">If you weren't expecting this invitation, please ignore this email.</p>
  `;
};
