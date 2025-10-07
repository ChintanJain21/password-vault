'use client';

import React, { useState, useEffect } from 'react';

interface VaultItemProps {
  id: string;
  title: string;
  username: string;
  password: string;
  url?: string;
  notes?: string;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

export default function VaultItem({ id, title, username, password, url, notes, onEdit, onDelete }: VaultItemProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    setIsDark(document.documentElement.classList.contains('dark'));
    const observer = new MutationObserver(() => 
      setIsDark(document.documentElement.classList.contains('dark'))
    );
    observer.observe(document.documentElement, { attributes: true });
    return () => observer.disconnect();
  }, []);

  const copy = async (text: string, type: string) => {
    await navigator.clipboard.writeText(text);
    const toast = document.createElement('div');
    toast.className = `fixed top-4 right-4 px-6 py-3 rounded-2xl z-50 transition-all duration-300 transform translate-x-full shadow-2xl ${
      isDark ? 'bg-emerald-600/90 text-white border border-emerald-500/50' : 'bg-emerald-500 text-white'
    }`;
    toast.innerHTML = `✨ ${type} copied!`;
    document.body.appendChild(toast);
    setTimeout(() => toast.style.transform = 'translateX(0)', 10);
    setTimeout(() => {
      toast.style.transform = 'translateX(100%)';
      setTimeout(() => toast.remove(), 300);
    }, 2500);
    
    setTimeout(() => navigator.clipboard.writeText(''), 15000);
  };

  const handleDelete = () => {
    if (confirm(`🗑️ Delete "${title}"? This cannot be undone.`)) onDelete(id);
  };

  const getDomainIcon = (url?: string) => {
    if (!url) return '🔐';
    if (url.includes('google')) return '🟦';
    if (url.includes('facebook')) return '🔵';
    if (url.includes('instagram')) return '🟣';
    if (url.includes('twitter')) return '🐦';
    if (url.includes('github')) return '⚫';
    return '🌐';
  };

  return (
    <div className={`group relative overflow-hidden rounded-3xl shadow-2xl transition-all duration-500 hover:scale-[1.02] hover:rotate-1 ${
      isDark 
        ? 'bg-gradient-to-br from-slate-800/90 via-slate-800/95 to-slate-900/90 border border-purple-500/30 shadow-purple-900/30' 
        : 'bg-gradient-to-br from-white/95 via-blue-50/90 to-indigo-50/95 border border-blue-200/60 shadow-blue-900/20'
    } backdrop-blur-xl hover:shadow-3xl`}>
      
      {/* Animated gradient overlay */}
      <div className={`absolute top-0 left-0 right-0 h-2 ${
        isDark 
          ? 'bg-gradient-to-r from-purple-500 via-blue-500 to-indigo-500' 
          : 'bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500'
      } animate-pulse`} />

      {/* Floating orb decoration */}
      <div className={`absolute -top-10 -right-10 w-20 h-20 rounded-full opacity-20 ${
        isDark 
          ? 'bg-gradient-to-br from-purple-500 to-blue-600' 
          : 'bg-gradient-to-br from-blue-400 to-indigo-500'
      } blur-2xl group-hover:animate-pulse`} />
      
      <div className="relative p-6">
        {/* Header */}
        <div className="flex justify-between items-start mb-6">
          <div className="flex items-center space-x-4">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shadow-lg transition-transform duration-300 group-hover:scale-110 ${
              isDark 
                ? 'bg-gradient-to-br from-purple-600/50 to-indigo-700/50 border border-purple-500/30' 
                : 'bg-gradient-to-br from-blue-500/20 to-indigo-600/20 border border-blue-300/50'
            }`}>
              {getDomainIcon(url)}
            </div>
            <div>
              <h3 className={`text-xl font-bold transition-colors duration-300 ${
                isDark ? 'text-white group-hover:text-purple-200' : 'text-gray-900 group-hover:text-blue-700'
              }`}>
                {title}
              </h3>
              {url && (
                <a href={url.startsWith('http') ? url : `https://${url}`} 
                   target="_blank" rel="noopener noreferrer"
                   className={`text-sm font-medium transition-all duration-300 hover:underline ${
                     isDark ? 'text-purple-300 hover:text-purple-200' : 'text-blue-600 hover:text-blue-800'
                   }`}>
                  {url.replace(/^https?:\/\//, '')}
                </a>
              )}
            </div>
          </div>
          
          <div className="flex space-x-2 opacity-70 group-hover:opacity-100 transition-opacity">
            <button onClick={() => onEdit(id)}
                    className={`px-4 py-2 rounded-xl text-sm font-bold transition-all duration-300 hover:scale-110 active:scale-95 shadow-lg ${
                      isDark 
                        ? 'bg-gradient-to-r from-amber-600/30 to-yellow-600/30 text-amber-200 hover:from-amber-500/50 hover:to-yellow-500/50 border border-amber-500/30' 
                        : 'bg-gradient-to-r from-amber-100 to-yellow-100 text-amber-700 hover:from-amber-200 hover:to-yellow-200 border border-amber-300'
                    }`}>
              ✏️ Edit
            </button>
            <button onClick={handleDelete}
                    className={`px-4 py-2 rounded-xl text-sm font-bold transition-all duration-300 hover:scale-110 active:scale-95 shadow-lg ${
                      isDark 
                        ? 'bg-gradient-to-r from-red-600/30 to-pink-600/30 text-red-200 hover:from-red-500/50 hover:to-pink-500/50 border border-red-500/30' 
                        : 'bg-gradient-to-r from-red-100 to-pink-100 text-red-700 hover:from-red-200 hover:to-pink-200 border border-red-300'
                    }`}>
              🗑️ Delete
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="space-y-4">
          {/* Username */}
          <div className={`group/item flex justify-between items-center p-4 rounded-2xl transition-all duration-300 hover:scale-[1.01] ${
            isDark ? 'bg-slate-700/60 hover:bg-slate-700/80 border border-slate-600/50' : 'bg-blue-50/60 hover:bg-blue-50/80 border border-blue-200/50'
          } backdrop-blur-sm`}>
            <div className="flex items-center space-x-3">
              <span className="text-lg">👤</span>
              <div>
                <span className={`text-xs font-bold uppercase tracking-wider ${
                  isDark ? 'text-purple-300' : 'text-blue-600'
                }`}>
                  Username
                </span>
                <p className={`font-mono font-medium ${
                  isDark ? 'text-white' : 'text-gray-900'
                }`}>
                  {username}
                </p>
              </div>
            </div>
            <button onClick={() => copy(username, 'Username')}
                    className={`p-3 rounded-xl transition-all duration-300 hover:scale-125 active:scale-95 opacity-60 group-hover/item:opacity-100 ${
                      isDark ? 'text-purple-400 hover:bg-purple-500/20' : 'text-blue-500 hover:bg-blue-100'
                    }`}>
              📋
            </button>
          </div>

          {/* Password */}
          <div className={`group/item flex justify-between items-center p-4 rounded-2xl transition-all duration-300 hover:scale-[1.01] ${
            isDark ? 'bg-slate-700/60 hover:bg-slate-700/80 border border-slate-600/50' : 'bg-blue-50/60 hover:bg-blue-50/80 border border-blue-200/50'
          } backdrop-blur-sm`}>
            <div className="flex items-center space-x-3">
              <span className="text-lg">🔑</span>
              <div>
                <span className={`text-xs font-bold uppercase tracking-wider ${
                  isDark ? 'text-purple-300' : 'text-blue-600'
                }`}>
                  Password
                </span>
                <p className={`font-mono font-medium transition-all duration-300 ${
                  isDark ? 'text-white' : 'text-gray-900'
                }`}>
                  {showPassword ? password : '••••••••••••'}
                </p>
              </div>
            </div>
            <div className="flex space-x-2 opacity-60 group-hover/item:opacity-100">
              <button onClick={() => setShowPassword(!showPassword)}
                      className={`p-3 rounded-xl transition-all duration-300 hover:scale-125 active:scale-95 ${
                        isDark ? 'text-purple-400 hover:bg-purple-500/20' : 'text-blue-500 hover:bg-blue-100'
                      }`}>
                {showPassword ? '🙈' : '👁️'}
              </button>
              <button onClick={() => copy(password, 'Password')}
                      className={`p-3 rounded-xl transition-all duration-300 hover:scale-125 active:scale-95 ${
                        isDark ? 'text-purple-400 hover:bg-purple-500/20' : 'text-blue-500 hover:bg-blue-100'
                      }`}>
                📋
              </button>
            </div>
          </div>

          {/* Notes */}
          {notes && (
            <div className={`p-4 rounded-2xl transition-all duration-300 hover:scale-[1.01] ${
              isDark ? 'bg-slate-700/60 hover:bg-slate-700/80 border border-slate-600/50' : 'bg-blue-50/60 hover:bg-blue-50/80 border border-blue-200/50'
            } backdrop-blur-sm`}>
              <div className="flex items-start space-x-3">
                <span className="text-lg mt-1">📝</span>
                <div>
                  <span className={`text-xs font-bold uppercase tracking-wider ${
                    isDark ? 'text-purple-300' : 'text-blue-600'
                  }`}>
                    Notes
                  </span>
                  <p className={`text-sm mt-2 leading-relaxed ${
                    isDark ? 'text-slate-200' : 'text-gray-700'
                  }`}>
                    {notes}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
