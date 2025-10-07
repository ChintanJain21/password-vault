import { VaultItem } from '@/types';

const API_BASE = '/api/vault';

export async function fetchVaultItems(): Promise<VaultItem[]> {
  const res = await fetch(API_BASE, {
    method: 'GET',
    credentials: 'include',
  });
  if (!res.ok) throw new Error('Failed to fetch vault items');
  return res.json();
}

export async function createVaultItem(data: Omit<VaultItem, '_id' | 'userId' | 'createdAt' | 'updatedAt'>): Promise<VaultItem> {
  const res = await fetch(API_BASE, {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to create vault item');
  return res.json();
}

export async function updateVaultItem(data: VaultItem & { id: string }): Promise<VaultItem> {
  const res = await fetch(API_BASE, {
    method: 'PUT',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to update vault item');
  return res.json();
}

export async function deleteVaultItem(id: string): Promise<{ message: string }> {
  const url = new URL(API_BASE, window.location.origin);
  url.searchParams.append('id', id);

  const res = await fetch(url.toString(), {
    method: 'DELETE',
    credentials: 'include',
  });
  if (!res.ok) throw new Error('Failed to delete vault item');
  return res.json();
}
