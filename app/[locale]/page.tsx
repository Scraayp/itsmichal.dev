"use client"

import { useState, useEffect, useRef } from "react"
import Image from "next/image"
import Link from "next/link"
import { motion, useScroll, useTransform } from "framer-motion"
import { useTranslations } from "next-intl"
import { ChevronRight, Mail, Github, Linkedin, Twitter, Menu, X, MessageSquare } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import FlowBackground from "@/app/components/flow-background"
import BentoGrid from "@/app/components/bento-grid"
import ProjectCard from "@/app/components/project-card"
import TimelineComponent from "@/app/components/timeline"
import PricingCard from "@/app/components/pricing-card"
import ReviewCard from "@/app/components/review-card"
import GridPattern from "@/app/components/grid-pattern"
import LanguageSwitcher from "@/app/components/language-switcher"

import { site, services, projects, experience, pricing, reviews } from "@/config"

export default function Home() {
  const t = useTranslations()
  const [activeSection, setActiveSection] = useState("home")
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [selectedProject, setSelectedProject] = useState(null)

  const heroRef = useRef(null)
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  })

  const y = useTransform(scrollYProgress, [0, 1], [0, 200])
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0])

  const sections = site.navigation.map((item) => item.name)

  const sectionRefs = {
    home: useRef(null),
    services: useRef(null),
    projects: useRef(null),
    experience: useRef(null),
    pricing: useRef(null),
    reviews: useRef(null),
    contact: useRef(null),
  }

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 100

      for (const section of sections) {
        const element = sectionRefs[section].current
        if (!element) continue

        const offsetTop = element.offsetTop
        const offsetHeight = element.offsetHeight

        if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
          setActiveSection(section)
          break
        }
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [sections])

  const scrollToSection = (section: string) => {
    setMobileMenuOpen(false)
    const element = sectionRefs[section].current
    if (element) {
      const offsetTop = element.offsetTop
      window.scrollTo({
        top: offsetTop - 80,
        behavior: "smooth",
      })
    }
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Navbar */}
      <header className="fixed top-0 left-0 right-0 z-50 px-4 py-3 mt-4 sm:mt-6">
        <div className="mx-auto max-w-5xl">
          <div className="relative bg-black/30 backdrop-blur-xl border border-white/10 rounded-2xl shadow-lg shadow-black/20 px-4 py-3">
            <div className="flex items-center justify-between">
              <Link href="/" className="flex items-center space-x-2 group">
                <Image src="/logo.svg" alt="Buzz.AI Logo" width={42} height={32} />
              </Link>

              <nav className="hidden md:flex items-center space-x-1">
                {site.navigation.map((item) => (
                  <button
                    key={item.name}
                    onClick={() => scrollToSection(item.name)}
                    className={cn(
                      "relative px-4 py-2 text-sm font-medium rounded-xl transition-all duration-300",
                      activeSection === item.name
                        ? "text-white bg-primary/20 shadow-sm shadow-primary/20"
                        : "text-white/70 hover:text-white hover:bg-white/5",
                    )}
                  >
                    {activeSection === item.name && (
                      <motion.span
                        layoutId="navbar-active-pill"
                        className="absolute inset-0 bg-primary/20 rounded-xl"
                        style={{ borderRadius: 12 }}
                        transition={{ type: "spring", duration: 0.6 }}
                      />
                    )}
                    <span className="relative z-10">{t(`nav.${item.name}`)}</span>
                  </button>
                ))}
              </nav>

              <div className="flex items-center gap-2">
                <LanguageSwitcher />

                <Button
                  className="hidden md:flex bg-gradient-to-r from-primary to-primary/80 hover:from-primary hover:to-primary shadow-md shadow-primary/20 hover:shadow-lg hover:shadow-primary/30 transition-all duration-300 text-white"
                  onClick={() => scrollToSection("contact")}
                >
                  {t("nav.letsTalk")}
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Button>

                <button
                  className="md:hidden relative w-10 h-10 flex items-center justify-center rounded-xl bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-colors"
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  aria-label="Toggle menu"
                >
                  {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="md:hidden mt-2 mx-auto max-w-5xl"
          >
            <div className="bg-black/50 backdrop-blur-xl border border-white/10 rounded-2xl shadow-lg shadow-black/20 overflow-hidden">
              <nav className="flex flex-col p-4">
                {site.navigation.map((item) => (
                  <button
                    key={item.name}
                    onClick={() => scrollToSection(item.name)}
                    className={cn(
                      "text-sm font-medium transition-colors px-4 py-3 rounded-xl mb-1 last:mb-0",
                      activeSection === item.name
                        ? "bg-primary/20 text-white"
                        : "text-white/70 hover:text-white hover:bg-white/5",
                    )}
                  >
                    {t(`nav.${item.name}`)}
                  </button>
                ))}
                <Button
                  className="mt-3 bg-gradient-to-r from-primary to-primary/80 hover:from-primary hover:to-primary shadow-md shadow-primary/20 text-white"
                  onClick={() => {
                    scrollToSection("contact")
                    setMobileMenuOpen(false)
                  }}
                >
                  {t("nav.letsTalk")}
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </nav>
            </div>
          </motion.div>
        )}
      </header>

      {/* Hero Section */}
      <section
        ref={(el) => {
          sectionRefs.home.current = el
          heroRef.current = el
        }}
        className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20"
      >
        <FlowBackground />

        <motion.div className="container mx-auto px-4 z-10 py-20" style={{ y, opacity }}>
          <div className="max-w-3xl mx-auto text-center">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
              <Badge className="mb-4 bg-primary/20 text-primary hover:bg-primary/30 transition-colors">
                {t("site.description")}
              </Badge>
            </motion.div>

            <h1
              className="text-4xl md:text-6xl lg:text-7xl font-bold pb-6 bg-clip-text text-transparent bg-gradient-to-r from-white via-primary to-white"
            >
              {t("site.title")}
            </h1>

            <motion.p
              className="text-xl text-white/70 mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              {t("site.tagline")}
            </motion.p>

            <motion.div
              className="flex flex-col sm:flex-row items-center justify-center gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <Button size="lg" className="text-whtie w-full sm:w-auto" onClick={() => scrollToSection("projects")}>
                {t("nav.viewMyWork")}
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="w-full sm:w-auto"
                onClick={() => scrollToSection("contact")}
              >
                {t("nav.contactMe")}
              </Button>
            </motion.div>
          </div>
        </motion.div>

        <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 z-10">
          <motion.div animate={{ y: [0, 10, 0] }} transition={{ repeat: Number.POSITIVE_INFINITY, duration: 2 }}>
            <button
              onClick={() => scrollToSection("services")}
              className="flex flex-col items-center text-white/50 hover:text-white transition-colors"
            >
              <span className="text-sm mb-2">{t("nav.scrollDown")}</span>
              <ChevronRight className="h-5 w-5 transform rotate-90" />
            </button>
          </motion.div>
        </div>
      </section>

      {/* Services Section (Bento Grid) */}
      <section ref={sectionRefs.services} className="py-20 bg-black relative overflow-hidden">
        <div className="container mx-auto px-4">
          {/* Decorative background elements */}
          <div className="absolute top-20 left-10 w-72 h-72 bg-primary/5 rounded-full blur-[100px] opacity-70" />
          <div className="absolute bottom-20 right-10 w-80 h-80 bg-primary/10 rounded-full blur-[120px] opacity-60" />
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full h-full max-w-5xl max-h-5xl bg-[radial-gradient(circle,rgba(138,43,226,0.03)_0%,transparent_70%)]" />
          <GridPattern />
          <div className="max-w-3xl mx-auto text-center mb-16">
            <Badge className="mb-4 bg-primary/20 text-primary hover:bg-primary/30 transition-colors">
              {t("nav.services")}
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-6">{t("services.title")}</h2>
            <p className="text-white/70">{t("services.description")}</p>
          </div>

          <BentoGrid
            items={services.map((service) => ({
              ...service,
              title: t(service.titleKey),
              description: t(service.descriptionKey),
            }))}
          />
        </div>
      </section>

      {/* Projects Section */}
      <section ref={sectionRefs.projects} className="py-20 bg-black">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <Badge className="mb-4 bg-primary/20 text-primary hover:bg-primary/30 transition-colors">
              {t("nav.projects")}
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-6">{t("projects.title")}</h2>
            <p className="text-white/70">{t("projects.description")}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => (
              <ProjectCard
                key={project.id}
                project={{
                  ...project,
                  title: t(project.titleKey),
                  description: t(project.descriptionKey),
                }}
                onClick={() => setSelectedProject(project)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Project Modal */}
      {selectedProject && (
        <Dialog open={!!selectedProject} onOpenChange={() => setSelectedProject(null)}>
          <DialogContent className="sm:max-w-3xl bg-[#0a0a0a] border-[#0a0a0a]">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold">{t(selectedProject.titleKey)}</DialogTitle>
              <DialogDescription className="flex flex-wrap gap-2 mt-2">
                {selectedProject.tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="bg-primary/20 text-primary">
                    {tag}
                  </Badge>
                ))}
              </DialogDescription>
            </DialogHeader>

            <div className="grid gap-6 py-4">
              <div className="relative aspect-video overflow-hidden rounded-lg">
                <Image
                  src={selectedProject.image || "/placeholder.svg"}
                  alt={t(selectedProject.titleKey)}
                  fill
                  className="object-cover"
                />
              </div>

              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold mb-2">{t("projects.overview")}</h3>
                  <p className="text-white/70">{t(selectedProject.fullDescriptionKey)}</p>
                </div>
              </div>

              <div className="flex justify-end">
                <Button asChild>
                  <Link className="text-white" href={selectedProject.link} target="_blank">
                    {t("projects.viewLiveProject")}
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Experience Section (Timeline) */}
      <section ref={sectionRefs.experience} className="py-20 bg-black">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <Badge className="mb-4 bg-primary/20 text-primary hover:bg-primary/30 transition-colors">
              {t("nav.experience")}
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-6">{t("experience.title")}</h2>
            <p className="text-white/70">{t("experience.description")}</p>
          </div>

          <TimelineComponent
            items={experience.map((item) => ({
              ...item,
              title: t(item.titleKey),
              company: t(item.companyKey),
              period: t(item.periodKey),
              description: t(item.descriptionKey),
            }))}
          />
        </div>
      </section>

      {/* Pricing Section */}
      <section ref={sectionRefs.pricing} className="py-20 bg-black">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <Badge className="mb-4 bg-primary/20 text-primary hover:bg-primary/30 transition-colors">
              {t("nav.pricing")}
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-6">{t("pricing.title")}</h2>
            <p className="text-white/70">{t("pricing.description")}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {pricing.map((plan) => (
              <PricingCard
                key={plan.id}
                plan={{
                  ...plan,
                  title: t(plan.titleKey),
                  description: t(plan.descriptionKey),
                  features: plan.featuresKeys.map((key) => t(key)),
                }}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Reviews Section */}
      <section ref={sectionRefs.reviews} className="py-20 bg-black">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <Badge className="mb-4 bg-primary/20 text-primary hover:bg-primary/30 transition-colors">
              {t("nav.reviews")}
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-6">{t("reviews.title")}</h2>
            <p className="text-white/70">{t("reviews.description")}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {reviews.map((review) => (
              <ReviewCard
                key={review.id}
                review={{
                  ...review,
                  name: t(review.nameKey),
                  company: t(review.companyKey),
                  review: t(review.reviewKey),
                }}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" ref={sectionRefs.contact} className="py-20 bg-black">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <Badge className="mb-4 bg-primary/20 text-primary hover:bg-primary/30 transition-colors">
              {t("nav.contact")}
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-6">{t("contact.title")}</h2>
            <p className="text-white/70">{t("contact.description")}</p>
          </div>

          <div className="max-w-2xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <Card className="bg-[#0a0a0a] border-[#0a0a0a] hover:bg-[#0a0a0a]/80 transition-colors">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Mail className="h-5 w-5 text-primary" />
                    {t("contact.email")}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Link href={`mailto:${site.email}`} className="text-white/70 hover:text-primary transition-colors">
                    {site.email}
                  </Link>
                </CardContent>
              </Card>

              <Card className="bg-[#0a0a0a] border-[#0a0a0a] hover:bg-[#0a0a0a]/80 transition-colors">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MessageSquare className="h-5 w-5 text-primary" />
                    {t("contact.discord")}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {site.discord}
                </CardContent>
              </Card>
            </div>

            <div className="flex justify-center mt-12 space-x-6">
              <Link
                href={site.links.github}
                className="text-white/70 hover:text-primary transition-colors"
                aria-label="GitHub"
              >
                <Github className="h-6 w-6" />
              </Link>
              <Link
                href={site.links.linkedin}
                className="text-white/70 hover:text-primary transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin className="h-6 w-6" />
              </Link>
              <Link
                href={site.links.twitter}
                className="text-white/70 hover:text-primary transition-colors"
                aria-label="Twitter"
              >
                <Twitter className="h-6 w-6" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t border-white/10 bg-black">
        <div className="container flex justify-between items-center mx-auto px-4">
          <Link href="/" className="flex items-center space-x-2 group">
            <Image src="/logo.svg" alt="Buzz.AI Logo" width={42} height={42} />
          </Link>
          <nav className="flex flex-wrap justify-center md:justify-end gap-6">
            {site.footerLinksEnabled && site.footerLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="text-sm text-white/70 hover:text-primary transition-colors"
              >
                {t(`footer.${link.name}`)}
              </Link>
            ))}
          </nav>
        </div>
      </footer>
    </div>
  )
}
