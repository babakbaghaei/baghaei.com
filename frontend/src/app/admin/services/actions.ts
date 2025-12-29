'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';

async function getAuthToken() {
  const cookieStore = await cookies();
  return cookieStore.get('admin_token')?.value;
}

export async function createService(formData: FormData) {
  const title = formData.get('title');
  const description = formData.get('description');
  const iconName = formData.get('iconName');
  const order = formData.get('order');

  const token = await getAuthToken();
  
  if (!token) {
    console.error('Unauthorized: No token found');
    throw new Error('Unauthorized');
  }
  
  try {
    const res = await fetch(`${API_URL}/api/v1/services`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        title,
        description,
        iconName,
        order: Number(order),
        published: true
      }),
    });

    if (!res.ok) {
      if (res.status === 401) {
        throw new Error('Unauthorized');
      }
      throw new Error('Failed to create service');
    }

    revalidatePath('/admin/services');
    revalidatePath('/'); // Update home page as well
  } catch (error: any) {
    console.error(error);
    if (error.message === 'Unauthorized') {
      redirect('/admin/login');
    }
    throw error;
  }

  redirect('/admin/services');
}

export async function deleteService(id: number) {
  const token = await getAuthToken();
  if (!token) return;

  try {
    await fetch(`${API_URL}/api/v1/services/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      },
    });
    revalidatePath('/admin/services');
    revalidatePath('/');
  } catch (error) {
    console.error(error);
  }
}
