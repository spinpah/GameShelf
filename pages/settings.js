/* eslint-disable @next/next/no-img-element */
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { Header } from '../components/layout/Header';
import { useTranslation } from '../lib/translations';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';

export default function Settings() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    avatar: null
  });
  const [previewAvatar, setPreviewAvatar] = useState('');
  const router = useRouter();
  const t = useTranslation();

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      const userObj = JSON.parse(userData);
      setUser(userObj);
      setFormData(prev => ({
        ...prev,
        username: userObj.username || '',
        email: userObj.email || ''
      }));
      setPreviewAvatar(userObj.avatar || '/images/pfp.jpg');
    } else {
      router.push('/login');
    }
  }, [router]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({
        ...prev,
        avatar: file
      }));
      
      // Create preview URL
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviewAvatar(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('username', formData.username);
      formDataToSend.append('email', formData.email);
      formDataToSend.append('userId', user.id);
      
      if (formData.avatar) {
        formDataToSend.append('avatar', formData.avatar);
      }
      
      if (formData.newPassword) {
        if (formData.newPassword !== formData.confirmPassword) {
          setMessage({ type: 'error', text: t.passwordMismatch });
          setLoading(false);
          return;
        }
        formDataToSend.append('newPassword', formData.newPassword);
        formDataToSend.append('currentPassword', formData.currentPassword);
      }

      const response = await fetch('/api/users/update', {
        method: 'PUT',
        body: formDataToSend
      });

      if (response.ok) {
        const updatedUser = await response.json();
        
        // Update localStorage
        localStorage.setItem('user', JSON.stringify(updatedUser));
        setUser(updatedUser);
        
        setMessage({ type: 'success', text: t.profileUpdated });
        
        // Clear password fields
        setFormData(prev => ({
          ...prev,
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        }));
      } else {
        const error = await response.json();
        let errorMessage = 'Failed to update profile';
        
        if (error.message === 'Username already taken') {
          errorMessage = t.usernameTaken;
        } else if (error.message === 'Email already taken') {
          errorMessage = t.emailTaken;
        } else if (error.message === 'Current password is incorrect') {
          errorMessage = t.currentPasswordIncorrect;
        } else {
          errorMessage = error.message || 'Failed to update profile';
        }
        
        setMessage({ type: 'error', text: errorMessage });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'An error occurred while updating your profile' });
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/login');
  };

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300 pt-24">
      <Header user={user} onLogout={handleLogout} />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            {t.settings}
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            {t.preferences}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Profile Picture Section */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              {t.profilePicture}
            </h2>
            <div className="flex items-center space-x-6">
              <img
                src={previewAvatar}
                alt="Profile"
                className="w-24 h-24 rounded-full border-4 border-white dark:border-gray-700 shadow-lg"
              />
              <div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarChange}
                  className="block w-full text-sm text-gray-500 dark:text-gray-400
                    file:mr-4 file:py-2 file:px-4
                    file:rounded-full file:border-0
                    file:text-sm file:font-semibold
                    file:bg-blue-50 file:text-blue-700
                    hover:file:bg-blue-100
                    dark:file:bg-blue-900 dark:file:text-blue-300
                    dark:hover:file:bg-blue-800"
                />
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  JPG, PNG or GIF. {t.maxSize} 2MB.
                </p>
              </div>
            </div>
          </Card>

          {/* Account Information Section */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              {t.accountInformation}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="username" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {t.username}
                </label>
                <Input
                  id="username"
                  name="username"
                  type="text"
                  value={formData.username}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {t.email}
                </label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>
          </Card>

          {/* Change Password Section */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              {t.changePassword}
            </h2>
            <div className="space-y-4">
              <div>
                <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {t.currentPassword}
                </label>
                <Input
                  id="currentPassword"
                  name="currentPassword"
                  type="password"
                  value={formData.currentPassword}
                  onChange={handleInputChange}
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {t.newPassword}
                  </label>
                  <Input
                    id="newPassword"
                    name="newPassword"
                    type="password"
                    value={formData.newPassword}
                    onChange={handleInputChange}
                  />
                </div>
                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {t.confirmPassword}
                  </label>
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {t.passwordHint}
              </p>
            </div>
          </Card>

          {/* Message Display */}
          {message.text && (
            <div className={`p-4 rounded-lg ${
              message.type === 'success' 
                ? 'bg-green-50 text-green-800 dark:bg-green-900 dark:text-green-200' 
                : 'bg-red-50 text-red-800 dark:bg-red-900 dark:text-red-200'
            }`}>
              {message.text}
            </div>
          )}

          {/* Submit Button */}
          <div className="flex justify-end space-x-4">
            <Button
              type="button"
              variant="secondary"
              onClick={() => router.push('/profile')}
            >
              {t.cancel}
            </Button>
            <Button
              type="submit"
              disabled={loading}
            >
              {loading ? t.saving : t.saveChanges}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}