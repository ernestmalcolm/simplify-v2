import { Poppins } from "next/font/google";
import { MantineProvider, createTheme } from "@mantine/core";
import "@mantine/core/styles.css";
import "./globals.css";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-poppins",
});

// Mantine expects 10 shades per color. We'll use the main color for all shades for simplicity.
const theme = createTheme({
  primaryColor: "primary",
  colors: {
    primary: [
      "#2563EB",
      "#2563EB",
      "#2563EB",
      "#2563EB",
      "#2563EB",
      "#2563EB",
      "#2563EB",
      "#2563EB",
      "#2563EB",
      "#2563EB",
    ],
    accent: [
      "#7C3AED",
      "#7C3AED",
      "#7C3AED",
      "#7C3AED",
      "#7C3AED",
      "#7C3AED",
      "#7C3AED",
      "#7C3AED",
      "#7C3AED",
      "#7C3AED",
    ],
    secondary: [
      "#64748B",
      "#64748B",
      "#64748B",
      "#64748B",
      "#64748B",
      "#64748B",
      "#64748B",
      "#64748B",
      "#64748B",
      "#64748B",
    ],
    info: [
      "#0EA5E9",
      "#0EA5E9",
      "#0EA5E9",
      "#0EA5E9",
      "#0EA5E9",
      "#0EA5E9",
      "#0EA5E9",
      "#0EA5E9",
      "#0EA5E9",
      "#0EA5E9",
    ],
    success: [
      "#22C55E",
      "#22C55E",
      "#22C55E",
      "#22C55E",
      "#22C55E",
      "#22C55E",
      "#22C55E",
      "#22C55E",
      "#22C55E",
      "#22C55E",
    ],
    danger: [
      "#EF4444",
      "#EF4444",
      "#EF4444",
      "#EF4444",
      "#EF4444",
      "#EF4444",
      "#EF4444",
      "#EF4444",
      "#EF4444",
      "#EF4444",
    ],
  },
});

export const metadata = {
  title: "Simplify V2 - Tax Compliance Made Easy",
  description:
    "Empowering Tanzanian business owners with clear, actionable tax guidance and tools to stay compliant.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/logos/letter-logo.svg" type="image/svg+xml" />
        <title>Simplify V2 - Tax Compliance Made Easy</title>
        <meta
          name="description"
          content="Empowering Tanzanian business owners with clear, actionable tax guidance and tools to stay compliant."
        />
      </head>
      <body className={`${poppins.variable} font-sans antialiased`}>
        <MantineProvider theme={theme} defaultColorScheme="light">
          {children}
        </MantineProvider>
      </body>
    </html>
  );
}
