import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "ARTEM - Gestión de Siniestros",
  description: "Sistema de gestión de siniestros con asistente IA",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className={inter.className}>
        <AuthProvider>
          <div className="min-h-screen bg-slate-950 text-slate-50">
            {children}
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}
