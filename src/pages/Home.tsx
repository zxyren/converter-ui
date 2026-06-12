import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { IconArrowRight, IconBolt, IconPlayerPlay, IconCodeDots, IconFile, IconFileInfo, IconFileTypography, IconMusic, IconPhoto, IconPlus, IconShieldBolt, IconUserCancel } from "@tabler/icons-react";

const CATEGORIES = [
  {
    href: "/convert/image",
    icon: IconPhoto,
    label: "Image",
    description: "JPG, PNG, WEBP, HEIC, BMP, GIF",
    color: "from-cyan-500/30 to-blue-500/20",
    iconColor: "text-cyan-500",
  },
  {
    href: "/convert/video",
    icon: IconPlayerPlay ,
    label: "Video",
    description: "MP4, AVI, MOV, MKV, GIF, Audio extraction",
    color: "from-violet-500/30 to-purple-500/20",
    iconColor: "text-violet-500",
  },
  {
    href: "/convert/audio",
    icon: IconMusic,
    label: "Audio",
    description: "MP3, WAV, AAC, FLAC, OGG conversions",
    color: "from-lime-500/30 to-emerald-500/20",
    iconColor: "text-lime-500",
  },
  {
    href: "/convert/font",
    icon: IconFileTypography,
    label: "Font",
    description: "TTF, OTF, WOFF, WOFF2 variable fonts",
    color: "from-teal-500/30 to-sky-500/20",
    iconColor: "text-teal-500",
  },
  {
    href: "/convert/document",
    icon: IconFile,
    label: "Document",
    description: "Word (.doc, .docx) ↔ PDF conversion",
    color: "from-amber-500/30 to-orange-500/20",
    iconColor: "text-amber-500",
  },
  {
    href: "/convert/developer",
    icon: IconCodeDots,
    label: "Developer",
    description: "JSON, XML, YAML, Base64, Color, Markdown",
    color: "from-rose-500/20 to-pink-500/20",
    iconColor: "text-rose-500",
  },
];

const FEATURES = [
  {
    icon: IconBolt,
    title: "Instant conversion",
    description: "Upload, convert, download — the whole flow in seconds.",
  },
  {
    icon: IconUserCancel,
    title: "No sign-up needed",
    description:
      "Your files are processed and immediately deleted. Zero accounts.",
  },
  {
    icon: IconFileInfo,
    title: "Any format",
    description:
      "Images, videos, audio, fonts, documents, and developer data — all in one place.",
  },
  {
    icon: IconShieldBolt,
    title: "Privacy first",
    description:
      "Uploaded files are never saved to the server — they stay in your local storage only.",
  },
];

const FAQ = [
  {
    question: "Is it really free?",
    answer: "Yes! There are no hidden fees, no subscriptions, and no sign-ups required. Convert as many files as you need.",
  },
  {
    question: "Are my files secure?",
    answer: "Absolutely. All conversions happen entirely in your browser using local processing. Your files are never uploaded to any server.",
  },
  {
    question: "What formats do you support?",
    answer: "We support dozens of formats across images, videos, audio, fonts, and documents. Check the specific category pages for full lists.",
  },
  {
    question: "Is there a file size limit?",
    answer: "Since processing happens on your device, the only limit is your device's memory and performance. Most files up to 2GB work flawlessly.",
  },
];

const stagger = {
  container: { transition: { staggerChildren: 0.07 } },
  item: {
    initial: { opacity: 0, y: 16 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.4 },
  },
};

