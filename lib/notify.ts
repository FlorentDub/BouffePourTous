import type { Resource } from './types'

const FROM = process.env.RESEND_FROM || 'BouffePourTous <onboarding@resend.dev>'

export async function notifyNewResource(resource: Resource, meta: SubmissionMeta) {
  const apiKey = process.env.RESEND_API_KEY
  const to = process.env.NOTIFICATION_EMAIL
  if (!apiKey || !to) return

  const subject = `Nouvelle ressource soumise : ${resource.name_fr || resource.name_en}`
  const lines = [
    'Une nouvelle ressource a été soumise et attend validation.',
    '',
    `Nom : ${resource.name_fr || resource.name_en}`,
    `Type : ${resource.type_fr || resource.type_en}`,
    `Adresse : ${[resource.numero, resource.rue].filter(Boolean).join(' ')}, ${resource.ville} ${resource.code_postal}`,
    `Coordonnées : ${resource.latitude}, ${resource.longitude}`,
    `Horaires : ${resource.horaire_fr || resource.horaire_en}`,
    `Conditions : ${resource.conditions_fr || resource.conditions_en}`,
    `Contact : ${resource.contact || '—'}`,
    '',
    '--- Journal de soumission ---',
    `Date : ${new Date().toISOString()}`,
    `Adresse IP : ${meta.ip}`,
    `User-Agent : ${meta.userAgent}`,
  ]

  await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: FROM,
      to: [to],
      subject,
      text: lines.join('\n'),
    }),
  })
}

export type SubmissionMeta = { ip: string; userAgent: string }
