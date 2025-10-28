import { Cpu, Sparkles, Zap, MessageSquare, Code, LucideIcon } from "lucide-react"

interface Service {
  id: string
  titleKey: string
  descriptionKey: string
  icon: LucideIcon
  className: string
}

export const services: Service[] = [
  {
    id: "ai-development",
    titleKey: "services.aiDevelopment.title",
    descriptionKey: "services.aiDevelopment.description",
    icon: Cpu,
    className: "md:col-span-2",
  },
  {
    id: "machine-learning",
    titleKey: "services.machineLearning.title",
    descriptionKey: "services.machineLearning.description",
    icon: Sparkles,
    className: "",
  },
  {
    id: "data-analysis",
    titleKey: "services.dataAnalysis.title",
    descriptionKey: "services.dataAnalysis.description",
    icon: Zap,
    className: "",
  },
  {
    id: "chatbot-development",
    titleKey: "services.chatbotDevelopment.title",
    descriptionKey: "services.chatbotDevelopment.description",
    icon: MessageSquare,
    className: "md:col-span-2",
  },
]
