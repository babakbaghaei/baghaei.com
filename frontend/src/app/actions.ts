'use server'

import { revalidatePath } from 'next/cache'

export async function submitContactForm(formData: FormData) {
 const name = formData.get('name')
 const email = formData.get('email') // This might be null if only phone is provided
 const phone = formData.get('phone')
 const message = formData.get('message')

 // Use the internal server URL for backend communication
 const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';
 console.log('Submitting to:', `${backendUrl}/api/v1/contact`);

 try {
  const response = await fetch(`${backendUrl}/api/v1/contact`, {
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
   const errorText = await response.text();
   console.error('Backend error response:', errorText);
   throw new Error(`Server error: ${response.status}`);
  }

  revalidatePath('/');
  return { success: true };
 } catch (error: unknown) {
  const errorMessage = error instanceof Error ? error.message : 'Failed to send message';
  console.error('Form submission action error:', error);
  return { success: false, error: errorMessage };
 }
}