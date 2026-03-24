import { Metadata } from 'next'
import { generatePageMetadata } from '@/lib/i18n-server'

export const generateMetadata = async (): Promise<Metadata> => generatePageMetadata('bloggers')

export default ({ children }: { children: React.ReactNode }) => children
