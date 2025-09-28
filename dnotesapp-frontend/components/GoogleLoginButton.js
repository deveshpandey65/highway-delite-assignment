'use client';
import api from '@/app/utils/api';
import { GoogleLogin } from '@react-oauth/google';

export default function GoogleLoginButton() {
    const handleSuccess = async (credentialResponse) => {
        const id_token = credentialResponse.credential;

        try {
            const res = await api.post('/auth/google', {
                id_token
            });

            console.log("✅ Login Success:", res.data);

            // Save token
            localStorage.setItem('token', res.data.token);

            // Save user info (name & email)
            const { name, email } = res.data.user;
            localStorage.setItem('user_name', name);
            localStorage.setItem('user_email', email);

            // Redirect
            window.location.href = "/";
        } catch (err) {
            console.error("❌ Login Failed:", err.response?.data || err.message);
        }
    };

    return (
        <GoogleLogin
            onSuccess={handleSuccess}
            onError={() => console.log("Google Login Error")}
        />
    );
}
