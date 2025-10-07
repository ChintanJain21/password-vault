'use client';

import React, { useState, useEffect } from 'react';
import { signOut } from 'next-auth/react';
import VaultList from '@/components/VaultList';
import VaultItemForm from '@/components/VaultItemForm';
import { VaultItem } from '@/types';
import {
  fetchVaultItems,
  createVaultItem,
  updateVaultItem,
  deleteVaultItem,
} from '@/lib/api';
import { CryptoService } from '@/lib/crypto';

interface VaultClientProps {
  initialItems: VaultItem[];
}

interface DecryptedVaultItem extends Omit<VaultItem, 'password'> {
  password: string;
}

export default function VaultClient({ initialItems }: VaultClientProps) {
  const [vaultItems, setVaultItems] = useState<DecryptedVaultItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [editingItem, setEditingItem] = useState<DecryptedVaultItem | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [masterPassword, setMasterPassword] = useState<string | null>(null);
  const [showMasterPasswordModal, setShowMasterPasswordModal] = useState(true);
  const [isFirstTimeUser, setIsFirstTimeUser] = useState(initialItems.length === 0);
  const [searchQuery, setSearchQuery] = useState('');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [masterPasswordSetup, setMasterPasswordSetup] = useState({
    password: '',
    confirmPassword: ''
  });

  // Initialize dark mode from localStorage
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const shouldBeDark = savedTheme === 'dark' || (!savedTheme && prefersDark);
    
    setIsDarkMode(shouldBeDark);
    updateTheme(shouldBeDark);
  }, []);

  const updateTheme = (dark: boolean) => {
    if (dark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('theme', dark ? 'dark' : 'light');
  };

  const toggleDarkMode = () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    updateTheme(newMode);
  };

  // Filter vault items based on search query
  const filteredVaultItems = vaultItems.filter(item =>
    item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (item.url && item.url.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (item.notes && item.notes.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  // Decrypt initial items when master password is provided
  useEffect(() => {
    if (masterPassword && initialItems.length > 0) {
      decryptInitialItems();
    } else if (masterPassword) {
      setVaultItems([]);
    }
  }, [masterPassword]);

  async function decryptInitialItems() {
    if (!masterPassword) return;
    
    setLoading(true);
    try {
      const decryptedItems = await Promise.all(
        initialItems.map(async (item) => ({
          ...item,
          password: await CryptoService.decrypt(item.password, masterPassword),
        }))
      );
      setVaultItems(decryptedItems);
      setError(null);
    } catch (error) {
      setError('Failed to decrypt vault items. Please check your master password.');
      setVaultItems([]);
    } finally {
      setLoading(false);
    }
  }

  async function handleSave(data: Omit<VaultItem, '_id' | 'userId' | 'createdAt' | 'updatedAt'> & { id?: string }) {
    if (!masterPassword) {
      setError('Master password is required');
      return;
    }

    try {
      const encryptedPassword = await CryptoService.encrypt(data.password, masterPassword);

      if (data.id) {
        const updated = await updateVaultItem({
          id: data.id,
          userId: editingItem ? editingItem.userId : '',
          title: data.title,
          username: data.username,
          password: encryptedPassword,
          url: data.url || '',
          notes: data.notes || ''
        });

        const decryptedItem: DecryptedVaultItem = {
          ...updated,
          password: data.password,
        };

        setVaultItems(prev =>
          prev.map(item => (item._id === updated._id ? decryptedItem : item))
        );
      } else {
        const created = await createVaultItem({
          title: data.title,
          username: data.username,
          password: encryptedPassword,
          url: data.url || '',
          notes: data.notes || ''
        });

        const decryptedItem: DecryptedVaultItem = {
          ...created,
          password: data.password,
        };

        setVaultItems(prev => [decryptedItem, ...prev]);
      }
      setShowForm(false);
      setEditingItem(null);
      setError(null);
    } catch (error) {
      setError('Failed to save vault item.');
    }
  }

  async function handleDelete(id: string) {
    try {
      await deleteVaultItem(id);
      setVaultItems(prev => prev.filter(item => item._id !== id));
      setError(null);
    } catch {
      setError('Failed to delete vault item.');
    }
  }

  function handleEdit(id: string) {
    const item = vaultItems.find(item => item._id === id);
    if (!item) return;
    setEditingItem(item);
    setShowForm(true);
  }

  function handleAddNew() {
    setEditingItem(null);
    setShowForm(true);
  }

  function handleCancel() {
    setShowForm(false);
    setEditingItem(null);
    setError(null);
  }

  function handleMasterPasswordSubmit(password: string) {
    setMasterPassword(password);
    setShowMasterPasswordModal(false);
    setError(null);
  }

  function lockVault() {
    setMasterPassword(null);
    setVaultItems([]);
    setShowMasterPasswordModal(true);
    setShowForm(false);
    setEditingItem(null);
    setError(null);
    setSearchQuery('');
  }

  // No alert logout - direct logout
  async function handleLogout() {
    await signOut({ callbackUrl: '/login' });
  }

  // Master Password Modal - Dynamic Light/Dark Design
  if (showMasterPasswordModal) {
    return (
      <div className={`min-h-screen flex items-center justify-center p-4 transition-all duration-500 ${
        isDarkMode 
          ? 'bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900' 
          : 'bg-gradient-to-br from-orange-50 via-pink-50 to-blue-50'
      }`}>
        {/* Dynamic floating particles background for light mode */}
        {!isDarkMode && (
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-gradient-to-r from-pink-200/30 to-orange-200/30 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute top-3/4 right-1/4 w-96 h-96 bg-gradient-to-r from-blue-200/20 to-purple-200/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
          </div>
        )}

        {/* Dynamic stars for dark mode */}
        {isDarkMode && (
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-20 left-20 w-1 h-1 bg-white rounded-full animate-twinkle"></div>
            <div className="absolute top-40 right-32 w-1 h-1 bg-purple-300 rounded-full animate-twinkle delay-500"></div>
            <div className="absolute bottom-40 left-1/3 w-1 h-1 bg-blue-300 rounded-full animate-twinkle delay-1000"></div>
            <div className="absolute bottom-20 right-20 w-1 h-1 bg-pink-300 rounded-full animate-twinkle delay-1500"></div>
          </div>
        )}

        <div className={`max-w-md w-full relative z-10 transition-all duration-500 ${
          isDarkMode 
            ? 'bg-slate-800/90 border border-purple-500/20 shadow-2xl shadow-purple-500/10' 
            : 'bg-white/90 border border-orange-200/50 shadow-2xl shadow-orange-500/10'
        } backdrop-blur-xl rounded-3xl p-8`}>
          
          <div className="text-center mb-8">
            {/* Dynamic icon based on theme */}
            <div className={`mx-auto h-20 w-20 rounded-3xl flex items-center justify-center mb-6 shadow-xl transition-all duration-500 ${
              isDarkMode 
                ? 'bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-700 shadow-purple-500/30' 
                : 'bg-gradient-to-br from-orange-400 via-pink-500 to-red-500 shadow-orange-500/30'
            }`}>
              <svg className="h-10 w-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            
            {isFirstTimeUser ? (
              <div>
                <h2 className={`text-3xl font-bold mb-3 transition-colors duration-500 ${
                  isDarkMode ? 'text-white' : 'text-gray-900'
                }`}>
                  Create Master Key
                </h2>
                <p className={`transition-colors duration-500 ${
                  isDarkMode ? 'text-purple-200' : 'text-orange-600'
                }`}>
                  Secure your digital vault with a master password
                </p>
              </div>
            ) : (
              <div>
                <h2 className={`text-3xl font-bold mb-3 transition-colors duration-500 ${
                  isDarkMode ? 'text-white' : 'text-gray-900'
                }`}>
                  Welcome Back
                </h2>
                <p className={`transition-colors duration-500 ${
                  isDarkMode ? 'text-purple-200' : 'text-orange-600'
                }`}>
                  Enter your master key to unlock your vault
                </p>
              </div>
            )}
          </div>

          {isFirstTimeUser ? (
            // Create password form
            <form onSubmit={(e) => {
              e.preventDefault();
              const { password, confirmPassword } = masterPasswordSetup;
              
              if (!password || password.length < 8) {
                setError('Master password must be at least 8 characters long');
                return;
              }
              
              if (password !== confirmPassword) {
                setError('Passwords do not match');
                return;
              }
              
              setError(null);
              handleMasterPasswordSubmit(password);
              setIsFirstTimeUser(false);
            }}>
              <div className="space-y-6">
                <div>
                  <label className={`block text-sm font-bold mb-3 transition-colors duration-500 ${
                    isDarkMode ? 'text-purple-200' : 'text-orange-700'
                  }`}>
                    Master Password
                  </label>
                  <input
                    type="password"
                    placeholder="Create your master password"
                    value={masterPasswordSetup.password}
                    onChange={(e) => setMasterPasswordSetup(prev => ({ ...prev, password: e.target.value }))}
                    required
                    minLength={8}
                    className={`w-full px-5 py-4 rounded-2xl transition-all duration-300 focus:scale-[1.02] ${
                      isDarkMode 
                        ? 'bg-slate-700/50 border-2 border-purple-500/30 focus:border-purple-400 text-white placeholder-purple-300' 
                        : 'bg-white/70 border-2 border-orange-300/50 focus:border-orange-400 text-gray-900 placeholder-orange-400'
                    } focus:outline-none focus:ring-0`}
                    autoFocus
                  />
                </div>
                
                <div>
                  <label className={`block text-sm font-bold mb-3 transition-colors duration-500 ${
                    isDarkMode ? 'text-purple-200' : 'text-orange-700'
                  }`}>
                    Confirm Master Password
                  </label>
                  <input
                    type="password"
                    placeholder="Confirm your master password"
                    value={masterPasswordSetup.confirmPassword}
                    onChange={(e) => setMasterPasswordSetup(prev => ({ ...prev, confirmPassword: e.target.value }))}
                    required
                    minLength={8}
                    className={`w-full px-5 py-4 rounded-2xl transition-all duration-300 focus:scale-[1.02] ${
                      isDarkMode 
                        ? 'bg-slate-700/50 border-2 border-purple-500/30 focus:border-purple-400 text-white placeholder-purple-300' 
                        : 'bg-white/70 border-2 border-orange-300/50 focus:border-orange-400 text-gray-900 placeholder-orange-400'
                    } focus:outline-none focus:ring-0`}
                  />
                </div>
                
                {error && (
                  <div className={`p-4 rounded-2xl transition-all duration-300 ${
                    isDarkMode 
                      ? 'bg-red-900/30 border border-red-500/30 text-red-300' 
                      : 'bg-red-50 border border-red-200 text-red-600'
                  }`}>
                    {error}
                  </div>
                )}
                
                <div className={`rounded-2xl p-5 transition-all duration-300 ${
                  isDarkMode 
                    ? 'bg-amber-900/20 border border-amber-500/30' 
                    : 'bg-amber-50 border border-amber-200'
                }`}>
                  <div className="flex items-start">
                    <svg className={`h-5 w-5 mt-1 mr-3 flex-shrink-0 ${
                      isDarkMode ? 'text-amber-400' : 'text-amber-600'
                    }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                    </svg>
                    <p className={`text-sm ${
                      isDarkMode ? 'text-amber-200' : 'text-amber-800'
                    }`}>
                      <strong>Important:</strong> This password cannot be recovered if forgotten!
                    </p>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                className={`w-full mt-8 py-4 px-6 rounded-2xl font-bold text-lg shadow-xl transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] ${
                  isDarkMode 
                    ? 'bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 hover:from-purple-500 hover:via-blue-500 hover:to-indigo-500 text-white shadow-purple-500/30' 
                    : 'bg-gradient-to-r from-orange-500 via-pink-500 to-red-500 hover:from-orange-400 hover:via-pink-400 hover:to-red-400 text-white shadow-orange-500/30'
                }`}
              >
                🔐 Create Master Key
              </button>
            </form>
          ) : (
            // Enter password form
            <form onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.target as HTMLFormElement);
              const password = formData.get('masterPassword') as string;
              if (password) handleMasterPasswordSubmit(password);
            }}>
              <div className="space-y-6">
                <div>
                  <label className={`block text-sm font-bold mb-3 transition-colors duration-500 ${
                    isDarkMode ? 'text-purple-200' : 'text-orange-700'
                  }`}>
                    Master Password
                  </label>
                  <input
                    name="masterPassword"
                    type="password"
                    placeholder="Enter your master password"
                    required
                    className={`w-full px-5 py-4 rounded-2xl transition-all duration-300 focus:scale-[1.02] ${
                      isDarkMode 
                        ? 'bg-slate-700/50 border-2 border-purple-500/30 focus:border-purple-400 text-white placeholder-purple-300' 
                        : 'bg-white/70 border-2 border-orange-300/50 focus:border-orange-400 text-gray-900 placeholder-orange-400'
                    } focus:outline-none focus:ring-0`}
                    autoFocus
                  />
                </div>
                
                {error && (
                  <div className={`p-4 rounded-2xl transition-all duration-300 ${
                    isDarkMode 
                      ? 'bg-red-900/30 border border-red-500/30 text-red-300' 
                      : 'bg-red-50 border border-red-200 text-red-600'
                  }`}>
                    {error}
                  </div>
                )}
              </div>
              
              <button
                type="submit"
                className={`w-full mt-8 py-4 px-6 rounded-2xl font-bold text-lg shadow-xl transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] ${
                  isDarkMode 
                    ? 'bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 hover:from-purple-500 hover:via-blue-500 hover:to-indigo-500 text-white shadow-purple-500/30' 
                    : 'bg-gradient-to-r from-orange-500 via-pink-500 to-red-500 hover:from-orange-400 hover:via-pink-400 hover:to-red-400 text-white shadow-orange-500/30'
                }`}
              >
                🔓 Unlock Vault
              </button>
              
              <button
                type="button"
                onClick={() => {
                  setIsFirstTimeUser(true);
                  setMasterPasswordSetup({ password: '', confirmPassword: '' });
                  setError(null);
                }}
                className={`w-full mt-4 text-sm font-medium transition-colors duration-300 ${
                  isDarkMode 
                    ? 'text-purple-300 hover:text-purple-100' 
                    : 'text-orange-500 hover:text-orange-700'
                }`}
              >
                Forgot master password? Create new one
              </button>
            </form>
          )}
        </div>
      </div>
    );
  }

  // Main Vault Interface - Dynamic Light/Dark Design
  return (
    <div className={`min-h-screen transition-all duration-500 ${
      isDarkMode 
        ? 'bg-gradient-to-br from-slate-900 via-indigo-900 to-purple-900' 
        : 'bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50'
    }`}>
      {/* Dynamic background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {isDarkMode ? (
          <>
            <div className="absolute top-10 left-10 w-64 h-64 bg-gradient-to-r from-purple-600/10 to-blue-600/10 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute bottom-10 right-10 w-80 h-80 bg-gradient-to-r from-indigo-600/10 to-purple-600/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
          </>
        ) : (
          <>
            <div className="absolute top-20 right-20 w-72 h-72 bg-gradient-to-r from-blue-200/40 to-purple-200/40 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute bottom-20 left-20 w-96 h-96 bg-gradient-to-r from-indigo-200/30 to-pink-200/30 rounded-full blur-3xl animate-pulse delay-1000"></div>
          </>
        )}
      </div>

      <div className="max-w-7xl mx-auto p-6 relative z-10">
        {/* Header */}
        <div className={`backdrop-blur-xl rounded-3xl shadow-2xl p-6 mb-8 transition-all duration-500 ${
          isDarkMode 
            ? 'bg-slate-800/40 border border-purple-500/20 shadow-purple-900/20' 
            : 'bg-white/60 border border-blue-200/50 shadow-blue-900/10'
        }`}>
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-6">
              {/* Dynamic logo */}
              <div className={`h-16 w-16 rounded-2xl flex items-center justify-center shadow-xl transition-all duration-500 ${
                isDarkMode 
                  ? 'bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-700 shadow-purple-500/30' 
                  : 'bg-gradient-to-br from-blue-500 via-indigo-600 to-purple-600 shadow-blue-500/30'
              }`}>
                <svg className="h-8 w-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <div>
                <h1 className={`text-4xl font-bold transition-all duration-500 ${
                  isDarkMode 
                    ? 'bg-gradient-to-r from-white via-purple-200 to-blue-200 bg-clip-text text-transparent' 
                    : 'bg-gradient-to-r from-gray-900 via-blue-600 to-indigo-600 bg-clip-text text-transparent'
                }`}>
                  SecureVault
                </h1>
                <p className={`text-sm font-medium ${
                  isDarkMode ? 'text-purple-300' : 'text-blue-600'
                }`}>
                  Your encrypted password manager
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              {/* Dark Mode Toggle */}
              <button
                onClick={toggleDarkMode}
                className={`p-3 rounded-2xl transition-all duration-300 hover:scale-110 active:scale-95 ${
                  isDarkMode 
                    ? 'bg-yellow-500/20 text-yellow-300 hover:bg-yellow-500/30 border border-yellow-500/30' 
                    : 'bg-indigo-100 text-indigo-600 hover:bg-indigo-200 border border-indigo-200'
                } shadow-lg`}
                title={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
              >
                {isDarkMode ? (
                  <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                ) : (
                  <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                  </svg>
                )}
              </button>

              {/* Lock Vault Button */}
              <button
                onClick={lockVault}
                className={`px-5 py-3 rounded-2xl font-medium transition-all duration-300 hover:scale-105 active:scale-95 ${
                  isDarkMode 
                    ? 'bg-slate-700/50 text-slate-300 hover:bg-slate-600/50 border border-slate-600/50' 
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200 border border-gray-200'
                } shadow-lg flex items-center space-x-2`}
              >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                <span>Lock</span>
              </button>

              {/* Logout Button - No alert */}
              <button
                onClick={handleLogout}
                className={`px-5 py-3 rounded-2xl font-medium transition-all duration-300 hover:scale-105 active:scale-95 ${
                  isDarkMode 
                    ? 'bg-red-600/20 text-red-400 hover:bg-red-600/30 border border-red-500/30' 
                    : 'bg-red-100 text-red-600 hover:bg-red-200 border border-red-200'
                } shadow-lg flex items-center space-x-2`}
              >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className={`backdrop-blur-xl rounded-3xl shadow-2xl p-8 transition-all duration-500 ${
          isDarkMode 
            ? 'bg-slate-800/40 border border-purple-500/20 shadow-purple-900/20' 
            : 'bg-white/60 border border-blue-200/50 shadow-blue-900/10'
        }`}>
          {error && (
            <div className={`mb-8 p-5 rounded-2xl transition-all duration-300 ${
              isDarkMode 
                ? 'bg-red-900/30 border border-red-500/30 text-red-300' 
                : 'bg-red-50 border border-red-200 text-red-600'
            }`}>
              <div className="flex items-center">
                <svg className="h-5 w-5 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {error}
              </div>
            </div>
          )}

          {showForm ? (
            <VaultItemForm
              initialData={editingItem ?? undefined}
              onSave={handleSave}
              onCancel={handleCancel}
            />
          ) : (
            <>
              {/* Search Bar */}
              <div className="mb-8 relative">
                <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                  <svg className={`h-6 w-6 ${
                    isDarkMode ? 'text-purple-400' : 'text-blue-400'
                  }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <input
                  type="text"
                  placeholder="Search your vault..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className={`block w-full pl-14 pr-12 py-4 rounded-2xl text-lg transition-all duration-300 focus:scale-[1.02] ${
                    isDarkMode 
                      ? 'bg-slate-700/50 border-2 border-purple-500/30 focus:border-purple-400 text-white placeholder-purple-300' 
                      : 'bg-white/70 border-2 border-blue-300/50 focus:border-blue-400 text-gray-900 placeholder-blue-400'
                  } focus:outline-none focus:ring-0 shadow-lg`}
                />
                {searchQuery && (
                  <div className="absolute inset-y-0 right-0 pr-5 flex items-center">
                    <button
                      onClick={() => setSearchQuery('')}
                      className={`p-2 rounded-full transition-all duration-200 hover:scale-110 ${
                        isDarkMode 
                          ? 'text-purple-400 hover:text-purple-200 hover:bg-purple-500/20' 
                          : 'text-blue-400 hover:text-blue-600 hover:bg-blue-100'
                      }`}
                    >
                      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                )}
              </div>

              {/* Add New Item Button */}
              <button
                onClick={handleAddNew}
                className={`mb-8 py-4 px-8 rounded-2xl font-bold text-lg shadow-xl transition-all duration-300 transform hover:scale-105 active:scale-95 ${
                  isDarkMode 
                    ? 'bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 hover:from-purple-500 hover:via-blue-500 hover:to-indigo-500 text-white shadow-purple-500/30' 
                    : 'bg-gradient-to-r from-blue-500 via-indigo-600 to-purple-600 hover:from-blue-400 hover:via-indigo-500 hover:to-purple-500 text-white shadow-blue-500/30'
                } flex items-center space-x-3`}
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                <span>Add New Password</span>
              </button>

              {/* Loading State */}
              {loading ? (
                <div className="text-center py-16">
                  <div className={`inline-block animate-spin rounded-full h-16 w-16 border-4 border-t-transparent ${
                    isDarkMode 
                      ? 'border-purple-500' 
                      : 'border-blue-500'
                  }`}></div>
                  <p className={`mt-6 font-bold text-lg ${
                    isDarkMode ? 'text-purple-300' : 'text-blue-600'
                  }`}>
                    Decrypting your vault...
                  </p>
                </div>
              ) : (
                <>
                  <VaultList items={filteredVaultItems} onEdit={handleEdit} onDelete={handleDelete} />
                  {searchQuery && filteredVaultItems.length === 0 && (
                    <div className="text-center py-16">
                      <div className={`mx-auto h-20 w-20 rounded-full flex items-center justify-center mb-6 ${
                        isDarkMode 
                          ? 'bg-slate-700/50 text-purple-400' 
                          : 'bg-blue-100 text-blue-500'
                      }`}>
                        <svg className="h-10 w-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                      </div>
                      <h3 className={`text-2xl font-bold mb-2 ${
                        isDarkMode ? 'text-white' : 'text-gray-900'
                      }`}>
                        No matches found
                      </h3>
                      <p className={`text-lg ${
                        isDarkMode ? 'text-purple-300' : 'text-blue-600'
                      }`}>
                        No items found for "{searchQuery}
                      </p>
                      <p className={`text-sm mt-2 ${
                        isDarkMode ? 'text-slate-400' : 'text-gray-500'
                      }`}>
                        Try adjusting your search terms
                      </p>
                    </div>
                  )}
                </>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
