"use client"

import { useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import { useLocale, useTranslations } from "next-intl"
import { Check, Globe } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { locales, defaultLocale } from "@/i18n/request"

export default function LanguageSwitcher() {
  const t = useTranslations("language")
  const locale = useLocale()
  const router = useRouter()
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)

  const handleLocaleChange = (newLocale: string) => {
    // Get the path without the locale prefix
    const pathWithoutLocale = pathname.replace(`/${locale}`, "") || "/"

    // Construct the new path with the new locale
    const newPath =`/${newLocale}${pathWithoutLocale === "/" ? "" : pathWithoutLocale}`

    router.push(newPath)
    setIsOpen(false)
  }

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="rounded-full w-9 h-9 bg-white/5 border border-white/10 hover:bg-white/10"
        >
          <Globe className="h-4 w-4" />
          <span className="sr-only">{t("select")}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="bg-black/80 backdrop-blur-xl border border-white/10 rounded-xl">
        {locales.map((loc) => (
          <DropdownMenuItem
            key={loc}
            className={`flex items-center gap-2 cursor-pointer ${
              locale === loc ? "text-primary" : "text-white/70"
            } hover:text-white hover:bg-white/5`}
            onClick={() => handleLocaleChange(loc)}
          >
            {locale === loc && <Check className="h-4 w-4" />}
            <span className={locale === loc ? "ml-0" : "ml-6"}>{t(loc)}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
