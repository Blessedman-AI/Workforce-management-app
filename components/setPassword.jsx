'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Check, CircleAlert } from 'lucide-react';
import toast from 'react-hot-toast';
import axios from 'axios';

const SetPassword = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [validationChecks, setValidationChecks] = useState({
    length: false,
    number: false,
    special: false,
    lowercase: false,
    uppercase: false,
  });

  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get('token');

  useEffect(() => {
    // Update validation checks whenever password changes

    setValidationChecks({
      length: password.length >= 8,
      number: /\d/.test(password),
      special: /[!@#$%^&*(),.?":{}|<>]/.test(password),
      lowercase: /[a-z]/.test(password),
      uppercase: /[A-Z]/.test(password),
    });
  }, [password]);

  const ValidationIndicator = ({ met }) => (
    <span
      className={`inline-flex items-center justify-center
      w-4 h-4 sm:w-5 sm:h-5 rounded-full ${
        met ? 'text-green-700' : 'text-red-700'
      }`}
    >
      {met ? <Check size={14} /> : <CircleAlert size={14} />}
    </span>
  );

  if (!token) {
    return <div>Invalid verification link</div>;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const isValid = Object.values(validationChecks).every((check) => check);
    if (!isValid) {
      setError('Please meet all password requirements before submitting');
      setLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      toast.error('Passwords do not match');
      console.log(error);
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post('/api/auth/verify', {
        token,
        password,
      });

      toast.success('Password created successfully.');
      console.log(response);
      // Redirect to login page
      router.push('/login?verified=true');
    } catch (error) {
      console.log(error);
      setError(error.response?.data?.error || 'Verification failed');
    } finally {
      setLoading(false);
    }
  };
  return (
    <div
      className="flex justify-center items-center min-h-screen
     bg-purple-2 px-4 sm:px-6"
    >
      <div className="w-full max-w-md p-4 sm:p-6 bg-white rounded-lg shadow-md">
        <div className="mb-6">
          <h1 className="text-[18px] text-center text-gray-500">
            Create your password
          </h1>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="">
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full p-2 border rounded-md text-gray-500"
            />
          </div>

          <div className="relative">
            <input
              type="password"
              name="confirm-password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className="w-full p-2 border rounded-md text-gray-500"
            />
          </div>

          {/* Password requirements section */}
          {password.length > 0 && (
            <div className="flex flex-col space-y-1 text-[11px] sm:text-[12px] font-normal text-gray-500">
              <div className="flex items-center  gap-2">
                <ValidationIndicator met={validationChecks.length} />
                <span>
                  At least <strong>8</strong> characters long
                </span>
              </div>
              <div className="flex items-center">
                <ValidationIndicator met={validationChecks.number} />
                <span>
                  Contains at least one <strong>number</strong>
                </span>
              </div>
              <div className="flex items-center">
                <ValidationIndicator met={validationChecks.special} />
                <span>
                  Contains at least one <strong>special</strong> character
                </span>
              </div>
              <div className="flex items-center ">
                <ValidationIndicator met={validationChecks.lowercase} />
                <span>
                  Contains at least one <strong>lowercase</strong> letter
                </span>
              </div>
              <div className="flex items-center ">
                <ValidationIndicator met={validationChecks.uppercase} />
                <span>
                  Contains at least one <strong>uppercase</strong> letter
                </span>
              </div>
            </div>
          )}

          <div className="w-full  flex  justify-center align-center">
            <button
              type="submit"
              disabled={
                loading ||
                !Object.values(validationChecks).every((check) => check)
              }
              className="w-full p-2 text-white bg-purple-600
             rounded-md hover:bg-purple-700 disabled:bg-purple-300"
            >
              {loading ? 'Setting up your account...' : 'Create Password'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SetPassword;
