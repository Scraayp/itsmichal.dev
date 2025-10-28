"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Quote } from "lucide-react"

interface ReviewCardProps {
  review: {
    name: string
    company: string
    image: string
    review: string
  }
}

const ReviewCard = ({ review }: ReviewCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true, margin: "-100px" }}
    >
      <Card className="bg-[#0a0a0a] border-[#0a0a0a] hover:bg-[#0a0a0a]/80 transition-colors h-full">
        <CardHeader className="pb-2">
          <div className="flex items-center gap-4">
            <Avatar className="h-12 w-12">
              <AvatarImage src={review.image || "/placeholder.svg"} alt={review.name} />
              <AvatarFallback>{review.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <h4 className="font-semibold">{review.name}</h4>
              <p className="text-sm text-white/70">{review.company}</p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <p className="pt-4 text-white/70 italic">{review.review}</p>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

export default ReviewCard
