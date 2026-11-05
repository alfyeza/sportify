
import "./globals.css";
import { LanguageProvider } from "@/components/LanguageProvider";

export const metadata = {
  title: "Sportify | Booking Lapangan Olahraga",
  description: "Platform pemesanan lapangan olahraga secara online.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <body>
        <LanguageProvider>
          {children}
        </LanguageProvider>
      </body>
    </html>
  );
}
