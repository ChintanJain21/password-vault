'use client';

import React, { useState, useEffect } from 'react';
import { VaultItem } from '@/types';

interface VaultListProps {
  items: VaultItem[];
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

export default function VaultList({ items, onEdit, onDelete }: VaultListProps) {
  const [visiblePasswords, setVisiblePasswords] = useState<Set<string>>(new Set());
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    setIsDark(document.documentElement.classList.contains('dark'));
    const observer = new MutationObserver(() => 
      setIsDark(document.documentElement.classList.contains('dark'))
    );
    observer.observe(document.documentElement, { attributes: true });
    return () => observer.disconnect();
  }, []);

  const togglePasswordVisibility = (itemId: string) => {
    const newVisible = new Set(visiblePasswords);
    if (newVisible.has(itemId)) {
      newVisible.delete(itemId);
    } else {
      newVisible.add(itemId);
    }
    setVisiblePasswords(newVisible);
  };

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

  const getDomainIcon = (url?: string) => {
    if (!url) return '🔐';
    if (url.includes('google')) return '🟦';
    if (url.includes('facebook')) return '🔵';
    if (url.includes('instagram')) return '🟣';
    if (url.includes('twitter')) return '🐦';
    if (url.includes('github')) return '⚫';
    return '🌐';
  };

  if (items.length === 0) {
    return (
      <div className={`text-center py-16 rounded-3xl transition-all duration-500 ${
        isDark 
          ? 'bg-gradient-to-br from-slate-800/60 to-slate-900/60 border border-purple-500/30' 
          : 'bg-gradient-to-br from-white/80 to-blue-50/80 border border-blue-200/50'
      } backdrop-blur-xl shadow-2xl`}>
        <div className={`mx-auto w-24 h-24 rounded-full flex items-center justify-center mb-6 shadow-xl ${
          isDark 
            ? 'bg-gradient-to-br from-purple-600/30 to-indigo-700/30 text-purple-300' 
            : 'bg-gradient-to-br from-blue-500/20 to-indigo-600/20 text-blue-500'
        }`}>
          <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
        </div>
        <h3 className={`text-2xl font-bold mb-3 ${isDark ? 'text-white' : 'text-gray-900'}`}>
          Your vault is empty
        </h3>
        <p className={`text-lg ${isDark ? 'text-purple-300' : 'text-blue-600'}`}>
          Add your first password to get started 🚀
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {items.filter((item): item is VaultItem & { _id: string } => typeof item._id === 'string').map((item, index) => (
        <div
          key={item._id}
          className={`group relative overflow-hidden rounded-3xl shadow-2xl transition-all duration-500 hover:scale-[1.02] ${
            isDark 
              ? 'bg-gradient-to-br from-slate-800/90 to-slate-900/90 border border-purple-500/30 shadow-purple-900/30' 
              : 'bg-gradient-to-br from-white/95 to-blue-50/95 border border-blue-200/60 shadow-blue-900/20'
          } backdrop-blur-xl hover:shadow-3xl`}
          style={{ animationDelay: `${index * 100}ms` }}
        >
          
          {/* Animated gradient top border */}
          <div className={`absolute top-0 left-0 right-0 h-1 ${
            isDark 
              ? 'bg-gradient-to-r from-purple-500 via-blue-500 to-indigo-500' 
              : 'bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500'
          } animate-pulse`} />

          {/* Floating orb decoration */}
          <div className={`absolute -top-8 -right-8 w-16 h-16 rounded-full opacity-20 ${
            isDark 
              ? 'bg-gradient-to-br from-purple-500 to-blue-600' 
              : 'bg-gradient-to-br from-blue-400 to-indigo-500'
          } blur-2xl group-hover:animate-pulse`} />
          
          <div className="relative p-6">
            {/* Header */}
            <div className="flex justify-between items-start mb-6">
              <div className="flex items-center space-x-4">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl shadow-lg transition-transform duration-300 group-hover:scale-110 ${
                  isDark 
                    ? 'bg-gradient-to-br from-purple-600/50 to-indigo-700/50 border border-purple-500/30' 
                    : 'bg-gradient-to-br from-blue-500/20 to-indigo-600/20 border border-blue-300/50'
                }`}>
                  {getDomainIcon(item.url)}
                </div>
                
                <div>
                  <h3 className={`text-xl font-bold transition-colors duration-300 ${
                    isDark ? 'text-white group-hover:text-purple-200' : 'text-gray-900 group-hover:text-blue-700'
                  }`}>
                    {item.title}
                  </h3>
                  {item.url && (
                    <a
                      href={item.url.startsWith('http') ? item.url : `https://${item.url}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`text-sm font-medium transition-all duration-300 hover:underline ${
                        isDark ? 'text-purple-300 hover:text-purple-200' : 'text-blue-600 hover:text-blue-800'
                      }`}
                    >
                      {item.url.replace(/^https?:\/\//, '')}
                    </a>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-2 opacity-70 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => onEdit(item._id)}
                  className={`px-4 py-2 rounded-xl text-sm font-bold transition-all duration-300 hover:scale-110 active:scale-95 shadow-lg ${
                    isDark 
                      ? 'bg-gradient-to-r from-amber-600/30 to-yellow-600/30 text-amber-200 hover:from-amber-500/50 hover:to-yellow-500/50 border border-amber-500/30' 
                      : 'bg-gradient-to-r from-amber-100 to-yellow-100 text-amber-700 hover:from-amber-200 hover:to-yellow-200 border border-amber-300'
                  }`}
                >
                  ✏️ Edit
                </button>
                <button
                  onClick={() => onDelete(item._id)}
                  className={`px-4 py-2 rounded-xl text-sm font-bold transition-all duration-300 hover:scale-110 active:scale-95 shadow-lg ${
                    isDark 
                      ? 'bg-gradient-to-r from-red-600/30 to-pink-600/30 text-red-200 hover:from-red-500/50 hover:to-pink-500/50 border border-red-500/30' 
                      : 'bg-gradient-to-r from-red-100 to-pink-100 text-red-700 hover:from-red-200 hover:to-pink-200 border border-red-300'
                  }`}
                >
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
                      {item.username}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => copy(item.username, 'Username')}
                  className={`p-3 rounded-xl transition-all duration-300 hover:scale-125 active:scale-95 opacity-60 group-hover/item:opacity-100 ${
                    isDark ? 'text-purple-400 hover:bg-purple-500/20' : 'text-blue-500 hover:bg-blue-100'
                  }`}
                >
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
                      {visiblePasswords.has(item._id) ? item.password : '••••••••••••'}
                    </p>
                  </div>
                </div>
                <div className="flex space-x-2 opacity-60 group-hover/item:opacity-100">
                  <button
                    onClick={() => togglePasswordVisibility(item._id)}
                    className={`p-3 rounded-xl transition-all duration-300 hover:scale-125 active:scale-95 ${
                      isDark ? 'text-purple-400 hover:bg-purple-500/20' : 'text-blue-500 hover:bg-blue-100'
                    }`}
                  >
                    {visiblePasswords.has(item._id) ? '🙈' : '👁️'}
                  </button>
                  <button
                    onClick={() => copy(item.password, 'Password')}
                    className={`p-3 rounded-xl transition-all duration-300 hover:scale-125 active:scale-95 ${
                      isDark ? 'text-purple-400 hover:bg-purple-500/20' : 'text-blue-500 hover:bg-blue-100'
                    }`}
                  >
                    📋
                  </button>
                </div>
              </div>

              {/* Notes */}
              {item.notes && (
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
                        {item.notes}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
