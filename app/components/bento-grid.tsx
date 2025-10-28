"use client"

import type React from "react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"
import { LucideIcon } from "lucide-react"

interface BentoGridProps {
  items: {
    title: string
    description: string
    icon: LucideIcon
    className?: string
  }[]
}

const BentoGrid = ({ items }: BentoGridProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 auto-rows-fr gap-6">
      {items.map((item, index) => (
        <motion.div
          key={index}
          className={cn(
            "group relative overflow-hidden rounded-xl border border-white/10 backdrop-blur-sm p-8 transition-all duration-500",
            items.length % 3 === 1 && index === items.length - 1 ? "md:col-span-3" : 
            items.length % 3 === 2 && index >= items.length - 2 ? "md:col-span-2" : "",
            item.className,
          )}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
          viewport={{ once: true, margin: "-100px" }}
          whileHover={{
            y: -5,
            boxShadow: "0 10px 30px -15px rgba(138, 43, 226, 0.3)",
          }}
        >
          {/* Background gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#0a0a0a] via-black to-[#0a0a0a] opacity-80" />

          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-primary/10 rounded-full blur-2xl" />

          {/* Grid pattern */}
          <div className="absolute inset-0 bg-[radial-gradient(rgba(138,43,226,0.05)_1px,transparent_1px)] bg-[size:20px_20px] opacity-20" />

          {/* Hover effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-primary/0 via-primary/10 to-primary/0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 ease-in-out" />

          {/* Content */}
          <div className="relative flex flex-col min-h-[200px] z-10">
            <div className="mb-4 transform">
              {item.icon && <item.icon className="w-8 h-8" />}
            </div>
            <h3 className="text-xl font-bold mb-2">
              {item.title}
            </h3>
            <p className="text-white/70">{item.description}</p>

            {/* Bottom decorative line */}
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-primary/30 to-transparent transform translate-y-0.5 group-hover:opacity-100 opacity-0 transition-opacity duration-300" />
          </div>
        </motion.div>
      ))}
    </div>
  )
}

export default BentoGrid
