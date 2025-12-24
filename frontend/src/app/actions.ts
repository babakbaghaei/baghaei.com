'use server'

import { refresh } from 'next/cache'

export async function submitContactForm(formData: FormData) {
  const name = formData.get('name')
  const email = formData.get('email')
  const phone = formData.get('phone')
  const message = formData.get('message')

  // Simulate a delay
  await new Promise(resolve => setTimeout(resolve, 1000))

  try {
    // Mock success for now since backend is not ready
    // TODO: Integrate with Resend or Nodemailer directly in Next.js
    /* 
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/contact`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, phone, message }),
    })

    if (!response.ok) {
      throw new Error('Failed to submit form')
    }
    */
    
    // Log for debug
    console.log('Form Submitted:', { name, email, phone, message })

    // Refresh the current route to update any server-side data if needed
    refresh()
    
    return { success: true }
  } catch (error) {
    console.error('Form submission error:', error)
    return { success: false, error: 'Failed to send message' }
  }
}
