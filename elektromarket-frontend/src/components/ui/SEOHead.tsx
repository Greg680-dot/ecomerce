import { useEffect } from 'react'
import { APP_NAME } from '../../utils/constants'

interface SEOHeadProps {
  title?: string
  description?: string
  keywords?: string
}

export function SEOHead({ title, description, keywords }: SEOHeadProps) {
  useEffect(() => {
    document.title = title ? `${title} | ${APP_NAME}` : APP_NAME

    const metaDescription = document.querySelector('meta[name="description"]')
    if (metaDescription && description) {
      metaDescription.setAttribute('content', description)
    }

    if (keywords) {
      let metaKeywords = document.querySelector('meta[name="keywords"]')
      if (!metaKeywords) {
        metaKeywords = document.createElement('meta')
        metaKeywords.setAttribute('name', 'keywords')
        document.head.appendChild(metaKeywords)
      }
      metaKeywords.setAttribute('content', keywords)
    }
  }, [title, description, keywords])

  return null
}
