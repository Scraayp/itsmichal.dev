import { getRequestConfig } from "next-intl/server"

export const locales = ["en", "es", "fr", "de", "ja"]
export const defaultLocale = "en"

// small recursive merge to fill missing keys from defaults without overwriting existing translations
function deepMerge<T extends Record<string, any>>(defaults: T, override: Partial<T>): T {
  const result: Record<string, any> = Array.isArray(defaults) ? [] : {}
  for (const key of Object.keys(defaults)) {
    const defVal = (defaults as any)[key]
    const overVal = (override as any)[key]

    if (overVal === undefined) {
      // missing in override — use default
      result[key] = defVal
    } else if (
      defVal && typeof defVal === "object" && !Array.isArray(defVal) &&
      overVal && typeof overVal === "object" && !Array.isArray(overVal)
    ) {
      // both are plain objects -> merge recursively
      result[key] = deepMerge(defVal, overVal)
    } else {
      // override exists (primitive or array) -> use it
      result[key] = overVal
    }
  }
  // include any extra keys present only in override
  for (const key of Object.keys(override)) {
    if (result[key] === undefined) result[key] = (override as any)[key]
  }
  return result as T
}

export default getRequestConfig(async ({ locale }) => {
  const selectedLocale = locale || defaultLocale
  try {
    if (selectedLocale === defaultLocale) {
      const messages = (await import(`../messages/${defaultLocale}.json`)).default
      return {
        locale: defaultLocale,
        messages,
      }
    }

    // import both selected and default and deep-merge so missing keys fall back to default
    const [selectedModule, defaultModule] = await Promise.all([
      import(`../messages/${selectedLocale}.json`).then(m => m.default).catch(() => ({})),
      import(`../messages/${defaultLocale}.json`).then(m => m.default),
    ])

    const messages = deepMerge(defaultModule, selectedModule)

    return {
      locale: selectedLocale,
      messages,
    }
  } catch (error) {
    // if anything goes wrong, return default locale messages
    return {
      locale: defaultLocale,
      messages: (await import(`../messages/${defaultLocale}.json`)).default,
    }
  }
})
