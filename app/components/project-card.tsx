"use client"

import Image from "next/image"
import { motion } from "framer-motion"
import { useTranslations } from "next-intl"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { ChevronRight } from "lucide-react"

interface ProjectCardProps {
  project: {
    id: number
    title: string
    description: string
    image: string
    tags: string[]
    link: string
  }
  onClick: () => void
}

const ProjectCard = ({ project, onClick }: ProjectCardProps) => {
  const t = useTranslations()

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true, margin: "-100px" }}
    >
      <Card
        className="overflow-hidden bg-[#0a0a0a] border-[#0a0a0a] hover:bg-[#0a0a0a]/80 transition-colors cursor-pointer h-full flex flex-col"
        onClick={onClick}
      >
        <div className="relative aspect-video overflow-hidden">
          <Image
            src={project.image || "/placeholder.svg"}
            alt={project.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </div>
        <CardContent className="p-6 flex-grow">
          <h3 className="text-xl font-bold mb-2">{project.title}</h3>
          <p className="text-white/70 mb-4">{project.description}</p>
          <div className="flex flex-wrap gap-2">
            {project.tags.map((tag) => (
              <Badge key={tag} variant="secondary" className="bg-primary/20 text-primary">
                {tag}
              </Badge>
            ))}
          </div>
        </CardContent>
        <CardFooter className="p-6 pt-0">
          <button className="text-bright flex items-center text-sm font-medium">
            {t("projects.viewDetails")}
            <ChevronRight className="ml-1 h-4 w-4" />
          </button>
        </CardFooter>
      </Card>
    </motion.div>
  )
}

export default ProjectCard
