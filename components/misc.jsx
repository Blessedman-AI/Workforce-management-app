'use client';

import React, { useEffect, useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import Link from 'next/link';
import { validatePassword } from '@/helpers/utils';

const SignupForm = () => {
  const router = useRouter();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState('');
  const [passwordErrors, setPasswordErrors] = useState([]);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
  });

  // Real-time password validation
  useEffect(() => {
    if (password) {
      const { errors } = validatePassword(password);
      setPasswordErrors(errors);
    }
  }, [password]);

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

    // Validate password before submission
    const passwordValidation = validatePassword(password);
    if (!passwordValidation.isValid) {
      setError('Please fix password requirements before submitting');
      return;
    }

    try {
      // 1. Sign up
      const signupResponse = await axios.post('/api/auth/signup', {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        password: formData.password,
      });

      const signupResponseData = await signupResponse.json;

      console.log('Signup response data:', signupResponseData);

      // 2. Sign in with redirect
      const result = await signIn('credentials', {
        email: formData.email,
        password: formData.password,
        callbackUrl: '/admin/my-overview',
        redirect: true,
      });

      if (result?.error) {
        throw new Error(result.error);
      }

      // If redirect fails, manually redirect
      if (result?.url) {
        router.push(result.url);
      }
    } catch (err) {
      console.error('Error:', err);
      const errorMessage =
        err.response?.data?.error || err.message || 'Error during signup';
      setError(errorMessage);
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-purple-2">
      <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-md">
        <div className="mb-6">
          <h1 className="text-[18px]  text-center text-gray-500">
            A small step for you
            <br /> A giant leap for your business
          </h1>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex gap-4">
            <input
              type="text"
              name="firstName"
              placeholder="First Name"
              value={formData.firstName}
              onChange={handleChange}
              required
              className="flex-1 p-2 border rounded-md text-gray-500"
            />
            <input
              type="text"
              name="lastName"
              placeholder="Last Name"
              value={formData.lastName}
              onChange={handleChange}
              required
              className="flex-1 p-2 border rounded-md text-gray-500 "
            />
          </div>
          <div>
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full p-2 border rounded-md text-gray-500"
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
              className="w-full p-2 border text-gray-500 rounded-md focus:ring-2
               "
            />

            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            >
              {showPassword ? 'Hide' : 'Show'}
            </button>
          </div>

          {/* Password requirements display */}
          <div className="mt-2 text-sm">
            <p className="font-medium">Password requirements:</p>
            <ul className="list-disc pl-5">
              {passwordErrors.map((error, index) => (
                <li key={index} className="text-red-500">
                  {error}
                </li>
              ))}
              {passwordErrors.length === 0 && password && (
                <li className="text-green-500">
                  Password meets all requirements!
                </li>
              )}
            </ul>
          </div>

          {error && (
            <div className="p-3 text-sm text-red-500 bg-red-50 rounded-md">
              {error}
            </div>
          )}
          <div className="w-full  flex  justify-center align-center">
            <button
              type="submit"
              className="button-primary  justify-center w-full text-center"
              disabled={loading}
            >
              {loading ? 'Creating account...' : 'Sign Up'}
            </button>
          </div>
          <div className="mt-4 text-center text-gray-600">
            Already have an account? {''}
            <Link
              href="/login"
              className="text-purple-1 hover:underline focus:outline-none"
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


 callbacks: {
    async session({ session, token }) {
      if (session?.user) {
        session.user.role = token.role;
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
      }
      return token;
    },
  },
