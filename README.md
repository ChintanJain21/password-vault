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
    ```
    git clone https://github.com/ChintanJain21/password-vault.git
    cd password-vault
     ```
2. **Install dependencies**
 ```
  npm install
 ```
3. **Set up environment variables**
Create `.env.local`:
 ```
MONGODB_URI=your-mongodb-connection-string
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key
NODE_ENV=development
 ```

4. **Run the development server**
    ```
    npm run dev
     ```

## 🌟 Key Features Demo

1. **Sign up** with email/password
2. **Create master password** (this encrypts everything)
3. **Add password entries** with auto-generation
4. **Search and organize** your passwords
5. **Copy passwords** with auto-clear security
6. **Switch themes** seamlessly
   ## 📂 Project Structure
   ```
   src/
    ├── app/
    │ ├── api/ # API routes
    │  ├── login/ # Login page
    │ ├── signup/ # Signup page
    │ └── vault/ # Main vault interface
   ├── components/ # React components
   ├── lib/ # Utilities & database
   └── types/ # TypeScript definitions
   ```
   
## 🚀 Deployment

Deployed on **Vercel** with **MongoDB Atlas**:

1. Push to GitHub
2. Connect to Vercel
3. Add environment variables
4. Deploy automatically.




    
