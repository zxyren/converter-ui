import { motion } from "framer-motion";
import { Link } from "wouter";
import {
  ArrowRight,
  FileImage,
  Film,
  Music,
  Type,
  FileText,
  Code,
  Zap,
  UserX,
  ShieldCheck,
  FileCheck2,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const CATEGORIES = [
  {
    href: "/convert/image",
    icon: FileImage,
    label: "Image",
    description: "JPG, PNG, WEBP, HEIC, BMP, GIF",
    color: "from-cyan-500/20 to-blue-500/20",
    iconColor: "text-cyan-500",
  },
  {
    href: "/convert/video",
    icon: Film,
    label: "Video",
    description: "MP4, AVI, MOV, MKV, GIF, Audio extraction",
    color: "from-violet-500/20 to-purple-500/20",
    iconColor: "text-violet-500",
  },
  {
    href: "/convert/audio",
    icon: Music,
    label: "Audio",
    description: "MP3, WAV, AAC, FLAC, OGG conversions",
    color: "from-lime-500/20 to-emerald-500/20",
    iconColor: "text-lime-500",
  },
  {
    href: "/convert/font",
    icon: Type,
    label: "Font",
    description: "TTF, OTF, WOFF, WOFF2 variable fonts",
    color: "from-teal-500/20 to-sky-500/20",
    iconColor: "text-teal-500",
  },
  {
    href: "/convert/document",
    icon: FileText,
    label: "Document",
    description: "Word (.doc, .docx) ↔ PDF conversion",
    color: "from-amber-500/20 to-orange-500/20",
    iconColor: "text-amber-500",
  },
  {
    href: "/convert/developer",
    icon: Code,
    label: "Developer",
    description: "JSON, XML, YAML, Base64, Color, Markdown",
    color: "from-rose-500/20 to-pink-500/20",
    iconColor: "text-rose-500",
  },
];

const FEATURES = [
  {
    icon: Zap,
    title: "Instant conversion",
    description: "Upload, convert, download — the whole flow in seconds.",
  },
  {
    icon: UserX,
    title: "No sign-up needed",
    description:
      "Your files are processed and immediately deleted. Zero accounts.",
  },
  {
    icon: FileCheck2,
    title: "Any format",
    description:
      "Images, videos, audio, fonts, documents, and developer data — all in one place.",
  },
  {
    icon: ShieldCheck,
    title: "Privacy first",
    description:
      "Uploaded files are never saved to the server — they stay in your local storage only.",
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

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative overflow-hidden py-24 md:py-32">
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute left-1/2 top-0 h-150 w-200 -translate-x-1/2 -translate-y-1/4 rounded-full bg-primary/10 blur-3xl" />
        </div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mx-auto max-w-3xl px-4 text-center md:px-6"
        >
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-xs font-semibold text-primary">
            <Zap className="h-3 w-3" />
            Free. Fast. No sign-up.
          </div>
          <h1 className="text-5xl font-extrabold  tracking-tight text-foreground md:text-7xl">
            Convert anything.
            <br />
            <span className="text-primary">Instantly.</span>
          </h1>
          <p className="mt-6 text-lg text-muted-foreground md:text-xl">
            A universal file converter for images, video, audio, fonts, documents, and
            developer data. Drop a file. Pick a format. Done.
          </p>
          <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <Button
              asChild
              size="lg"
              className="gap-2 px-8"
              data-testid="button-start-converting"
            >
              <Link href="/convert/image">
                Start converting
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              data-testid="button-view-tools"
            >
              <Link href="/convert/developer">Developer tools</Link>
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
                      className={`flex h-12 w-12 items-center justify-center rounded-md bg-linear-to-tr ${color}`}
                    >
                      <Icon size={23} className={`${iconColor}`} />
                    </div>
                    <div>
                      <p className="font-semibold text-foreground">{label}</p>
                      <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
                        {description}
                      </p>
                    </div>
                    <div className="mt-auto flex items-center text-sm font-medium text-primary opacity-0 transition-opacity group-hover:opacity-100">
                      Convert now
                      <ArrowRight
                        size={16}
                        className="transition-transform group-hover:translate-x-0.5"
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

      {/* CTA */}
      <section className="py-16 md:py-24">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mx-auto max-w-2xl px-4 text-center md:px-6"
        >
          <h2 className="text-2xl font-bold text-foreground md:text-3xl">
            Ready to convert?
          </h2>
          <p className="mt-3 text-muted-foreground">
            Choose a tool and start converting in seconds — no account, no
            waiting.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            {CATEGORIES.map(({ href, label, icon: Icon }) => (
              <Button
                key={href}
                asChild
                variant="outline"
                data-testid={`button-cta-${label.toLowerCase()}`}
              >
                <Link href={href} className="gap-2">
                  <Icon size={23} />
                  {label}
                </Link>
              </Button>
            ))}
          </div>
        </motion.div>
      </section>
    </div>
  );
}
