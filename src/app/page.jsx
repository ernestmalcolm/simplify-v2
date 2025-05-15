"use client";

import { useState } from "react";
import { Button, Modal } from "@mantine/core";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";

const sectionVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: "easeOut" } },
};
const staggerContainer = {
  visible: { transition: { staggerChildren: 0.18 } },
};
const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

export default function HomePage() {
  const [opened, setOpened] = useState(false);

  return (
    <>
      <Navbar />
      <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-white via-blue-50 to-accent/10 relative overflow-hidden">
        {/* Decorative Shape */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 0.12, scale: 1 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          className="absolute -top-32 -left-32 w-[300px] h-[300px] sm:w-[500px] sm:h-[500px] bg-gradient-to-br from-primary/30 to-accent/20 rounded-full blur-3xl z-0"
        />
        {/* Hero Section */}
        <section className="min-h-[100vh] flex items-center justify-center py-10 xs:py-14 sm:py-16 md:py-24 lg:py-32 pt-8 w-full relative z-10 px-2 xs:px-4 sm:px-8 md:px-12 lg:px-0">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="w-full max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-center"
          >
            <motion.div
              variants={sectionVariants}
              className="space-y-6 sm:space-y-8 text-center md:text-left flex flex-col items-center md:items-start"
            >
              {/* Animated Badge/Eyebrow */}
              <motion.span
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.7, delay: 0.2, type: "spring" }}
                className="inline-block bg-gradient-to-r from-primary to-accent text-white font-semibold px-4 py-1.5 rounded-full text-xs sm:text-sm tracking-wide shadow mb-2 animate-pulse"
              >
                Your Tax Management Solution
              </motion.span>
              {/* Headline with gradient highlight and accent shape */}
              <h1 className="text-3xl xs:text-4xl sm:text-5xl md:text-6xl font-extrabold text-primary drop-shadow-sm relative leading-tight">
                Simplifying Your{" "}
                <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent block mt-2">
                  Tax Compliance
                </span>
              </h1>
              {/* Subheadline */}
              <p className="text-base sm:text-lg md:text-xl text-secondary leading-relaxed max-w-xs xs:max-w-sm sm:max-w-xl mx-auto md:mx-0">
                Everything you need for Tanzanian tax compliance—expert tips,
                clear info, instant AI answers, and a smart calendar. Stay
                informed, organized, and compliant, all in one place.
              </p>
            </motion.div>
            {/* Four main cards with framer-motion and hover effects */}
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-8 w-full max-w-3xl mx-auto"
            >
              {/* Tax Tips Card */}
              <motion.div
                variants={cardVariants}
                whileHover={{
                  scale: 1.05,
                  boxShadow: "0 8px 32px 0 rgba(124,58,237,0.18)",
                }}
              >
                <Link href="/tax-tips" className="w-full">
                  <div className="bg-primary text-white rounded-xl shadow-lg px-4 sm:px-6 py-6 h-64 w-full flex flex-col justify-between h-full transition-all duration-200 cursor-pointer group relative overflow-hidden font-sans">
                    <span className="text-xl sm:text-2xl font-bold mb-1">
                      💡 Tax Tips
                    </span>
                    <span className="text-sm sm:text-base opacity-90">
                      Access practical, easy-to-understand tax tips and guidance
                      for your business, updated regularly to keep you informed.
                    </span>
                    <span className="mt-2 text-xs sm:text-sm underline underline-offset-2 group-hover:text-accent transition-colors">
                      Learn more →
                    </span>
                    <span className="absolute right-4 bottom-4 opacity-10 text-4xl sm:text-6xl group-hover:opacity-20 transition-opacity">
                      💡
                    </span>
                  </div>
                </Link>
              </motion.div>
              {/* Tax Info Card */}
              <motion.div
                variants={cardVariants}
                whileHover={{
                  scale: 1.05,
                  boxShadow: "0 8px 32px 0 rgba(14,165,233,0.18)",
                }}
              >
                <Link href="/tax-info" className="w-full">
                  <div className="bg-accent text-white rounded-xl shadow-lg px-4 sm:px-6 py-6 h-64 w-full flex flex-col justify-between h-full transition-all duration-200 cursor-pointer group relative overflow-hidden font-sans">
                    <span className="text-xl sm:text-2xl font-bold mb-1">
                      📚 Tax Info
                    </span>
                    <span className="text-sm sm:text-base opacity-90">
                      Find in-depth, up-to-date information on Tanzanian tax
                      laws, deadlines, and compliance requirements.
                    </span>
                    <span className="mt-2 text-xs sm:text-sm underline underline-offset-2 group-hover:text-primary transition-colors">
                      Explore tax info →
                    </span>
                    <span className="absolute right-4 bottom-4 opacity-10 text-4xl sm:text-6xl group-hover:opacity-20 transition-opacity">
                      📚
                    </span>
                  </div>
                </Link>
              </motion.div>
              {/* Tax AI Card */}
              <motion.div
                variants={cardVariants}
                whileHover={{
                  scale: 1.05,
                  boxShadow: "0 8px 32px 0 rgba(37,99,235,0.14)",
                }}
              >
                <Link href="/chat-ai" className="w-full">
                  <div className="bg-white text-primary border-2 border-primary rounded-xl shadow-lg px-4 sm:px-6 py-6 h-64 w-full flex flex-col justify-between h-full transition-all duration-200 cursor-pointer group relative overflow-hidden font-sans">
                    <span className="text-xl sm:text-2xl font-bold mb-1">
                      🤖 Tax AI
                    </span>
                    <span className="text-sm sm:text-base opacity-90">
                      Ask our AI assistant any tax question and get instant,
                      reliable answers tailored for Tanzanian businesses.
                    </span>
                    <span className="mt-2 text-xs sm:text-sm underline underline-offset-2 group-hover:text-accent transition-colors">
                      Chat now →
                    </span>
                    <span className="absolute right-4 bottom-4 opacity-10 text-4xl sm:text-6xl group-hover:opacity-20 transition-opacity">
                      🤖
                    </span>
                  </div>
                </Link>
              </motion.div>
              {/* Tax Calendar Card */}
              <motion.div
                variants={cardVariants}
                whileHover={{
                  scale: 1.05,
                  boxShadow: "0 8px 32px 0 rgba(14,165,233,0.18)",
                }}
              >
                <Link href="/calendar" className="w-full">
                  <div className="bg-info text-white rounded-xl shadow-lg px-4 sm:px-6 py-6 h-64 w-full flex flex-col justify-between h-full transition-all duration-200 cursor-pointer group relative overflow-hidden font-sans">
                    <span className="text-xl sm:text-2xl font-bold mb-1">
                      📅 Tax Calendar
                    </span>
                    <span className="text-sm sm:text-base opacity-90">
                      View all important tax deadlines and compliance dates in
                      one place. Stay organized and never miss a due date!
                    </span>
                    <span className="mt-2 text-xs sm:text-sm underline underline-offset-2 group-hover:text-primary transition-colors">
                      View tax calendar →
                    </span>
                    <span className="absolute right-4 bottom-4 opacity-10 text-4xl sm:text-6xl group-hover:opacity-20 transition-opacity">
                      📅
                    </span>
                  </div>
                </Link>
              </motion.div>
            </motion.div>
          </motion.div>
        </section>
      </main>
      {/* Footer content moved from Footer.jsx */}
      <footer className="bg-gradient-to-r from-accent/10 to-primary/10 border-t border-gray-200">
        <div className="max-w-7xl mx-auto py-10 px-4 sm:px-8 md:px-12 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-lg font-semibold text-primary mb-4">
                Simplify
              </h3>
              <p className="text-secondary text-sm">
                Making tax compliance simple for Tanzanian business owners.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-primary mb-4">
                Contact
              </h3>
              <ul className="space-y-2 text-sm text-secondary">
                <li>Email: sales@simplify.co.tz</li>
                <li>Phone: +255 742 200 105</li>
                <li>Address: Mikocheni Kwa Warioba, Dar es Salaam, Tanzania</li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-primary mb-4">
                Quick Links
              </h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <a
                    href="/tax-tips"
                    className="text-secondary hover:text-primary"
                  >
                    Tax Tips
                  </a>
                </li>
                <li>
                  <a
                    href="/tax-info"
                    className="text-secondary hover:text-primary"
                  >
                    Tax Information
                  </a>
                </li>
                <li>
                  <a
                    href="/calendar"
                    className="text-secondary hover:text-primary"
                  >
                    Tax Calendar
                  </a>
                </li>
                <li>
                  <a
                    href="/chat-ai"
                    className="text-secondary hover:text-primary"
                  >
                    Tax AI
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-200">
            <p className="text-center text-sm text-secondary">
              © {new Date().getFullYear()} Simplify. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </>
  );
}
