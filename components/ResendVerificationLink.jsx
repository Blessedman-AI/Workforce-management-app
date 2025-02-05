import axios from 'axios';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

const ResendVerificationLink = ({ email }) => {
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');
  const [key, setKey] = useState(0);

  // if (!visible) return null;

  const handleResend = async () => {
    if (!email) {
      setError('Email is required');
      return;
    }

    setSending(true);
    setError('');
    try {
      const response = await axios.post('/api/auth/resendVerification', {
        email,
      });

      console.log(response);
      setSent(true);
      toast.success('Verification email sent successfully!');
      if (sent) {
        setSent(false);
      }
    } catch (error) {
      const errorMessage = error.response?.data?.error;
      console.error('Failed to resend verification email:', error);
      setError(errorMessage || 'Failed to resend verification email');
      toast.error(errorMessage);
    } finally {
      setSending(false);
      setSent(false);
    }
  };

  return (
    <div className="mt-2 flex gap-1 items-center justify-center ">
      <p className="text-center text-[16px] sm:text-[12px] text-gray-600">
        {/* {!sending && "Didn't get verification email?"} */}
        {"Didn't get verification email?"}
      </p>

      <button
        type="button"
        onClick={handleResend}
        disabled={sending}
        className="text-center text-[16px] sm:text-[12px] text-gray-600"
      >
        {sending ? (
          <span className="text-purple-1 font-bold hover:underline  focus:outline-none">
            Sending...
          </span>
        ) : (
          <span className="text-purple-1 font-bold hover:underline  focus:outline-none">
            Resend
          </span>
        )}
      </button>
    </div>
  );
};

export default ResendVerificationLink;
