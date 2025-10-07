export interface VaultItem {
  _id?: string;
  userId: string;
  title: string;
  username: string;
  password: string; // This will be encrypted
  url: string;
  notes: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface User {
  _id?: string;
  email: string;
  password: string;
  createdAt?: Date;
}

export interface PasswordOptions {
  length: number;
  includeUppercase: boolean;
  includeLowercase: boolean;
  includeNumbers: boolean;
  includeSymbols: boolean;
  excludeLookalikes: boolean;
}
