'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import BurstPattern from '@/components/logoCircle';
import GoogleLoginButton from '@/components/GoogleLoginButton';
import { AiOutlineLoading3Quarters } from 'react-icons/ai';
import api from '../utils/api';

export default function Signup() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [name, setName] = useState('');
    const [dob, setDob] = useState('');
    const [otp, setOtp] = useState('');

    const [emailFocus, setEmailFocus] = useState(false);
    const [nameFocus, setNameFocus] = useState(false);
    const [dobFocus, setDobFocus] = useState(false);
    const [otpFocus, setOtpFocus] = useState(false);

    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [otpSent, setOtpSent] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    // Send OTP
    const handleSendOTP = async () => {
        setError('');
        setSuccess('');

        if (!email.includes('@')) {
            setError('Please enter a valid email address.');
            return;
        }

        try {
            setIsLoading(true);
            const res = await api.post('/auth/signup/otp', { email });
            setOtpSent(true);
            setSuccess(res.data.message || 'OTP has been sent to your email.');
        } catch (err) {
            if (err.response) {
                setError(err.response.data.error || 'Failed to send OTP.');
            } else {
                setError('Network error! Please check your connection.');
            }
        } finally {
            setIsLoading(false);
        }
    };

    // Verify OTP and Signup
    const handleSignup = async () => {
        setError('');
        setSuccess('');

        if (otp.trim().length < 4) {
            setError('Please enter the OTP sent to your email.');
            return;
        }

        try {
            setIsLoading(true);
            const res = await api.post('/auth/signup/verify', { email, name, dob, otp });
            localStorage.setItem('token', res.data.token);
            setSuccess('Signup successful! Redirecting...');
            setTimeout(() => router.push('/'), 1000);
        } catch (err) {
            if (err.response) {
                setError(err.response.data.error || 'Signup failed.');
            } else {
                setError('Network error! Please check your connection.');
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <main className="flex min-h-screen">
            {/* Left Form Section */}
            <div className="flex-1/2 flex flex-col justify-center items-center px-6 sm:px-16 bg-white">
                <div className="w-full max-w-md">
                    {/* Logo */}
                    <div className="flex items-center mb-6 justify-center md:justify-start">
                        <div className='h-[42px] w-[42px] mr-2'>
                            <BurstPattern />
                        </div>
                        <span className="font-semibold mt-2 text-xl">HD</span>
                    </div>

                    <h1 className="text-3xl font-bold mb-2 md:text-start text-center">Sign up</h1>
                    <p className="text-gray-500 mb-6 md:text-start text-center">
                        Sign up to enjoy the features of HD
                    </p>

                    {/* Name */}
                    <div className="relative w-full mb-5">
                        <label className={`text-sm absolute left-3 px-1 -top-3 bg-white transition-all duration-200 ${nameFocus ? 'text-blue-500' : 'text-gray-500'}`}>
                            Your Name
                        </label>
                        <input
                            type="text"
                            value={name}
                            placeholder="Name"
                            onChange={(e) => setName(e.target.value)}
                            onFocus={() => setNameFocus(true)}
                            onBlur={() => setNameFocus(false)}
                            className="border border-gray-300 rounded-lg p-3 text-sm w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1"
                        />
                    </div>

                    {/* DOB */}
                    <div className="relative w-full mb-5">
                        <label className={`text-sm absolute left-3 px-1 -top-3 bg-white transition-all duration-200 ${dobFocus ? 'text-blue-500' : 'text-gray-500'}`}>
                            Date of Birth
                        </label>
                        <input
                            type="date"
                            value={dob}
                            onChange={(e) => setDob(e.target.value)}
                            onFocus={() => setDobFocus(true)}
                            onBlur={() => setDobFocus(false)}
                            className="border border-gray-300 rounded-lg p-3 text-sm w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1"
                        />
                    </div>

                    {/* Email */}
                    <div className="relative w-full mb-5">
                        <label className={`text-sm absolute left-3 px-1 -top-3 bg-white transition-all duration-200 ${emailFocus ? 'text-blue-500' : 'text-gray-500'}`}>
                            Email
                        </label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            onFocus={() => setEmailFocus(true)}
                            onBlur={() => setEmailFocus(false)}
                            placeholder="Email"
                            className="border border-gray-300 rounded-lg p-3 text-sm w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1"
                        />
                    </div>

                    {/* OTP */}
                    {otpSent && (
                        <div className="relative w-full mb-5">
                            <label className={`text-sm absolute left-3 px-1 -top-3 bg-white transition-all duration-200 ${otpFocus ? 'text-blue-500' : 'text-gray-500'}`}>
                                OTP
                            </label>
                            <input
                                type="password"
                                value={otp}
                                onChange={(e) => setOtp(e.target.value)}
                                onFocus={() => setOtpFocus(true)}
                                onBlur={() => setOtpFocus(false)}
                                placeholder="Enter OTP"
                                className="border border-gray-300 rounded-lg p-3 text-sm w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1"
                            />
                        </div>
                    )}

                    {/* Error / Success */}
                    {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
                    {success && <p className="text-green-500 text-sm mb-2">{success}</p>}

                    {/* Send OTP / Signup */}
                    <button
                        onClick={!otpSent ? handleSendOTP : handleSignup}
                        className="bg-blue-600 text-white px-4 py-2 rounded w-full hover:bg-blue-700 transition flex justify-center items-center"
                        disabled={isLoading}
                    >
                        {isLoading && <AiOutlineLoading3Quarters className="animate-spin mr-2" />}
                        {!otpSent ? 'Get OTP' : 'Sign Up'}
                    </button>

                    {/* Login Link */}
                    <p className="text-sm text-center text-gray-500 mt-4">
                        Already have an account?{' '}
                        <a href="/login" className="text-blue-600 font-medium">Sign in</a>
                    </p>

                    {/* Google Login */}
                    <div className='flex justify-center items-center mt-4'>
                        <GoogleLoginButton />
                    </div>
                </div>
            </div>

            {/* Right Image Section */}
            <div className="hidden lg:block flex-1/2 rounded-md">
                <img
                    className="h-full w-full object-cover rounded-md"
                    src="/img/7b63f1a45bc23337ff246ae8162bec8fa9d7190d.jpg"
                    alt="Signup background"
                />
            </div>
        </main>
    );
}
