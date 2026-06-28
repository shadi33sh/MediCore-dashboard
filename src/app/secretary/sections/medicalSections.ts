import type { IconType } from 'react-icons'
import { FaHeartbeat, FaTeeth, FaBaby, FaBrain, FaLungs } from 'react-icons/fa'

export type MedicalSection = {
  name: string
  icon: IconType
  description: string
  href: string
  bg: string
}

export const medicalSections: MedicalSection[] = [
  {
    name: 'Cardiology',
    icon: FaHeartbeat,
    description: 'Heart and blood vessels care.',
    href: '/Secretary/Sections/Cardiology',
    bg: 'bg-red-500',
  },
  {
    name: 'Dentistry',
    icon: FaTeeth,
    description: 'Teeth and oral health.',
    href: '/Secretary/Sections/Dentistry',
    bg: 'bg-blue-700',
  },
  {
    name: 'Pediatrics',
    icon: FaBaby,
    description: 'Child healthcare services.',
    href: '/Secretary/Sections/Pediatrics',
    bg: 'bg-green-700',
  },
  {
    name: 'Neurology',
    icon: FaBrain,
    description: 'Brain and nervous system.',
    href: '/Secretary/Sections/Neurology',
    bg: 'bg-purple-700',
  },
  {
    name: 'Pulmonology',
    icon: FaLungs,
    description: 'Lung and respiratory care.',
    href: '/Secretary/Sections/Pulmonology',
    bg: 'bg-teal-700',
  },
]