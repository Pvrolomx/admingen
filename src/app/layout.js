import "./globals.css";

export const metadata = {
  title: "Castle Admin — Contrato de Administración",
  description: "Generador de contratos de administración y mantenimiento — Castle Solutions / CASTLEBAY PV",
  manifest: "/manifest.json",
};

export const viewport = {
  themeColor: "#0d9488",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body className="bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 antialiased">
        {children}
      </body>
    </html>
  );
}
