import { IconBrandYoutube, IconCodeDots, IconFile, IconFileTypography, IconHome, IconMusic, IconPhoto } from "@tabler/icons-react";
import { Link } from "wouter";

const FOOTER_TOOLS = [
  { href: "/convert/image", label: "Image", icon: IconPhoto },
  { href: "/convert/video", label: "Video", icon: IconBrandYoutube },
  { href: "/convert/audio", label: "Audio", icon: IconMusic },
  { href: "/convert/font", label: "Font", icon: IconFileTypography },
  { href: "/convert/document", label: "Document", icon: IconFile },
  { href: "/convert/developer", label: "Developer", icon: IconCodeDots },
];

export function Footer() {
  return (
    <footer className="mt-auto border-t border-border bg-card/40">
      <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
          <div className="sm:col-span-2 lg:col-span-2">
            <Link
              href="/"
              className="flex w-fit items-center gap-3 text-foreground transition-opacity hover:opacity-90"
            >
              <div className="flex size-10 items-center justify-center overflow-hidden rounded-lg border border-border bg-background shadow-sm">
                <img
                  src="/logo.png"
                  alt=""
                  className="size-10 object-contain"
                />
              </div>
              <span className="text-base font-semibold tracking-tight">
                FileFlip
              </span>
            </Link>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-muted-foreground">
              Enterprise-grade conversions in your browser — images, media,
              documents, fonts, and structured data formats. No accounts, predictable
              results.
            </p>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Converters
            </p>
            <ul className="mt-4 space-y-2.5">
              {FOOTER_TOOLS.map(({ href, label, icon: Icon }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="group inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    <Icon
                      size={20}
                      className="opacity-70 transition-opacity group-hover:opacity-100"
                    />
                    <span className="mt-1">{label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Overview
            </p>
            <ul className="mt-4 space-y-2.5 text-sm text-muted-foreground">
              <li>
                <Link
                  href="/"
                  className="transition-colors flex items-center gap-2 hover:text-foreground"
                >
                  <IconHome size={20} />
                  <span className="mt-1">Home</span>
                </Link>
              </li>
              <li>
                <span className="text-muted-foreground/80">
                  Up to 500 MB per upload
                </span>
              </li>
              <li>
                <span className="text-muted-foreground/80">
                  Files processed and removed after download
                </span>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-12 flex flex-col gap-4 border-t border-border pt-8 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <p>&copy; {new Date().getFullYear()} FileFlip. All rights reserved.</p>
          <p className="max-w-xl">
            Built for teams that care about clarity, speed, and security.
          </p>
        </div>
      </div>
    </footer>
  );
}
