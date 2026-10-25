export interface SocialLinks {
  website: string
  instagram: string
  whatsapp: string
  call: string
}

export interface ServiceItem {
  id: string
  label: string
}

export interface BusinessProfile {
  logoDataUrl: string | null
  businessName: string
  tagline: string
  phoneCountryCode: string
  phoneNumber: string
  website: string
  socials: SocialLinks
  servicesHeading: string
  services: ServiceItem[]
  footerSlogan: string
}

export const DEFAULT_PROFILE: BusinessProfile = {
  logoDataUrl: null,
  businessName: 'Inoventics Private Limited',
  tagline: 'Innovate • Build • Transform',
  phoneCountryCode: '+91',
  phoneNumber: '8278985815',
  website: 'https://www.inoventics.com',
  socials: {
    website: 'https://www.inoventics.com',
    instagram: 'https://instagram.com/inoventics',
    whatsapp: 'https://wa.me/918278985815',
    call: 'tel:+918278985815',
  },
  servicesHeading: 'Our Services',
  services: [
    { id: '1', label: 'Web Development' },
    { id: '2', label: 'Mobile App Development' },
    { id: '3', label: 'DevOps' },
    { id: '4', label: 'Custom Software Solutions' },
    { id: '5', label: 'Cloud Solutions' },
    { id: '6', label: 'IT Consulting' },
  ],
  footerSlogan: "Let's Build Something Great Together",
}

export const STORAGE_KEY = 'inoventics-business-profile'
