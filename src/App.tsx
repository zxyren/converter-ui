import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "next-themes";
import { Toaster } from "@/components/ui/sonner";
import { Navbar } from "./components/layout/Navbar";
import { Footer } from "./components/layout/Footer";
import Home from "./pages/Home";
import ImageConverter from "./pages/ImageConverter";
import VideoConverter from "./pages/VideoConverter";
import AudioConverter from "./pages/AudioConverter";
import FontConverter from "./pages/FontConverter";
import DocumentConverter from "./pages/DocumentConverter";
import DeveloperTools from "./pages/DeveloperTools";
import NotFound from "./pages/not-found";

const queryClient = new QueryClient();

function Router() {
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <Navbar />
      <main className="flex-1">
        <Switch>
          <Route path="/" component={Home} />
          <Route path="/convert/image" component={ImageConverter} />
          <Route path="/convert/video" component={VideoConverter} />
          <Route path="/convert/audio" component={AudioConverter} />
          <Route path="/convert/font" component={FontConverter} />
          <Route path="/convert/document" component={DocumentConverter} />
          <Route path="/convert/developer" component={DeveloperTools} />
          <Route component={NotFound} />
        </Switch>
      </main>
      <Footer />
    </div>
  );
}

function App() {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <QueryClientProvider client={queryClient}>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
          <Router />
        </WouterRouter>
        <Toaster
          richColors
          position="top-center"
          className="select-none cursor-grab"
        />
      </QueryClientProvider>
    </ThemeProvider>
  );
}

export default App;
