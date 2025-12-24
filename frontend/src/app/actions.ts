'use server'

import { refresh } from 'next/cache'

export async function submitContactForm(formData: FormData) {
  const name = formData.get('name')
  const email = formData.get('email') // This might be null if only phone is provided
  const phone = formData.get('phone')
  const message = formData.get('message')

  // Use the internal server URL for backend communication
  const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

  try {
    const response = await fetch(`${backendUrl}/contact`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name, 
        email: email || undefined, 
        phone,
        message 
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || 'Failed to submit form');
    }

    refresh();
    return { success: true };
  } catch (error) {
    console.error('Form submission error:', error);
    return { success: false, error: error.message || 'Failed to send message' };
  }
}