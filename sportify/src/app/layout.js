import "./globals.css";

export const metadata = {
  title: "PlayCourt | Booking Lapangan Olahraga",
  description:
    "Platform pemesanan lapangan olahraga secara online.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <body>{children}</body>
    </html>
  );
}