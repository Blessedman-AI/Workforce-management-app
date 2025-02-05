'use client';
import React, { useEffect, useState } from 'react';
import { getSession, signIn } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import toast from 'react-hot-toast';
import ResendVerificationLink from './ResendVerificationLink';

const SignInForm = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/admin/my-overview';
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showResend, setShowResend] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

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

    try {
      const response = await signIn('credentials', {
        email: formData.email,
        password: formData.password,
        redirect: true,
        callbackUrl:
          callbackUrl ||
          (session?.user?.role === 'admin'
            ? '/admin/my-overview'
            : '/user/my-overview'),
      });

      console.log(response?.error);

      if (response?.error?.includes('registration')) {
        setShowResend(true);
        setError(response.error);
        toast.error(response.error);
        setLoading(false);
        return;
      } else if (response?.error) {
        setError(response?.error);
        toast.error(response?.error);
        console.log(response?.error);
        setLoading(false);
        return;
      }

      const session = await getSession();
      console.log(session);

      // if (session?.user?.role === 'owner' || session?.user?.role === 'admin') {
      //   router.push('/admin/my-overview');
      // } else if (session?.user?.role === 'employee') {
      //   router.push('/user/my-overview');
      // } else {
      //   router.push('/'); // replaceefault fallback route
      // }
    } catch (err) {
      console.error('Sign in error:', err);
      toast.error(err);
      setError(err || 'An error occurred during sign in');
      if (err === 'Please check your email to complete your registration') {
        console.log('error includes registration');
        // setShowResend(true);
      }
      setLoading(false);
    }
  };
  // useEffect(() => {
  //   console.log('showResend state updated:', showResend);
  // }, [showResend]);

  useEffect(() => {
    let timeoutId;
    if (showResend) {
      timeoutId = setTimeout(() => {
        setShowResend(false);
      }, 8000);
    }

    // Cleanup function to clear the timeout
    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [showResend]);

  // console.log(showResend);

  return (
    <div
      className="flex justify-center items-center min-h-screen
     bg-purple-2 px-4 sm:px-6"
    >
      <div className="w-full max-w-md p-4 sm:p-6 bg-white rounded-lg shadow-md">
        <div className="mb-6">
          <h1 className="text-[18px] text-center text-grey-3">
            Welcome back! Please sign in to your account.
          </h1>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full p-2 sm:p-3 border rounded-md text-grey-3"
            />
          </div>
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
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-2 sm:right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            >
              {showPassword ? 'Hide' : 'Show'}
            </button>
          </div>

          <div className="w-full  flex  justify-center align-center">
            <button
              type="submit"
              className="w-full p-2 text-white bg-purple-600
             rounded-md hover:bg-purple-700 disabled:bg-purple-300"
              disabled={loading}
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </div>
          {!showResend ? (
            <div className="mt-4 text-center text-[16px] sm:text-[12px] text-gray-600">
              {"Don't have an account?"} {''}
              <Link
                href="/signup"
                className="text-purple-1 font-bold hover:underline focus:outline-none"
              >
                Sign up here
              </Link>
            </div>
          ) : (
            <ResendVerificationLink
              email={formData.email}
              // visible={error.includes('check your email')}
            />
          )}
        </form>
      </div>
    </div>
  );
};

export default SignInForm;
