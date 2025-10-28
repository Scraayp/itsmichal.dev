import { getRequestConfig } from "next-intl/server"

export const locales = ["en", "es", "fr", "de", "ja"]
export const defaultLocale = "en"

export default getRequestConfig(async ({ locale }) => {
  const selectedLocale = locale || defaultLocale
  try {
    const messages = (await import(`../messages/${selectedLocale}.json`)).default
    return {
      locale: selectedLocale,
      messages,
    }
  } catch (error) {
    return {
      locale: defaultLocale,
      messages: (await import(`../messages/${defaultLocale}.json`)).default,
    }
  }
})
