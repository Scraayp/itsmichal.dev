"use client"

import { motion } from "framer-motion"

interface TimelineItemProps {
  title: string
  company: string
  period: string
  description: string
}

interface TimelineComponentProps {
  items: TimelineItemProps[]
}

const TimelineComponent = ({ items }: TimelineComponentProps) => {
  return (
    <div className="max-w-3xl mx-auto">
      {items.map((item, index) => (
        <motion.div
          key={index}
          className="relative pl-8 pb-12 last:pb-0"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true, margin: "-100px" }}
        >
          {index < items.length - 1 && (
            <div className="absolute left-3 top-3 bottom-0 w-px bg-gradient-to-b from-primary to-primary/0" />
          )}
          <div className="absolute left-0 top-3 w-6 h-6 rounded-full border-2 border-primary bg-[#0a0a0a] flex items-center justify-center">
            <div className="w-2 h-2 rounded-full bg-primary" />
          </div>
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-2">
              <h3 className="text-xl font-bold">{item.title}</h3>
              <span className="text-primary text-sm sm:ml-2">{item.company}</span>
            </div>
            <p className="text-sm text-white/50 mb-3">{item.period}</p>
            <p className="text-white/70">{item.description}</p>
          </div>
        </motion.div>
      ))}
    </div>
  )
}

export default TimelineComponent
