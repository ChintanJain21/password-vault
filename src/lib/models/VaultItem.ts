import  { Schema, model, models, Document, Types } from 'mongoose';

export interface VaultItemDocument extends Document {
  userId: Types.ObjectId;
  title: string;
  username: string;
  password: string;
  url?: string;
  notes?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const VaultItemSchema = new Schema<VaultItemDocument>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
  },
  password: {
    type: String, // Encrypted on client-side
    required: true,
  },
  url: {
    type: String,
    default: '',
  },
  notes: {
    type: String,
    default: '',
  },
}, {
  timestamps: true,
});

const VaultItemModel = models.VaultItem || model<VaultItemDocument>('VaultItem', VaultItemSchema);

export default VaultItemModel;
