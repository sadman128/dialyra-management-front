import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/context/ThemeContext";
import { BusinessProvider } from "@/context/BusinessContext";

export const metadata: Metadata = {
  title: "Dialyra Management",
  description: "Autonomous Telephony Engine, Call Flows & Multi-Tenant Storefront Middleware",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />

        {/* Zero-flash theme initialization script (defaults to light mode, supports ?theme=dark query param) */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                var params = new URLSearchParams(window.location.search);
                var theme = params.get('theme') || localStorage.getItem('dialyra_theme');
                if (theme === 'dark') {
                  document.documentElement.classList.add('dark');
                } else {
                  document.documentElement.classList.remove('dark');
                }
              } catch (e) {}
            `,
          }}
        />
      </head>
      <body className="bg-surface font-body-md text-on-surface antialiased">
        <ThemeProvider>
          <BusinessProvider>{children}</BusinessProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
