'use client';

import React, { useState, useEffect } from 'react';
import { VaultItem } from '@/types';
import PasswordGenerator from '@/components/PasswordGenerator';

interface VaultItemFormProps {
  initialData?: Partial<VaultItem>;
  onSave: (data: Omit<VaultItem, '_id' | 'userId' | 'createdAt' | 'updatedAt'> & { id?: string }) => void;
  onCancel: () => void;
}

export default function VaultItemForm({ initialData, onSave, onCancel }: VaultItemFormProps) {
  const [title, setTitle] = useState(initialData?.title || '');
  const [username, setUsername] = useState(initialData?.username || '');
  const [password, setPassword] = useState(initialData?.password || '');
  const [url, setUrl] = useState(initialData?.url || '');
  const [notes, setNotes] = useState(initialData?.notes || '');
  const [showPasswordGenerator, setShowPasswordGenerator] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isDark, setIsDark] = useState(false);

  const isEditing = !!initialData?._id;

  useEffect(() => {
    setIsDark(document.documentElement.classList.contains('dark'));
    const observer = new MutationObserver(() => 
      setIsDark(document.documentElement.classList.contains('dark'))
    );
    observer.observe(document.documentElement, { attributes: true });
    return () => observer.disconnect();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ id: initialData?._id, title, username, password, url, notes });
  };

  const handleGeneratedPassword = (generatedPassword: string) => {
    setPassword(generatedPassword);
    setShowPasswordGenerator(false);
  };

  return (
    <div className={`max-w-4xl mx-auto rounded-3xl shadow-2xl transition-all duration-500 overflow-hidden ${
      isDark 
        ? 'bg-gradient-to-br from-slate-800/90 to-slate-900/90 border border-purple-500/30' 
        : 'bg-gradient-to-br from-white/95 to-blue-50/95 border border-blue-200/60'
    } backdrop-blur-xl`}>
      
      {/* Header */}
      <div className={`p-8 ${
        isDark 
          ? 'bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600' 
          : 'bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500'
      } relative overflow-hidden`}>
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16 blur-2xl" />
        <div className="relative">
          <div className="flex items-center space-x-4 mb-2">
            <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center">
              <span className="text-2xl">{isEditing ? '✏️' : '➕'}</span>
            </div>
            <h2 className="text-3xl font-bold text-white">
              {isEditing ? 'Edit Vault Item' : 'Add New Item'}
            </h2>
          </div>
          <p className="text-white/80 text-lg">
            {isEditing ? 'Update your stored credentials' : 'Store new login credentials securely'}
          </p>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="p-8 space-y-6">
        {/* Title Field */}
        <div>
          <label className={`block text-sm font-bold mb-3 flex items-center space-x-2 ${
            isDark ? 'text-purple-300' : 'text-blue-700'
          }`}>
            <span>🏷️</span>
            <span>Title <span className="text-red-500">*</span></span>
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            placeholder="Gmail, Facebook, Bank Account..."
            className={`w-full px-5 py-4 rounded-2xl text-lg transition-all duration-300 focus:scale-[1.02] ${
              isDark 
                ? 'bg-slate-700/50 border-2 border-purple-500/30 focus:border-purple-400 text-white placeholder-purple-300' 
                : 'bg-white/70 border-2 border-blue-300/50 focus:border-blue-400 text-gray-900 placeholder-blue-400'
            } focus:outline-none shadow-lg`}
          />
        </div>

        {/* Username Field */}
        <div>
          <label className={`block text-sm font-bold mb-3 flex items-center space-x-2 ${
            isDark ? 'text-purple-300' : 'text-blue-700'
          }`}>
            <span>👤</span>
            <span>Username/Email <span className="text-red-500">*</span></span>
          </label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            placeholder="your@email.com or username"
            className={`w-full px-5 py-4 rounded-2xl text-lg transition-all duration-300 focus:scale-[1.02] ${
              isDark 
                ? 'bg-slate-700/50 border-2 border-purple-500/30 focus:border-purple-400 text-white placeholder-purple-300' 
                : 'bg-white/70 border-2 border-blue-300/50 focus:border-blue-400 text-gray-900 placeholder-blue-400'
            } focus:outline-none shadow-lg`}
          />
        </div>

        {/* Password Field */}
        <div>
          <label className={`block text-sm font-bold mb-3 flex items-center space-x-2 ${
            isDark ? 'text-purple-300' : 'text-blue-700'
          }`}>
            <span>🔑</span>
            <span>Password <span className="text-red-500">*</span></span>
          </label>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Enter or generate password"
              className={`w-full px-5 py-4 pr-16 rounded-2xl text-lg transition-all duration-300 focus:scale-[1.02] ${
                isDark 
                  ? 'bg-slate-700/50 border-2 border-purple-500/30 focus:border-purple-400 text-white placeholder-purple-300' 
                  : 'bg-white/70 border-2 border-blue-300/50 focus:border-blue-400 text-gray-900 placeholder-blue-400'
              } focus:outline-none shadow-lg`}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className={`absolute right-4 top-1/2 transform -translate-y-1/2 p-2 rounded-lg transition-all hover:scale-110 ${
                isDark ? 'text-purple-400 hover:bg-purple-500/20' : 'text-blue-500 hover:bg-blue-100'
              }`}
            >
              {showPassword ? '🙈' : '👁️'}
            </button>
          </div>
          
          {/* Password Generator Button */}
          <button
            type="button"
            onClick={() => setShowPasswordGenerator(!showPasswordGenerator)}
            className={`mt-4 px-6 py-3 rounded-2xl font-bold transition-all duration-300 hover:scale-105 active:scale-95 shadow-lg ${
              isDark 
                ? 'bg-gradient-to-r from-emerald-600/30 to-green-600/30 text-emerald-300 border border-emerald-500/50 hover:from-emerald-500/50 hover:to-green-500/50' 
                : 'bg-gradient-to-r from-emerald-100 to-green-100 text-emerald-700 border border-emerald-300 hover:from-emerald-200 hover:to-green-200'
            } flex items-center space-x-2`}
          >
            <span>🎲</span>
            <span>{showPasswordGenerator ? 'Hide Generator' : 'Generate Password'}</span>
          </button>

          {/* Password Generator */}
          {showPasswordGenerator && (
            <div className="mt-6 animate-fadeIn">
              <PasswordGenerator onGenerate={handleGeneratedPassword} />
            </div>
          )}
        </div>

        {/* URL Field */}
        <div>
          <label className={`block text-sm font-bold mb-3 flex items-center space-x-2 ${
            isDark ? 'text-purple-300' : 'text-blue-700'
          }`}>
            <span>🌐</span>
            <span>Website URL</span>
          </label>
          <input
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://example.com"
            className={`w-full px-5 py-4 rounded-2xl text-lg transition-all duration-300 focus:scale-[1.02] ${
              isDark 
                ? 'bg-slate-700/50 border-2 border-purple-500/30 focus:border-purple-400 text-white placeholder-purple-300' 
                : 'bg-white/70 border-2 border-blue-300/50 focus:border-blue-400 text-gray-900 placeholder-blue-400'
            } focus:outline-none shadow-lg`}
          />
        </div>

        {/* Notes Field */}
        <div>
          <label className={`block text-sm font-bold mb-3 flex items-center space-x-2 ${
            isDark ? 'text-purple-300' : 'text-blue-700'
          }`}>
            <span>📝</span>
            <span>Notes</span>
          </label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Additional notes or security questions..."
            rows={4}
            className={`w-full px-5 py-4 rounded-2xl text-lg transition-all duration-300 focus:scale-[1.02] resize-none ${
              isDark 
                ? 'bg-slate-700/50 border-2 border-purple-500/30 focus:border-purple-400 text-white placeholder-purple-300' 
                : 'bg-white/70 border-2 border-blue-300/50 focus:border-blue-400 text-gray-900 placeholder-blue-400'
            } focus:outline-none shadow-lg`}
          />
        </div>

        {/* Action Buttons */}
        <div className={`flex flex-col sm:flex-row gap-4 pt-8 border-t-2 ${
          isDark ? 'border-purple-500/20' : 'border-blue-200/50'
        }`}>
          <button
            type="submit"
            className={`flex-1 py-4 px-8 rounded-2xl font-bold text-lg shadow-2xl transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] ${
              isDark 
                ? 'bg-gradient-to-r from-emerald-600 via-green-600 to-teal-600 hover:from-emerald-500 hover:via-green-500 hover:to-teal-500 text-white shadow-emerald-500/30' 
                : 'bg-gradient-to-r from-emerald-500 via-green-500 to-teal-500 hover:from-emerald-400 hover:via-green-400 hover:to-teal-400 text-white shadow-emerald-500/30'
            } flex items-center justify-center space-x-3`}
          >
            <span>{isEditing ? '💾' : '✨'}</span>
            <span>{isEditing ? 'Update Item' : 'Save Item'}</span>
          </button>
          
          <button
            type="button"
            onClick={onCancel}
            className={`flex-1 py-4 px-8 rounded-2xl font-bold text-lg shadow-2xl transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] ${
              isDark 
                ? 'bg-gradient-to-r from-slate-600 to-gray-600 hover:from-slate-500 hover:to-gray-500 text-white shadow-slate-500/30' 
                : 'bg-gradient-to-r from-gray-400 to-gray-500 hover:from-gray-300 hover:to-gray-400 text-white shadow-gray-500/30'
            } flex items-center justify-center space-x-3`}
          >
            <span>❌</span>
            <span>Cancel</span>
          </button>
        </div>
      </form>
    </div>
  );
}
