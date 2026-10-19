import { MobileNav, Sidebar } from "@/components/layout/sidebar";
import { Topbar } from "@/components/layout/topbar";
import { AuthStoreProvider } from "@/components/providers/auth-store";
import { themeInitScript } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import type { Metadata } from "next";
import { Geist_Mono, Inter } from "next/font/google"; // 1. Importas Inter en lugar de Geist
import "./globals.css";

// 2. Configuras la fuente Inter
const inter = Inter({
  variable: "--font-inter", // Cambiamos la variable CSS
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Central Auth",
  description: "Autenticación y autorización centralizada",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="es"
      suppressHydrationWarning
      // 3. Usas la variable de inter en la clase del html
      className={`${inter.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      {/* 4. Aplicas la familia tipográfica por defecto en el body */}
      <body className="min-h-full bg-background text-foreground font-sans">
        <AuthStoreProvider>
          <div className="flex min-h-screen">
            <Sidebar />
            <div className="flex min-w-0 flex-1 flex-col">
              <MobileNav />
              <Topbar />
              <main className="mx-auto w-full max-w-6xl flex-1 px-6 py-8">
                {children}
              </main>
            </div>
          </div>
          <Toaster richColors position="bottom-right" />
        </AuthStoreProvider>
      </body>
    </html>
  );
}
