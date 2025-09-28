'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import BurstPattern from '@/components/logoCircle';
import { FaTrash } from 'react-icons/fa';
import { AiOutlineLoading3Quarters } from 'react-icons/ai';
import api from './utils/api';

export default function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState({ name: '', email: '' });
  const [notes, setNotes] = useState([]);
  const [showNoteForm, setShowNoteForm] = useState(false);
  const [newNoteText, setNewNoteText] = useState('');
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const verifyUser = async () => {
      const token = localStorage.getItem('token');
      if (!token) return router.push('/login');

      try {
        const res = await api.post(
          '/auth/user/verify',
          {},
          { headers: { Authorization: `Bearer ${token}` } }
        );

        setUser(res.data.user);
        await fetchNotes(token);
      } catch (err) {
        console.error('Token verification failed:', err.response?.data || err.message);
        localStorage.removeItem('token');
        router.push('/login');
      } finally {
        setLoading(false);
      }
    };

    verifyUser();
  }, [router]);

  const fetchNotes = async (token) => {
    try {
      const res = await api.get('/notes', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setNotes(res.data);
    } catch (err) {
      console.error('Failed to fetch notes:', err.message);
      setError('Failed to fetch notes. Please try again later.');
    }
  };

  const handleSignOut = () => {
    localStorage.removeItem('token');
    router.push('/login');
  };

  const handleCreateNote = () => setShowNoteForm(true);

  const handleSaveNote = async () => {
    if (!newNoteText.trim()) return;
    const token = localStorage.getItem('token');
    setActionLoading(true);
    setError('');
    setSuccess('');

    try {
      const res = await api.post(
        '/notes',
        { content: newNoteText.trim() },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setNotes([res.data, ...notes]);
      setNewNoteText('');
      setShowNoteForm(false);
      setSuccess('Note saved successfully!');
    } catch (err) {
      console.error('Failed to save note:', err.message);
      setError('Failed to save note. Please try again.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteNote = async (noteId) => {
    const token = localStorage.getItem('token');
    setActionLoading(true);
    setError('');
    setSuccess('');

    try {
      await api.delete(`/notes/${noteId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setNotes(notes.filter((n) => n._id !== noteId));
      setSuccess('Note deleted successfully!');
    } catch (err) {
      console.error('Failed to delete note:', err.message);
      setError('Failed to delete note. Please try again.');
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white px-4 py-6 max-w-md mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <div className="w-[32px] h-[32px] mr-2">
            <BurstPattern />
          </div>
          <h1 className="text-lg font-semibold mt-4 ml-4">Dashboard</h1>
        </div>
        <button
          onClick={handleSignOut}
          className="text-blue-600 font-medium mt-4 text-sm hover:underline"
        >
          Sign Out
        </button>
      </div>

      {/* User Info */}
      <div className="bg-white shadow-md rounded-lg p-4 mb-6">
        <p className="text-lg font-semibold mb-1">
          Welcome, {user.name || 'User'}!
        </p>
        <p className="text-gray-600 text-sm">Email: {user.email}</p>
      </div>

      {/* Messages */}
      {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
      {success && <p className="text-green-500 text-sm mb-4">{success}</p>}

      {/* Create Note Button */}
      {!showNoteForm && (
        <button
          onClick={handleCreateNote}
          className="w-full bg-blue-600 text-white py-2 rounded-md mb-6 hover:bg-blue-700 transition flex justify-center items-center"
          disabled={actionLoading}
        >
          {actionLoading && <AiOutlineLoading3Quarters className="animate-spin mr-2" />}
          Create Note
        </button>
      )}

      {/* Note Form */}
      {showNoteForm && (
        <div className="mb-6">
          <textarea
            value={newNoteText}
            onChange={(e) => setNewNoteText(e.target.value)}
            placeholder="Write your note..."
            className="w-full h-32 p-3 border border-gray-300 rounded-md mb-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={actionLoading}
          />
          <div className="flex gap-2">
            <button
              onClick={handleSaveNote}
              className="flex-1 bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition flex justify-center items-center"
              disabled={actionLoading}
            >
              {actionLoading && <AiOutlineLoading3Quarters className="animate-spin mr-2" />}
              Save
            </button>
            <button
              onClick={() => {
                setShowNoteForm(false);
                setNewNoteText('');
              }}
              className="flex-1 bg-gray-300 text-gray-700 py-2 rounded-md hover:bg-gray-400 transition"
              disabled={actionLoading}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Notes List */}
      <div>
        <h2 className="text-lg font-semibold mb-3">Notes</h2>
        {loading ? (
          <p className="text-sm text-gray-500 flex items-center gap-2">
            <AiOutlineLoading3Quarters className="animate-spin" /> Loading notes...
          </p>
        ) : notes.length === 0 ? (
          <p className="text-sm text-gray-500">No notes yet. Add one!</p>
        ) : (
          notes.map((note) => (
            <div
              key={note._id}
              className="flex items-center justify-between bg-white border border-gray-200 rounded-lg px-4 py-3 mb-3 shadow-sm"
            >
              <span className="break-words">{note.content}</span>
              <button
                onClick={() => handleDeleteNote(note._id)}
                className="text-red-500 hover:text-red-700"
                disabled={actionLoading}
                aria-label="Delete note"
              >
                <FaTrash size={16} />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
