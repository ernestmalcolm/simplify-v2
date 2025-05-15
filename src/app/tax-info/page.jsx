"use client";

import Link from "next/link";
import Navbar from "@/components/Navbar";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";

// Mock data - replace with Supabase fetch
const mockTaxInfo = [
  {
    id: 1,
    title: "Value Added Tax (VAT)",
    slug: "vat",
    description:
      "Learn about VAT registration, rates, and compliance requirements.",
  },
  {
    id: 2,
    title: "Pay As You Earn (PAYE)",
    slug: "paye",
    description: "Understanding PAYE for employers and employees.",
  },
  {
    id: 3,
    title: "Skills Development Levy (SDL)",
    slug: "sdl",
    description: "Information about SDL contributions and requirements.",
  },
  {
    id: 4,
    title: "Income Tax",
    slug: "income-tax",
    description: "Guide to personal and business income tax in Tanzania.",
  },
  {
    id: 5,
    title: "Corporate Tax",
    slug: "corporate-tax",
    description: "Corporate tax rates and compliance requirements.",
  },
  {
    id: 6,
    title: "Withholding Tax",
    slug: "withholding-tax",
    description: "Understanding withholding tax obligations and rates.",
  },
  {
    id: 7,
    title: "Provisional Tax",
    slug: "provisional-tax",
    description: "How provisional tax works and who must pay it.",
  },
  {
    id: 8,
    title: "Stamp Duty",
    slug: "stamp-duty",
    description: "Overview of stamp duty and when it applies.",
  },
  {
    id: 9,
    title: "Excise Duty",
    slug: "excise-duty",
    description: "Excise duty rates and compliance for goods/services.",
  },
  {
    id: 10,
    title: "TIN Registration",
    slug: "tin-registration",
    description: "How to register for a Taxpayer Identification Number (TIN).",
  },
];

export default function TaxInfoPage() {
  const headingRef = useRef(null);
  const inView = useInView(headingRef, {
    triggerOnce: false,
    margin: "-100px",
  });
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gradient-to-br from-white via-blue-50 to-accent/10 relative overflow-hidden pt-8 pb-16">
        {/* Decorative Shape */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 0.13, scale: 1 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          className="absolute -top-32 -right-32 w-[420px] h-[420px] bg-gradient-to-br from-primary/30 to-accent/20 rounded-full blur-3xl z-0"
        />
        <section className="w-full max-w-5xl mx-auto relative z-10 px-2 xs:px-4 sm:px-8 md:px-12 lg:px-0">
          <div ref={headingRef}>
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              transition={{ duration: 0.7, ease: "easeOut" }}
              className="text-2xl sm:text-3xl font-bold text-primary mb-2 flex items-center gap-2"
            >
              <span className="text-2xl sm:text-3xl">📚</span>
              Tax Information
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
              transition={{ duration: 0.7, delay: 0.1, ease: "easeOut" }}
              className="text-secondary text-sm sm:text-base mb-6 max-w-2xl"
            >
              Explore in-depth, up-to-date information on Tanzanian tax laws,
              deadlines, and compliance requirements. Stay informed and
              compliant with clear, actionable guidance.
            </motion.p>
          </div>
          {/* Tax Info Cards Grid */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={{ visible: { transition: { staggerChildren: 0.13 } } }}
            className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8"
          >
            {mockTaxInfo.map((tax) => (
              <motion.div
                key={tax.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{
                  scale: 1.045,
                  boxShadow: "0 8px 32px 0 rgba(14,165,233,0.13)",
                }}
                transition={{ duration: 0.18, ease: "easeOut" }}
                className="bg-white/80 font-poppins border-2 border-transparent hover:border-info/30 rounded-2xl shadow-soft px-4 sm:px-7 py-4 sm:py-6 flex flex-col items-start justify-between min-h-[140px] sm:min-h-[180px] transition-all duration-200 cursor-pointer group relative overflow-hidden"
              >
                <Link href={`/tax-info/${tax.slug}`} className="w-full">
                  <h2 className="text-lg sm:text-xl font-bold text-primary mb-2">
                    {tax.title}
                  </h2>
                  <p className="text-secondary mb-1 text-sm sm:text-base leading-relaxed">
                    {tax.description}
                  </p>
                  <span className="inline-block mt-2 text-xs sm:text-sm text-info font-semibold group-hover:underline group-hover:underline-offset-2 transition-colors">
                    Learn more →
                  </span>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </section>
      </main>
    </>
  );
}
