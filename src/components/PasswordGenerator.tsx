'use client';

import React, { useState, useEffect } from 'react';

interface PasswordGeneratorProps {
  onGenerate: (password: string) => void;
}

export default function PasswordGenerator({ onGenerate }: PasswordGeneratorProps) {
  const [length, setLength] = useState(12);
  const [includeUppercase, setIncludeUppercase] = useState(true);
  const [includeLowercase, setIncludeLowercase] = useState(true);
  const [includeNumbers, setIncludeNumbers] = useState(true);
  const [includeSymbols, setIncludeSymbols] = useState(true);
  const [excludeLookAlikes, setExcludeLookAlikes] = useState(true);
  const [generatedPassword, setGeneratedPassword] = useState('');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);

  // Detect dark mode
  useEffect(() => {
    const checkDarkMode = () => {
      setIsDarkMode(document.documentElement.classList.contains('dark'));
    };
    
    checkDarkMode();
    
    // Watch for theme changes
    const observer = new MutationObserver(checkDarkMode);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    
    return () => observer.disconnect();
  }, []);

  // Calculate password strength
  useEffect(() => {
    const activeOptions = [includeUppercase, includeLowercase, includeNumbers, includeSymbols].filter(Boolean).length;
    const strength = Math.min(100, (length * 2) + (activeOptions * 15));
    setPasswordStrength(strength);
  }, [length, includeUppercase, includeLowercase, includeNumbers, includeSymbols]);

  const generatePassword = () => {
    let uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let lowercase = 'abcdefghijklmnopqrstuvwxyz';
    let numbers = '0123456789';
    let symbols = '!@#$%^&*()_+-=[]{}|;:,.<>?';

    // Exclude look-alikes if enabled
    if (excludeLookAlikes) {
      uppercase = uppercase.replace(/[O]/g, '');
      lowercase = lowercase.replace(/[l]/g, '');
      numbers = numbers.replace(/[01]/g, '');
      symbols = symbols.replace(/[|]/g, '');
    }

    let charset = '';
    if (includeUppercase) charset += uppercase;
    if (includeLowercase) charset += lowercase;
    if (includeNumbers) charset += numbers;
    if (includeSymbols) charset += symbols;

    if (charset === '') {
      alert('Please select at least one character type');
      return;
    }

    let password = '';
    for (let i = 0; i < length; i++) {
      password += charset.charAt(Math.floor(Math.random() * charset.length));
    }

    setGeneratedPassword(password);
  };

  const handleUsePassword = () => {
    if (generatedPassword) {
      onGenerate(generatedPassword);
    }
  };

  const copyToClipboard = async () => {
    if (generatedPassword) {
      try {
        await navigator.clipboard.writeText(generatedPassword);
        
        // Create custom notification
        const notification = document.createElement('div');
        notification.className = `fixed top-4 right-4 px-6 py-3 rounded-2xl shadow-2xl z-50 transition-all duration-300 transform translate-x-full ${
          isDarkMode 
            ? 'bg-emerald-600/90 text-white border border-emerald-500/50' 
            : 'bg-emerald-500 text-white border border-emerald-400'
        }`;
        notification.innerHTML = '✅ Password copied! (Auto-clears in 15s)';
        document.body.appendChild(notification);
        
        setTimeout(() => {
          notification.style.transform = 'translateX(0)';
        }, 100);
        
        setTimeout(() => {
          notification.style.transform = 'translateX(100%)';
          setTimeout(() => notification.remove(), 300);
        }, 3000);
        
        // Auto-clear clipboard after 15 seconds
        setTimeout(async () => {
          try {
            await navigator.clipboard.writeText('');
            console.log('Clipboard cleared after 15 seconds');
          } catch (err) {
            console.log('Could not clear clipboard automatically');
          }
        }, 15000);
        
      } catch (err) {
        console.error('Failed to copy password:', err);
        alert('Failed to copy to clipboard');
      }
    }
  };

  const getStrengthColor = () => {
    if (passwordStrength < 30) return isDarkMode ? 'from-red-500 to-pink-500' : 'from-red-400 to-red-600';
    if (passwordStrength < 60) return isDarkMode ? 'from-yellow-500 to-orange-500' : 'from-yellow-400 to-orange-500';
    if (passwordStrength < 80) return isDarkMode ? 'from-blue-500 to-indigo-500' : 'from-blue-400 to-blue-600';
    return isDarkMode ? 'from-emerald-500 to-green-500' : 'from-emerald-400 to-green-600';
  };

  const getStrengthText = () => {
    if (passwordStrength < 30) return 'Weak';
    if (passwordStrength < 60) return 'Fair';
    if (passwordStrength < 80) return 'Good';
    return 'Strong';
  };

  return (
    <div className={`space-y-6 transition-all duration-500 ${
      isDarkMode 
        ? 'bg-slate-800/60 border border-purple-500/30' 
        : 'bg-white/80 border border-blue-200/50'
    } backdrop-blur-xl rounded-3xl p-8 shadow-2xl`}>
      
      {/* Header */}
      <div className="text-center mb-8">
        <div className={`mx-auto h-16 w-16 rounded-2xl flex items-center justify-center mb-4 shadow-xl transition-all duration-500 ${
          isDarkMode 
            ? 'bg-gradient-to-br from-purple-600 via-indigo-600 to-blue-600 shadow-purple-500/30' 
            : 'bg-gradient-to-br from-blue-500 via-indigo-600 to-purple-600 shadow-blue-500/30'
        }`}>
          <svg className="h-8 w-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
          </svg>
        </div>
        <h3 className={`text-2xl font-bold transition-colors duration-500 ${
          isDarkMode 
            ? 'bg-gradient-to-r from-white via-purple-200 to-blue-200 bg-clip-text text-transparent' 
            : 'bg-gradient-to-r from-gray-900 via-blue-600 to-indigo-600 bg-clip-text text-transparent'
        }`}>
          Password Generator
        </h3>
        <p className={`text-sm mt-2 ${
          isDarkMode ? 'text-purple-300' : 'text-blue-600'
        }`}>
          Create secure passwords with custom settings
        </p>
      </div>
      
      {/* Length Slider */}
      <div className={`p-6 rounded-2xl transition-all duration-300 ${
        isDarkMode 
          ? 'bg-slate-700/50 border border-purple-500/20' 
          : 'bg-blue-50/80 border border-blue-200/50'
      }`}>
        <div className="flex justify-between items-center mb-4">
          <label className={`text-lg font-bold ${
            isDarkMode ? 'text-purple-200' : 'text-blue-700'
          }`}>
            Password Length
          </label>
          <div className={`px-4 py-2 rounded-xl font-bold text-lg ${
            isDarkMode 
              ? 'bg-purple-600/30 text-purple-200 border border-purple-500/50' 
              : 'bg-blue-100 text-blue-700 border border-blue-300'
          }`}>
            {length}
          </div>
        </div>
        
        <input
          type="range"
          min="4"
          max="50"
          value={length}
          onChange={(e) => setLength(parseInt(e.target.value))}
          className={`w-full h-3 rounded-full appearance-none cursor-pointer transition-all duration-300 ${
            isDarkMode 
              ? 'bg-slate-600 slider-thumb-dark' 
              : 'bg-blue-200 slider-thumb-light'
          }`}
          style={{
            background: isDarkMode 
              ? `linear-gradient(to right, #7c3aed 0%, #7c3aed ${(length-4)/46*100}%, #475569 ${(length-4)/46*100}%, #475569 100%)`
              : `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${(length-4)/46*100}%, #bfdbfe ${(length-4)/46*100}%, #bfdbfe 100%)`
          }}
        />
        
        {/* Password Strength Indicator */}
        <div className="mt-4">
          <div className="flex justify-between items-center mb-2">
            <span className={`text-sm font-medium ${
              isDarkMode ? 'text-purple-300' : 'text-blue-600'
            }`}>
              Strength: {getStrengthText()}
            </span>
            <span className={`text-sm ${
              isDarkMode ? 'text-slate-300' : 'text-gray-600'
            }`}>
              {passwordStrength}%
            </span>
          </div>
          <div className={`w-full h-2 rounded-full overflow-hidden ${
            isDarkMode ? 'bg-slate-600' : 'bg-gray-200'
          }`}>
            <div 
              className={`h-full bg-gradient-to-r ${getStrengthColor()} transition-all duration-500 ease-out`}
              style={{ width: `${passwordStrength}%` }}
            />
          </div>
        </div>
      </div>

      {/* Character Options */}
      <div className={`p-6 rounded-2xl transition-all duration-300 ${
        isDarkMode 
          ? 'bg-slate-700/50 border border-purple-500/20' 
          : 'bg-blue-50/80 border border-blue-200/50'
      }`}>
        <h4 className={`text-lg font-bold mb-4 ${
          isDarkMode ? 'text-purple-200' : 'text-blue-700'
        }`}>
          Character Types
        </h4>
        
        <div className="grid grid-cols-1 gap-4">
          {[
            { key: 'includeUppercase', state: includeUppercase, setState: setIncludeUppercase, label: 'Uppercase Letters', example: 'A-Z', icon: '🔤' },
            { key: 'includeLowercase', state: includeLowercase, setState: setIncludeLowercase, label: 'Lowercase Letters', example: 'a-z', icon: '🔡' },
            { key: 'includeNumbers', state: includeNumbers, setState: setIncludeNumbers, label: 'Numbers', example: '0-9', icon: '🔢' },
            { key: 'includeSymbols', state: includeSymbols, setState: setIncludeSymbols, label: 'Symbols', example: '!@#$', icon: '🔣' },
            { key: 'excludeLookAlikes', state: excludeLookAlikes, setState: setExcludeLookAlikes, label: 'Exclude Look-alikes', example: '0,O,l,I,1,|', icon: '👁️' }
          ].map((option) => (
            <label key={option.key} className={`flex items-center justify-between p-4 rounded-xl cursor-pointer transition-all duration-300 hover:scale-[1.02] ${
              option.state
                ? isDarkMode 
                  ? 'bg-purple-600/30 border-2 border-purple-500/50 shadow-lg shadow-purple-500/20' 
                  : 'bg-blue-100 border-2 border-blue-300 shadow-lg shadow-blue-500/20'
                : isDarkMode 
                  ? 'bg-slate-600/30 border-2 border-slate-500/30 hover:bg-slate-600/50' 
                  : 'bg-white/60 border-2 border-gray-200 hover:bg-gray-50'
            }`}>
              <div className="flex items-center space-x-4">
                <span className="text-2xl">{option.icon}</span>
                <div>
                  <span className={`font-bold ${
                    option.state 
                      ? isDarkMode ? 'text-purple-200' : 'text-blue-700'
                      : isDarkMode ? 'text-slate-300' : 'text-gray-700'
                  }`}>
                    {option.label}
                  </span>
                  <div className={`text-sm ${
                    option.state 
                      ? isDarkMode ? 'text-purple-300' : 'text-blue-600'
                      : isDarkMode ? 'text-slate-400' : 'text-gray-500'
                  }`}>
                    {option.example}
                  </div>
                </div>
              </div>
              
              <div className="relative">
                <input
                  type="checkbox"
                  checked={option.state}
                  onChange={(e) => option.setState(e.target.checked)}
                  className="sr-only"
                />
                <div className={`w-14 h-8 rounded-full transition-all duration-300 ${
                  option.state 
                    ? isDarkMode ? 'bg-purple-500' : 'bg-blue-500'
                    : isDarkMode ? 'bg-slate-600' : 'bg-gray-300'
                }`}>
                  <div className={`w-6 h-6 bg-white rounded-full shadow-lg transform transition-all duration-300 ${
                    option.state ? 'translate-x-7 translate-y-1' : 'translate-x-1 translate-y-1'
                  }`} />
                </div>
              </div>
            </label>
          ))}
        </div>
      </div>

      {/* Generate Button */}
      <button
        type="button"
        onClick={generatePassword}
        className={`w-full py-4 px-8 rounded-2xl font-bold text-lg shadow-2xl transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] ${
          isDarkMode 
            ? 'bg-gradient-to-r from-emerald-600 via-green-600 to-teal-600 hover:from-emerald-500 hover:via-green-500 hover:to-teal-500 text-white shadow-emerald-500/30' 
            : 'bg-gradient-to-r from-emerald-500 via-green-500 to-teal-500 hover:from-emerald-400 hover:via-green-400 hover:to-teal-400 text-white shadow-emerald-500/30'
        } flex items-center justify-center space-x-3`}
      >
        <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
        <span>Generate Secure Password</span>
      </button>

      {/* Generated Password Display */}
      {generatedPassword && (
        <div className={`p-6 rounded-2xl transition-all duration-500 animate-fadeIn ${
          isDarkMode 
            ? 'bg-gradient-to-br from-slate-700/80 to-slate-800/80 border border-purple-500/30 shadow-2xl shadow-purple-500/20' 
            : 'bg-gradient-to-br from-green-50 to-emerald-50 border border-emerald-200/50 shadow-2xl shadow-emerald-500/20'
        }`}>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className={`p-3 rounded-xl ${
                isDarkMode 
                  ? 'bg-emerald-600/30 text-emerald-300' 
                  : 'bg-emerald-100 text-emerald-600'
              }`}>
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <label className={`font-bold ${
                  isDarkMode ? 'text-emerald-200' : 'text-emerald-700'
                }`}>
                  Generated Password
                </label>
                <p className={`text-sm ${
                  isDarkMode ? 'text-emerald-300' : 'text-emerald-600'
                }`}>
                  {generatedPassword.length} characters • {getStrengthText()} strength
                </p>
              </div>
            </div>
            
            <button
              type="button"
              onClick={copyToClipboard}
              className={`px-4 py-2 rounded-xl font-medium transition-all duration-300 transform hover:scale-110 active:scale-95 ${
                isDarkMode 
                  ? 'bg-purple-600/30 text-purple-200 border border-purple-500/50 hover:bg-purple-600/50' 
                  : 'bg-blue-100 text-blue-600 border border-blue-300 hover:bg-blue-200'
              } flex items-center space-x-2`}
              title="Copy to clipboard (auto-clears in 15s)"
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              <span>Copy</span>
            </button>
          </div>
          
          <div className={`p-4 rounded-xl font-mono text-lg break-all select-all transition-all duration-300 ${
            isDarkMode 
              ? 'bg-slate-800/80 border border-slate-600/50 text-white' 
              : 'bg-white/80 border border-gray-200 text-gray-900'
          }`}>
            {generatedPassword}
          </div>

          <div className="flex space-x-3 mt-6">
            <button
              type="button"
              onClick={handleUsePassword}
              className={`flex-1 py-3 px-6 rounded-xl font-bold transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] ${
                isDarkMode 
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-lg shadow-blue-500/30' 
                  : 'bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-400 hover:to-indigo-500 text-white shadow-lg shadow-blue-500/30'
              } flex items-center justify-center space-x-2`}
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span>Use This Password</span>
            </button>
            
            <button
              type="button"
              onClick={generatePassword}
              className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 transform hover:scale-105 active:scale-95 ${
                isDarkMode 
                  ? 'bg-slate-600/50 text-slate-300 border border-slate-500/50 hover:bg-slate-600/70' 
                  : 'bg-gray-100 text-gray-600 border border-gray-300 hover:bg-gray-200'
              } flex items-center space-x-2`}
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              <span>Generate New</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
