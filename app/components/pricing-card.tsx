"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Check } from "lucide-react"
import { cn } from "@/lib/utils"
import { useTranslations } from "next-intl"
import Link from "next/link"

interface PricingCardProps {
  plan: {
    title: string
    price: string
    description: string
    features: string[]
    highlighted: boolean
  }
}

const PricingCard = ({ plan }: PricingCardProps) => {
  const t = useTranslations()

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true, margin: "-100px" }}
    >
      <Card
        className={cn(
          "h-full flex flex-col overflow-hidden transition-all duration-300",
          plan.highlighted
            ? "bg-primary/10 border-primary shadow-lg shadow-primary/20 scale-105 md:scale-110"
            : "bg-[#0a0a0a] border-[#0a0a0a] hover:bg-[#0a0a0a]/80",
        )}
      >
        <CardHeader className="pb-0">
          <CardTitle className="text-2xl">{plan.title}</CardTitle>
        </CardHeader>
        <CardContent className="pt-6 flex-grow">
          <div className="mb-6">
            <p className="text-4xl font-bold">{plan.price}</p>
            <p className="text-white/70 mt-1">{plan.description}</p>
          </div>
          <ul className="space-y-3">
            {plan.features.map((feature, index) => (
              <li key={index} className="flex items-start">
                <Check className="mr-2 h-5 w-5 text-primary shrink-0 mt-0.5" />
                <span className="text-white/70">{feature}</span>
              </li>
            ))}
          </ul>
        </CardContent>
        <CardFooter>
          <Link href="/#contact" className="w-full">
            <Button
              className={cn("w-full text-bright", plan.highlighted ? "" : "bg-white/10 hover:bg-white/20 text-white")}
              variant={plan.highlighted ? "default" : "outline"}
            >
              {t("pricing.getStarted")}
            </Button>
          </Link>
        </CardFooter>
      </Card>
    </motion.div>
  )
}

export default PricingCard
