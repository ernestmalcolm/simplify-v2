"use client";

import Link from "next/link";
import {
  IconBrandTwitter,
  IconBrandLinkedin,
  IconBrandFacebook,
} from "@tabler/icons-react";

const footerLinks = {
  features: [
    { name: "AI Tax Assistant", href: "#features" },
    { name: "Tax Calculator", href: "#features" },
    { name: "Sales & Expenses", href: "#features" },
    { name: "Tax Calendar", href: "#features" },
  ],
  company: [
    { name: "How It Works", href: "#how-it-works" },
    { name: "Pricing", href: "#pricing" },
    { name: "Testimonials", href: "#testimonials" },
    { name: "Contact", href: "#contact" },
  ],
};

const socialLinks = [
  { name: "Facebook", href: "#", icon: IconBrandFacebook },
  { name: "Twitter", href: "#", icon: IconBrandTwitter },
  { name: "LinkedIn", href: "#", icon: IconBrandLinkedin },
];

export default function Footer() {
  return (
    <footer className="bg-primary text-white relative overflow-hidden">
      {/* Background Patterns */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Subtle Dot Pattern */}
        <div
          className="absolute inset-0 opacity-[0.08]"
          style={{
            backgroundImage: `
            radial-gradient(circle at 1px 1px, rgba(255, 255, 255, 0.15) 1px, transparent 0)
          `,
            backgroundSize: "30px 30px",
          }}
        />

        {/* Floating Geometric Shapes */}
        <div className="absolute top-10 left-10 w-16 h-16 border border-white/20 rounded-full" />
        <div className="absolute top-20 right-20 w-12 h-12 border border-white/25 rotate-45" />
        <div className="absolute bottom-20 left-20 w-14 h-14 border border-white/20 rounded-full" />
        <div className="absolute bottom-10 right-10 w-10 h-10 border border-white/25 rotate-45" />

        {/* Additional Shapes */}
        <div className="absolute top-1/3 left-1/3 w-8 h-8 border border-white/30 rotate-12" />
        <div className="absolute bottom-1/3 right-1/3 w-6 h-6 border border-white/35 rounded-full" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-12 h-12 border border-white/20 rotate-45" />

        {/* Gradient Orbs */}
        <div className="absolute top-1/4 right-1/4 w-32 h-32 bg-gradient-to-br from-white/8 to-transparent rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 left-1/4 w-24 h-24 bg-gradient-to-tl from-white/8 to-transparent rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-20 h-20 bg-gradient-to-r from-white/6 to-transparent rounded-full blur-2xl" />

        {/* Animated Elements */}
        <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-white/40 rounded-full animate-pulse" />
        <div
          className="absolute bottom-1/4 right-1/4 w-1.5 h-1.5 bg-white/45 rounded-full animate-pulse"
          style={{ animationDelay: "0.8s" }}
        />
        <div
          className="absolute top-1/2 right-1/3 w-2.5 h-2.5 bg-white/35 rounded-full animate-pulse"
          style={{ animationDelay: "1.2s" }}
        />
        <div
          className="absolute bottom-1/2 left-1/3 w-2 h-2 bg-white/40 rounded-full animate-pulse"
          style={{ animationDelay: "0.4s" }}
        />

        {/* Floating Dots */}
        <div className="absolute top-16 left-1/2 transform -translate-x-1/2 w-3 h-3 bg-white/30 rounded-full animate-bounce" />
        <div
          className="absolute bottom-16 right-1/2 transform translate-x-1/2 w-2 h-2 bg-white/35 rounded-full animate-bounce"
          style={{ animationDelay: "1s" }}
        />
        <div
          className="absolute top-1/3 right-1/2 transform translate-x-1/2 w-2.5 h-2.5 bg-white/25 rounded-full animate-bounce"
          style={{ animationDelay: "0.6s" }}
        />
        <div
          className="absolute bottom-1/3 left-1/2 transform -translate-x-1/2 w-3.5 h-3.5 bg-white/30 rounded-full animate-bounce"
          style={{ animationDelay: "1.4s" }}
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-8 md:px-12 lg:px-8 py-12 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">Simplify</h3>
            <p className="text-white/80 text-sm leading-relaxed">
              Streamline your business operations with our comprehensive
              financial management platform.
            </p>
          </div>
          <div>
            <h4 className="text-sm font-semibold mb-4 uppercase tracking-wider">
              Product
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a
                  href="#features"
                  className="text-white/80 hover:text-white transition-colors"
                >
                  Features
                </a>
              </li>
              <li>
                <a
                  href="#pricing"
                  className="text-white/80 hover:text-white transition-colors"
                >
                  Pricing
                </a>
              </li>
              <li>
                <a
                  href="#how-it-works"
                  className="text-white/80 hover:text-white transition-colors"
                >
                  How It Works
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-semibold mb-4 uppercase tracking-wider">
              Company
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a
                  href="#testimonials"
                  className="text-white/80 hover:text-white transition-colors"
                >
                  Testimonials
                </a>
              </li>
              <li>
                <a
                  href="#contact"
                  className="text-white/80 hover:text-white transition-colors"
                >
                  Contact
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-semibold mb-4 uppercase tracking-wider">
              Legal
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a
                  href="#"
                  className="text-white/80 hover:text-white transition-colors"
                >
                  Privacy Policy
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-white/80 hover:text-white transition-colors"
                >
                  Terms of Service
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t border-white/20 mt-8 pt-8 text-center">
          <p className="text-white/60 text-sm">
            © 2024 Simplify. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
