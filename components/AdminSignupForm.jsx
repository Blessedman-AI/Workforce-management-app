'use client';
import React, { useEffect, useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import Link from 'next/link';
import { capitalizeInitials, validatePassword } from '@/helpers/utils';
import { Eye, EyeOff, Check, CircleAlert } from 'lucide-react';
import toast from 'react-hot-toast';
import LoadingButton from './dashboard/buttons/Loading';

const SignupForm = () => {
  const router = useRouter();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [validationChecks, setValidationChecks] = useState({
    length: false,
    number: false,
    special: false,
    lowercase: false,
    uppercase: false,
  });

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
  });

  let isValid;

  useEffect(() => {
    // Update validation checks whenever password changes
    const password = formData.password;
    setValidationChecks({
      length: password.length >= 8,
      number: /\d/.test(password),
      special: /[!@#$%^&*(),.?":{}|<>]/.test(password),
      lowercase: /[a-z]/.test(password),
      uppercase: /[A-Z]/.test(password),
    });
  }, [formData.password]);

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

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const isValid = Object.values(validationChecks).every((check) => check);
    if (!isValid) {
      setError('Please meet all password requirements before submitting');
      setLoading(false);
      return;
    }

    // try {
    //   const signupResponse = await axios.post('/api/auth/signup', formData);
    //   console.log('Signup response data', signupResponse);

    //   const result = await signIn('credentials', {
    //     email: formData.email,
    //     password: formData.password,
    //     callbackUrl: '/admin/my-overview',
    //     redirect: true,
    //   });

    //   if (result?.error) {
    //     throw new Error(result.error);
    //   }

    //   if (result?.url) {
    //     router.push(result.url);
    //   }
    // } catch (err) {
    //   const errorMessage = err.response?.data?.error || 'Error during signup';
    //   console.error('Error:', errorMessage);
    //   toast.error(errorMessage);
    //   setError(errorMessage);
    //   setLoading(false);
    // }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-purple-2 px-4 py-6">
      {/* added px-4 py-6 */}
      <div className="w-full max-w-md p-4 sm:p-6 bg-white rounded-lg shadow-md">
        {' '}
        {/* changed p-6 to p-4 sm:p-6 */}
        <div className="mb-6">
          <h1 className="text-base sm:text-[16px] text-center text-gray-500">
            {' '}
            {/* added text-base sm:text-lg */}
            A small step for you
            <br />A giant leap for your business
          </h1>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            {' '}
            {/* changed flex to flex-col sm:flex-row */}
            <input
              type="text"
              name="firstName"
              placeholder="First Name"
              value={capitalizeInitials(formData.firstName)}
              onChange={handleChange}
              required
              className="w-full p-2 border rounded-md text-gray-500"
            />
            <input
              type="text"
              name="lastName"
              placeholder="Last Name"
              value={capitalizeInitials(formData.lastName)}
              onChange={handleChange}
              required
              className="w-full p-2 border rounded-md text-gray-500"
            />
          </div>

          <input
            type="email"
            name="email"
            placeholder="Your business email"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded-md text-gray-500"
          />

          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full p-2 border rounded-md text-gray-500"
            />
            {/* <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button> */}
          </div>

          {/* Password requirements section */}
          {formData.password.length > 0 && (
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

          {/* <button
            type="submit"
            className="w-full p-2 text-white bg-purple-1
             rounded-md hover:bg-purple-3 disabled:bg-purple-4"
            disabled={
              loading ||
              !Object.values(validationChecks).every((check) => check)
            }
          >
            {loading ? 'Creating account...' : 'Sign Up'}
          </button> */}
          <div className="flex items-center justify-center w-full">
            <LoadingButton
              type="submit"
              loading={loading}
              disabled={
                loading ||
                !Object.values(validationChecks).every((check) => check)
              }
            >
              Sign unup
            </LoadingButton>
          </div>
          <div className="mt-4 text-center text-[16px] sm:text-[12px] text-gray-600">
            Already have an account?{' '}
            <Link
              href="/login"
              className="text-purple-1 font-bold hover:underline"
            >
              Log in here
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignupForm;
