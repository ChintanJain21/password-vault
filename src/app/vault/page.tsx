import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/mongodb';
import VaultItemModel from '@/lib/models/VaultItem';
import VaultClient from '@/components/VaultClient';
import { redirect } from 'next/navigation';
import type { VaultItem } from '@/types';

interface VaultItemRaw {
  map(arg0: (doc: any) => { _id: string; userId: string; title: any; username: any; password: any; url: any; notes: any; createdAt: any; updatedAt: any; }): VaultItem[];
  _id: unknown;
  userId: unknown;
  title: string;
  username: string;
  password: string;
  url?: string;
  notes?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export default async function VaultPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    redirect('/login');
  }

  await dbConnect();

  const rawItems = await VaultItemModel.find({ userId: session.user.id })
    .sort({ createdAt: -1 })
    .lean<VaultItemRaw>();

  const items: VaultItem[] = rawItems.map((doc) => ({
    _id: (doc._id as { toString: () => string }).toString(),
    userId: (doc.userId as { toString: () => string }).toString(),
    title: doc.title,
    username: doc.username,
    password: doc.password,
    url: doc.url,
    notes: doc.notes,
    createdAt: doc.createdAt,
    updatedAt: doc.updatedAt,
  }));

  return <VaultClient initialItems={items} />;
}