function FaqItem({ question, answer }: { question: string; answer: string }) {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <div className="border-b border-border last:border-0">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full cursor-pointer items-center justify-between py-6 text-left transition-colors hover:text-primary/80"
      >
        <span className="font-semibold text-foreground text-lg">Q. {question}</span>
        <IconPlus className={`h-5 w-5 shrink-0 text-muted-foreground transition-all duration-300 ${isOpen ? "rotate-45" : ""}`} />
      </button>
      <motion.div
        initial={false}
        animate={{ height: isOpen ? "auto" : 0, opacity: isOpen ? 1 : 0 }}
        className="overflow-hidden"
      >
        <p className="pb-6 pr-8 text-muted-foreground leading-relaxed">
          {answer}
        </p>
      </motion.div>
    </div>
  );
}

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative overflow-hidden py-24 md:py-32">
        <div className="absolute inset-0 -z-10 bg-transparent">
          <div className="absolute bottom-0 left-0 right-0 top-0 bg-[radial-gradient(125%_125%_at_50%_10%,rgba(255,255,255,0)_40%,rgba(102,51,238,1)_100%)]" />
        </div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mx-auto max-w-3xl px-4 text-center md:px-6"
        >
          {/* border border-white/30 bg-white/10 text-foreground backdrop-blur-sm */}
          <div className="mb-5 inline-flex leading-none items-center gap-2 text-sm rounded-full border border-foreground/20 bg-white/10 text-foreground backdrop-blur-sm px-4 py-2.5">
            <IconBolt size={16} />
            Free. Fast. No sign-up.
          </div>
          <h1 className="text-5xl font-extrabold tracking-tight text-foreground md:text-7xl">
            Convert Anything.
            <br />
            <span className="text-primary">Instantly.</span>
          </h1>
          <p className="mt-6 text-lg text-muted-foreground md:text-xl">
            A universal file converter for images, video, audio, fonts,
            documents, and developer data. Drop a file. Pick a format. Done.
          </p>
          <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <Button
              asChild
              size="xl"
              variant="white"
              className="font-medium"
            >
              <Link href="/convert/image">Get Started</Link>
            </Button>
            <Button
              asChild
              size="xl"
              variant="glass"
              className="font-medium"
            >
              <Link href="/convert/developer">Developer Tools</Link>
            </Button>
          </div>
        </motion.div>
      </section>

      {/* Category cards */}
      <section className="py-12 md:py-16">
        <div className="mx-auto max-w-7xl px-4 md:px-6">
          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true, amount: 0.2 }}
            variants={stagger.container}
            className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
          >
            {CATEGORIES.map(
              ({ href, icon: Icon, label, description, color, iconColor }) => (
                <motion.div
                  key={href}
                  variants={stagger.item}
                  className="h-full"
                >
                  <Link
                    href={href}
                    data-testid={`card-category-${label.toLowerCase()}`}
                    className="group flex h-full flex-col gap-4 rounded-xl border border-border bg-card p-5 transition-all hover:border-primary/40 hover:shadow-md hover:-translate-y-0.5"
                  >
                    <div
                      className={`flex h-12 w-12 aspect-square items-center justify-center rounded-md bg-linear-to-tr ${color}`}
                    >
                      <Icon size={23} className={`${iconColor}`} />
                    </div>
                    <div>
                      <p className="font-semibold text-foreground">{label}</p>
                      <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
                        {description}
                      </p>
                    </div>
                    <div className="mt-auto flex items-center text-sm duration-300 font-medium text-primary opacity-0 transition-opacity group-hover:opacity-100">
                      Convert now
                      <IconArrowRight
                        size={16}
                      />
                    </div>
                  </Link>
                </motion.div>
              ),
            )}
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section className="border-t border-border py-16 md:py-24 bg-secondary/30">
        <div className="mx-auto max-w-7xl px-4 md:px-6">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="mb-12 text-center"
          >
            <h2 className="text-2xl font-bold text-foreground md:text-3xl">
              Built for speed
            </h2>
            <p className="mt-2 text-muted-foreground">
              No bloat. No friction. Just results.
            </p>
          </motion.div>
          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true, amount: 0.2 }}
            variants={stagger.container}
            className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4"
          >
            {FEATURES.map(({ icon: Icon, title, description }) => (
              <motion.div
                key={title}
                variants={stagger.item}
                className="rounded-xl border border-border bg-card p-5"
              >
                <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <Icon size={23} className="text-primary" />
                </div>
                <p className="font-semibold text-foreground">{title}</p>
                <p className="mt-1.5 text-sm text-muted-foreground leading-relaxed">
                  {description}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 md:py-32 relative overflow-hidden">
        {/* Subtle background glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-3xl h-64 bg-primary/5 blur-[100px] rounded-full pointer-events-none" />

        <div className="mx-auto max-w-5xl px-4 md:px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="mb-16 text-center"
          >
            <h2 className="text-3xl font-bold text-foreground md:text-4xl tracking-tight">
              Frequently Asked Questions
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Everything you need to know about the converter.
            </p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="mx-auto max-w-3xl rounded-2xl border border-border bg-card/50 backdrop-blur-sm px-6 shadow-sm"
          >
            {FAQ.map((item, index) => (
              <FaqItem key={index} question={item.question} answer={item.answer} />
            ))}
          </motion.div>
        </div>
      </section>
    </div>
  );
}
