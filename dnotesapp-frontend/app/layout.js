// app/layout.js

import './globals.css';
import { Geist, Geist_Mono } from 'next/font/google';
import SessionWrapper from '@/components/SessionWrapper'; // make sure this path is correct

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata = {
  title: 'dNotes',
  description: 'A simple, secure, and collaborative note-taking app.',
};

// app/layout.js
import { GoogleOAuthProvider } from '@react-oauth/google';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <GoogleOAuthProvider clientId="771090578601-do73vpbpujjpkrugqlsb5eap83sksjtg.apps.googleusercontent.com">
          {children}
        </GoogleOAuthProvider>
      </body>
    </html>
  );
}

