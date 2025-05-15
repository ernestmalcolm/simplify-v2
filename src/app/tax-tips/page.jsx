"use client";

import { useState } from "react";
import { MultiSelect } from "@mantine/core";
import Navbar from "@/components/Navbar";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";

// Mock data - replace with Supabase fetch
const mockTips = [
  {
    id: 1,
    title: "Understanding VAT Registration",
    body: "If your business turnover exceeds TZS 100M/year, you must register for VAT. Register early to avoid penalties!",
    tags: ["VAT", "Registration"],
  },
  {
    id: 2,
    title: "PAYE Compliance Guide",
    body: "PAYE is due by the 7th of every month. File and pay on time to keep your employees and TRA happy!",
    tags: ["PAYE", "Employees"],
  },
  {
    id: 3,
    title: "E-filing Deadlines",
    body: "Always check the TRA portal for updated e-filing deadlines. Submitting early helps you avoid last-minute issues.",
    tags: ["E-filing", "Deadlines"],
  },
  {
    id: 4,
    title: "Withholding Tax Basics",
    body: "If you pay contractors, remember to withhold tax and remit it to TRA. It's your legal responsibility!",
    tags: ["Withholding Tax", "Contractors"],
  },
  {
    id: 5,
    title: "Corporate Tax Planning",
    body: "Plan your corporate tax payments in advance to avoid cash flow issues and penalties.",
    tags: ["Corporate Tax", "Planning"],
  },
  {
    id: 6,
    title: "Record Keeping Essentials",
    body: "Maintain accurate records of all transactions for at least 5 years as required by TRA.",
    tags: ["Record Keeping", "Compliance"],
  },
  {
    id: 7,
    title: "Provisional Tax Payments",
    body: "Remember to make provisional tax payments quarterly to avoid interest charges.",
    tags: ["Provisional Tax", "Deadlines"],
  },
  {
    id: 8,
    title: "TIN Registration Tips",
    body: "Ensure your TIN registration details are up to date to avoid issues with TRA correspondence.",
    tags: ["TIN", "Registration"],
  },
  {
    id: 9,
    title: "Tax Deductible Expenses",
    body: "Keep receipts for all business expenses to maximize your allowable tax deductions.",
    tags: ["Expenses", "Deductibles"],
  },
  {
    id: 10,
    title: "Avoiding Late Penalties",
    body: "Set reminders for all tax deadlines to avoid costly late filing and payment penalties.",
    tags: ["Deadlines", "Penalties"],
  },
];

const allTags = Array.from(new Set(mockTips.flatMap((tip) => tip.tags)));

export default function TaxTipsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTags, setSelectedTags] = useState([]);

  const filteredTips = mockTips.filter((tip) => {
    const matchesSearch =
      tip.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tip.body.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTags =
      selectedTags.length === 0 ||
      selectedTags.some((tag) => tip.tags.includes(tag));
    return matchesSearch && matchesTags;
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
          className="absolute -top-32 -right-32 w-[320px] sm:w-[420px] h-[320px] sm:h-[420px] bg-gradient-to-br from-primary/30 to-accent/20 rounded-full blur-3xl z-0"
        />
        <section className="w-full max-w-5xl mx-auto relative z-10 px-2 xs:px-4 sm:px-8 md:px-12 lg:px-0">
          {/* Animated Heading & Description with inView */}
          {(() => {
            const headingRef = useRef(null);
            const inView = useInView(headingRef, {
              triggerOnce: false,
              margin: "-100px",
            });
            return (
              <div ref={headingRef}>
                <motion.h1
                  initial={{ opacity: 0, y: 30 }}
                  animate={
                    inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }
                  }
                  transition={{ duration: 0.7, ease: "easeOut" }}
                  className="text-2xl sm:text-3xl font-bold text-primary mb-2 flex items-center gap-2"
                >
                  <span className="text-2xl sm:text-3xl">💡</span>
                  Tax Tips
                </motion.h1>
                <motion.p
                  initial={{ opacity: 0, y: 16 }}
                  animate={
                    inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }
                  }
                  transition={{ duration: 0.7, delay: 0.1, ease: "easeOut" }}
                  className="text-secondary text-sm sm:text-base mb-6 max-w-2xl"
                >
                  Discover practical, easy-to-understand tips to help you stay
                  compliant with Tanzanian tax laws. Updated regularly to keep
                  your business informed and on track.
                </motion.p>
              </div>
            );
          })()}

          {/* Search and Filter Bar */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2, ease: "easeOut" }}
            className="mb-8 sm:mb-10 flex flex-col sm:flex-row gap-4"
          >
            <input
              type="text"
              placeholder="Search tips..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary bg-white/80 shadow-sm"
            />
            <MultiSelect
              placeholder="Filter by tag(s)"
              value={selectedTags}
              onChange={setSelectedTags}
              data={allTags.map((tag) => ({ value: tag, label: tag }))}
              radius="md"
              size="md"
              className="w-full sm:w-80"
            />
          </motion.div>

          {/* Tips Grid */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={{ visible: { transition: { staggerChildren: 0.13 } } }}
            className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8"
          >
            {filteredTips.map((tip) => (
              <motion.div
                key={tip.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{
                  scale: 1.045,
                  boxShadow: "0 8px 32px 0 rgba(124,58,237,0.13)",
                }}
                transition={{ duration: 0.18, ease: "easeOut" }}
                className="bg-white/70 glass border-2 border-transparent hover:border-primary/30 rounded-2xl shadow-soft px-4 sm:px-7 py-4 sm:py-6 flex flex-col items-start transition-all duration-200 cursor-pointer group relative overflow-hidden"
              >
                <h2 className="text-lg sm:text-xl font-bold text-primary mb-2 flex items-center gap-2">
                  {tip.title}
                </h2>
                <p className="text-secondary mb-3 text-sm sm:text-base leading-relaxed">
                  {tip.body}
                </p>
                <div className="flex flex-wrap gap-2 mt-2">
                  {tip.tags.map((tag) => (
                    <span
                      key={tag}
                      className="bg-gradient-to-r from-primary/10 to-accent/10 text-primary px-3 py-1 rounded-md text-xs font-semibold shadow-sm animate-fade-in"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </motion.div>
            ))}
          </motion.div>

          {filteredTips.length === 0 && (
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="text-center py-16 flex flex-col items-center justify-center"
            >
              <span className="text-5xl mb-4 animate-pulse">💡</span>
              <p className="text-secondary text-lg font-medium">
                No tips found matching your search criteria.
              </p>
            </motion.div>
          )}
        </section>
      </main>
    </>
  );
}
