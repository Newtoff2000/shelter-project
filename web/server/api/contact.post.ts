import { Resend } from 'resend'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)

  const { name, email, message, animalName, website } = body ?? {}

  // Honeypot: if the hidden "website" field is filled, silently succeed.
  // Stays first so bots get no signal from the guards below.
  if (website) return { ok: true }

  // Reject forged cross-site POSTs (CSRF mitigation) before any work.
  assertSameOrigin(event)

  // Best-effort IP rate limit — throttle floods before validation/email.
  checkRateLimit(event)

  // Validate required fields
  if (!name || !email || !message) {
    throw createError({ statusCode: 400, statusMessage: 'Missing required fields' })
  }

  // Validate email format — without this a malformed address (e.g. "a") passes
  // straight to Resend, which fails opaquely: the visitor sees a generic 500 and
  // the shelter never receives the enquiry.
  const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (typeof email !== 'string' || !emailRe.test(email.trim())) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid email address' })
  }

  // Cap field lengths so a script can't flood the shelter inbox with huge payloads.
  const tooLong =
    String(name).length > 200 ||
    String(email).length > 254 || // RFC 5321 max email length
    String(message).length > 5000 ||
    (animalName != null && String(animalName).length > 100)
  if (tooLong) {
    throw createError({ statusCode: 400, statusMessage: 'Field too long' })
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
