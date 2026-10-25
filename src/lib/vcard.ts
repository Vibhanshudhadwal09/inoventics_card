import type { BusinessProfile } from '../types'

export function downloadVCard(profile: BusinessProfile) {
  const phone = `${profile.phoneCountryCode}${profile.phoneNumber}`.replace(
    /\s+/g,
    '',
  )
  const lines = [
    'BEGIN:VCARD',
    'VERSION:3.0',
    `FN:${profile.businessName}`,
    // Work Info on phone contacts uses ORG — custom field, not company name
    profile.workInfo ? `ORG:${profile.workInfo}` : '',
    `TEL;TYPE=CELL,VOICE:${phone}`,
    profile.website ? `URL:${profile.website}` : '',
    profile.tagline ? `NOTE:${profile.tagline}` : '',
    'END:VCARD',
  ].filter(Boolean)

  const blob = new Blob([lines.join('\n')], {
    type: 'text/vcard;charset=utf-8',
  })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `${profile.businessName.replace(/\s+/g, '-') || 'contact'}.vcf`
  document.body.appendChild(a)
  a.click()
  a.remove()
  URL.revokeObjectURL(url)
}
