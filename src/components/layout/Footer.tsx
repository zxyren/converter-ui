import { Zap } from 'lucide-react';
import { Link } from 'wouter';

export function Footer() {
  return (
    <footer className="border-t border-border bg-background py-10 mt-16">
      <div className="mx-auto max-w-7xl px-4 md:px-6">
        <div className="flex flex-col items-center gap-4 text-center md:flex-row md:justify-between md:text-left">
          <Link href="/" className="flex items-center gap-2 font-bold text-foreground">
            <div className="flex h-6 w-6 items-center justify-center rounded-md bg-primary">
              <Zap className="h-3.5 w-3.5 text-white" />
            </div>
            <span className="text-sm">Convertly</span>
          </Link>
          <p className="text-xs text-muted-foreground">
            Fast, secure file conversion — no sign-up required.
          </p>
          <div className="flex gap-4 text-xs text-muted-foreground">
            <Link href="/convert/image" className="hover:text-foreground transition-colors">Image</Link>
            <Link href="/convert/video" className="hover:text-foreground transition-colors">Video</Link>
            <Link href="/convert/audio" className="hover:text-foreground transition-colors">Audio</Link>
            <Link href="/convert/developer" className="hover:text-foreground transition-colors">Developer</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
