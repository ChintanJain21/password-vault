import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import VaultItem from '@/lib/models/VaultItem';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  await dbConnect();

  const items = await VaultItem.find({ userId: session.user.id }).sort({ createdAt: -1 }).lean();

  return NextResponse.json(items);
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const data = await req.json();

  if (!data.title || !data.password || !data.username) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }

  await dbConnect();

  const newItem = new VaultItem({
    userId: session.user.id,
    title: data.title,
    username: data.username,
    password: data.password,
    url: data.url || '',
    notes: data.notes || '',
  });

  await newItem.save();

  return NextResponse.json(newItem, { status: 201 });
}

export async function PUT(req: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const data = await req.json();

  if (!data.id || !data.title || !data.password || !data.username) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }

  await dbConnect();

  const updatedItem = await VaultItem.findOneAndUpdate(
    { _id: data.id, userId: session.user.id },
    {
      title: data.title,
      username: data.username,
      password: data.password,
      url: data.url || '',
      notes: data.notes || '',
    },
    { new: true }
  );

  if (!updatedItem) {
    return NextResponse.json({ error: 'Item not found' }, { status: 404 });
  }

  return NextResponse.json(updatedItem);
}

export async function DELETE(req: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');

  if (!id) {
    return NextResponse.json({ error: 'Missing id parameter' }, { status: 400 });
  }

  await dbConnect();

  const deleted = await VaultItem.findOneAndDelete({ _id: id, userId: session.user.id });

  if (!deleted) {
    return NextResponse.json({ error: 'Item not found' }, { status: 404 });
  }

  return NextResponse.json({ message: 'Item deleted' });
}
