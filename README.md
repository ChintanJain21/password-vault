# Password Vault - Secure Password Manager

A modern, secure password manager built with Next.js 15, MongoDB, and client-side encryption featuring beautiful dynamic light/dark themes.

## 🔐 Security Features

- **Client-side encryption** using Web Crypto API (AES-GCM + PBKDF2)
- **Master password system** - never stored on server
- **Auto-clearing clipboard** (15 seconds)
- **Zero-knowledge architecture** - server never sees plaintext
- **Exclude look-alike characters** in password generation

## ✨ Features

- 🎨 **Dynamic light/dark themes** with smooth transitions
- 🔑 **Advanced password generator** with strength meter
- 🔍 **Search and filter** vault items
- 📱 **Fully responsive** design
- 🍞 **Toast notifications** for better UX
- ⚡ **Real-time encryption/decryption**

## 🚀 Live Demo

**🔗 [Live Demo](https://password-vault-flame.vercel.app/)**

## 🛠️ Tech Stack

- **Frontend**: Next.js 15, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: MongoDB Atlas
- **Authentication**: NextAuth.js
- **Encryption**: Web Crypto API
- **Deployment**: Vercel


## 🔒 Encryption Details

This app uses the **Web Crypto API** for client-side encryption because:
- Built into modern browsers (no external dependencies)
- Provides robust AES-GCM encryption with PBKDF2 key derivation (100,000 iterations)
- Ensures server never sees plaintext passwords, maintaining true zero-knowledge architecture

## 🏃‍♂️ Quick Start

### Prerequisites
- Node.js 18+
- MongoDB Atlas account

### Installation

1. **Clone the repository**
git clone https://github.com/your-username/password-vault.git
cd password-vault
