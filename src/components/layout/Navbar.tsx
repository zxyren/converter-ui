import { useState } from "react";
import { Link, useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { IconBrandYoutube, IconCodeDots, IconFile, IconFileTypography, IconMenu, IconMoon, IconMusic, IconPhoto, IconSun, IconX } from "@tabler/icons-react";

const NAV_ITEMS = [
  { href: "/convert/image", label: "Image", icon: IconPhoto },
  { href: "/convert/video", label: "Video", icon: IconBrandYoutube },
  { href: "/convert/audio", label: "Audio", icon: IconMusic },
  { href: "/convert/font", label: "Font", icon: IconFileTypography },
  { href: "/convert/document", label: "Document", icon: IconFile },
  { href: "/convert/developer", label: "Developer", icon: IconCodeDots },
];

export function Navbar() {
  const [location] = useLocation();
  const { theme, setTheme } = useTheme();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex py-5 max-w-7xl items-center justify-between px-4 md:px-6">
        <Link
          href="/"
          className="flex w-fit items-center gap-3 text-foreground transition-opacity hover:opacity-90"
        >
          <div className="flex size-10 items-center justify-center overflow-hidden rounded-lg border border-border bg-background shadow-sm">
            <img src="/logo.png" alt="" className="size-10 object-contain" />
          </div>
          <span className="text-base font-semibold tracking-tight">
            FileFlip
          </span>
        </Link>

        <nav className="hidden items-center gap-3 md:flex">
          {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
            const active = location.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                data-testid={`nav-link-${label.toLowerCase()}`}
                className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${active
                  ? "bg-primary/20 text-primary"
                  : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                  }`}
              >
                <Icon size={20} className={active ? "" : "text-muted-foreground"} />
                <span>{label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            aria-label="Toggle theme"
            data-testid="button-toggle-theme"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="h-8 w-8"
          >
            {theme === "dark" ? <IconSun size={20} /> : <IconMoon size={20} />}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 md:hidden"
            data-testid="button-mobile-menu"
            onClick={() => setMobileOpen((o) => !o)}
          >
            {mobileOpen ? <IconX size={20} /> : <IconMenu size={20} />}
          </Button>
        </div>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden border-t border-border bg-background md:hidden"
          >
            <nav className="flex flex-col gap-1 px-4 py-3">
              {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
                const active = location.startsWith(href);
                return (
                  <Link
                    key={href}
                    href={href}
                    data-testid={`mobile-nav-${label.toLowerCase()}`}
                    onClick={() => setMobileOpen(false)}
                    className={`flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors ${active
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                      }`}
                  >
                    <Icon size={20} />
                    {label}
                  </Link>
                );
              })}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
