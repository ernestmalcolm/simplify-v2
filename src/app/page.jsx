"use client";

import { useEffect, useRef } from "react";
import { useRouter, usePathname } from "next/navigation";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/landing/HeroSection";
import FeaturesSection from "@/components/landing/FeaturesSection";
import HowItWorksSection from "@/components/landing/HowItWorksSection";
import PricingSection from "@/components/landing/PricingSection";
import TestimonialsSection from "@/components/landing/TestimonialsSection";
import ContactSection from "@/components/landing/ContactSection";
import Footer from "@/components/landing/Footer";

export default function HomePage() {
  const router = useRouter();
  const pathname = usePathname();
  const sectionIds = [
    "home",
    "features",
    "how-it-works",
    "pricing",
    "testimonials",
    "contact",
  ];

  const refs = {
    home: useRef(null),
    features: useRef(null),
    "how-it-works": useRef(null),
    pricing: useRef(null),
    testimonials: useRef(null),
    contact: useRef(null),
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const newUrl = `${pathname}#${entry.target.id}`;
            // Use replaceState to avoid adding to browser history
            window.history.replaceState(
              { ...window.history.state, as: newUrl, url: newUrl },
              "",
              newUrl
            );
          }
        });
      },
      { rootMargin: "-50% 0px -50% 0px" }
    );

    sectionIds.forEach((id) => {
      if (refs[id].current) {
        observer.observe(refs[id].current);
      }
    });

    return () => {
      sectionIds.forEach((id) => {
        if (refs[id].current) {
          observer.unobserve(refs[id].current);
        }
      });
    };
  }, [pathname, refs, sectionIds]);

  return (
    <div className="bg-white text-gray-800 antialiased">
      <Navbar />

      <HeroSection id="home" sectionRef={refs.home} />

      <FeaturesSection id="features" sectionRef={refs.features} />

      <HowItWorksSection id="how-it-works" sectionRef={refs["how-it-works"]} />

      <PricingSection id="pricing" sectionRef={refs.pricing} />

      <TestimonialsSection id="testimonials" sectionRef={refs.testimonials} />

      <ContactSection id="contact" sectionRef={refs.contact} />

      <Footer />
    </div>
  );
}
