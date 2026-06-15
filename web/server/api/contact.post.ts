import { Resend } from 'resend'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)

  const { name, email, message, animalName, website } = body ?? {}

  // Honeypot: if the hidden "website" field is filled, silently succeed
  if (website) return { ok: true }

  // Validate required fields
  if (!name || !email || !message) {
    throw createError({ statusCode: 400, statusMessage: 'Missing required fields' })
  }

  const contactEmail = process.env.CONTACT_EMAIL
  const resendKey = process.env.RESEND_API_KEY

  if (!contactEmail || !resendKey) {
    throw createError({ statusCode: 500, statusMessage: 'Email not configured' })
  }

  const subject = animalName
    ? `Adoption enquiry — ${animalName}`
    : `Contact form — Ericeira Paws`

  // Escape user-supplied values before interpolating into the HTML email body
  // to prevent script/markup injection in the recipient's email client.
  const esc = (s: string) =>
    String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')

  const html = `
    <p><strong>From:</strong> ${esc(name)} &lt;${esc(email)}&gt;</p>
    ${animalName ? `<p><strong>Interested in:</strong> ${esc(animalName)}</p>` : ''}
    <p><strong>Message:</strong></p>
    <p>${esc(message).replace(/\n/g, '<br>')}</p>
  `

  const resend = new Resend(resendKey)

  const { error } = await resend.emails.send({
    from: 'Ericeira Paws <noreply@ericeirapaws.com>',
    to: contactEmail,
    replyTo: email,
    subject,
    html,
  })

  if (error) {
    throw createError({ statusCode: 500, statusMessage: 'Failed to send email' })
  }

  return { ok: true }
})
