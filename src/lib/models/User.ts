import mongoose, { Schema, model, models, Document } from 'mongoose';

export interface UserDocument extends Document {
  email: string;
  password: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const UserSchema = new Schema<UserDocument>({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 8,
  },
}, {
  timestamps: true,
});

const UserModel = models.User || model<UserDocument>('User', UserSchema);

export default UserModel;
