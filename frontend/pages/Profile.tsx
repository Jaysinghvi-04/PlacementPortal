import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext'; // Assuming AuthContext is in the parent directory
import * as api from '../api';
import { UserProfile, ChangePassword } from '../types';

const Profile: React.FC = () => {
  const { user, loading: authLoading } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      if (user?.id) {
        setLoading(true);
        setError(null);
        try {
          const response = await api.getUserProfile(user.id);
          setProfile(response.data);
        } catch (err) {
          setError('Failed to fetch profile.');
          console.error('Error fetching profile:', err);
        } finally {
          setLoading(false);
        }
      }
    };

    if (!authLoading) {
      fetchProfile();
    }
  }, [user, authLoading]);

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (profile && user?.id) {
      setLoading(true);
      setError(null);
      setMessage(null);
      try {
        await api.updateUserProfile(user.id, profile);
        setMessage('Profile updated successfully!');
      } catch (err) {
        setError('Failed to update profile.');
        console.error('Error updating profile:', err);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    // This would typically involve a form with oldPassword, newPassword, confirmNewPassword
    // For now, just a placeholder
    const passwordData: ChangePassword = {
      oldPassword: 'oldPassword123', // Replace with actual form input
      newPassword: 'newPassword123', // Replace with actual form input
    };

    if (user?.id) {
      setLoading(true);
      setError(null);
      setMessage(null);
      try {
        await api.changePassword(user.id, passwordData);
        setMessage('Password changed successfully!');
      } catch (err) {
        setError('Failed to change password.');
        console.error('Error changing password:', err);
      } finally {
        setLoading(false);
      }
    }
  };

  if (loading || authLoading) {
    return <div>Loading profile...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  if (!profile) {
    return <div>No profile data found.</div>;
  }

  return (
    <div className="profile-page">
      <h1>User Profile</h1>
      {message && <div className="message">{message}</div>}
      <form onSubmit={handleProfileUpdate}>
        <div>
          <label>Username:</label>
          <input
            type="text"
            value={profile.username}
            onChange={(e) => setProfile({ ...profile, username: e.target.value })}
            disabled // Username might not be editable
          />
        </div>
        <div>
          <label>Email:</label>
          <input
            type="email"
            value={profile.email}
            onChange={(e) => setProfile({ ...profile, email: e.target.value })}
          />
        </div>
        {/* Add other profile fields as needed */}
        <button type="submit">Update Profile</button>
      </form>

      <h2>Change Password</h2>
      <form onSubmit={handleChangePassword}>
        {/* Placeholder for password fields */}
        <div>
          <label>Old Password:</label>
          <input type="password" />
        </div>
        <div>
          <label>New Password:</label>
          <input type="password" />
        </div>
        <div>
          <label>Confirm New Password:</label>
          <input type="password" />
        </div>
        <button type="submit">Change Password</button>
      </form>
    </div>
  );
};

export default Profile;