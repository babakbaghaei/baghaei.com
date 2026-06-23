'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { apiV1Url } from '@/lib/apiBase';

const serverBase = process.env.API_INTERNAL_URL || process.env.NEXT_PUBLIC_API_URL;

export async function loginAction(formData: FormData) {
  const email = formData.get('email');
  const password = formData.get('password');

  try {
    const res = await fetch(apiV1Url('/auth/login', serverBase), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    if (!res.ok) {
      return { error: 'ایمیل یا رمز عبور اشتباه است.' };
    }

    const data = await res.json();
    const token = data.access_token;

    if (token) {
      // Securely set the cookie
      const cookieStore = await cookies();
      cookieStore.set('admin_token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        path: '/',
        maxAge: 60 * 60 * 24, // 1 day
        sameSite: 'strict',
      });
    }
  } catch (error) {
    console.error('Login error:', error);
    return { error: 'خطا در برقراری ارتباط با سرور.' };
  }

  redirect('/admin');
}

export async function logoutAction() {
  const cookieStore = await cookies();
  cookieStore.delete('admin_token');
  redirect('/admin/login');
}
