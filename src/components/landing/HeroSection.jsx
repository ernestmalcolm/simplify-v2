"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import {
  IconArrowRight,
  IconStar,
  IconShield,
  IconClock,
  IconTarget,
  IconRobot,
  IconCalculator,
  IconCalendar,
} from "@tabler/icons-react";

const sectionVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

const staggerContainer = {
  visible: { transition: { staggerChildren: 0.18 } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

export default function HeroSection({ id, sectionRef }) {
  return (
    <main className="min-h-screen bg-gradient-to-br from-white via-blue-50 to-accent/10 relative overflow-hidden">
      {/* Background Patterns */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Geometric Grid Pattern */}
        <div
          className="absolute inset-0 opacity-[0.18]"
          style={{
            backgroundImage: `
            linear-gradient(rgba(59, 130, 246, 0.6) 1px, transparent 1px),
            linear-gradient(90deg, rgba(59, 130, 246, 0.6) 1px, transparent 1px)
          `,
            backgroundSize: "50px 50px",
          }}
        />

        {/* Floating Dots Pattern */}
        <div className="absolute top-20 left-20 w-5 h-5 bg-blue-500/70 rounded-full animate-pulse" />
        <div
          className="absolute top-40 right-32 w-4 h-4 bg-green-500/75 rounded-full animate-pulse"
          style={{ animationDelay: "1s" }}
        />
        <div
          className="absolute bottom-32 left-1/4 w-4.5 h-4.5 bg-purple-500/70 rounded-full animate-pulse"
          style={{ animationDelay: "2s" }}
        />
        <div
          className="absolute bottom-20 right-20 w-4 h-4 bg-orange-500/75 rounded-full animate-pulse"
          style={{ animationDelay: "0.5s" }}
        />

        {/* Additional Floating Elements */}
        <div
          className="absolute top-1/3 left-1/3 w-6 h-6 bg-blue-400/60 rounded-full animate-bounce"
          style={{ animationDelay: "1.5s" }}
        />
        <div
          className="absolute bottom-1/3 right-1/3 w-5 h-5 bg-green-400/65 rounded-full animate-bounce"
          style={{ animationDelay: "0.8s" }}
        />
        <div
          className="absolute top-1/4 right-1/4 w-5 h-5 bg-purple-400/60 rounded-full animate-pulse"
          style={{ animationDelay: "0.3s" }}
        />
        <div
          className="absolute bottom-1/4 left-1/4 w-4 h-4 bg-pink-400/70 rounded-full animate-pulse"
          style={{ animationDelay: "1.2s" }}
        />

        {/* Subtle Wave Pattern */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-blue-500/25 to-transparent" />

        {/* Corner Accents */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-blue-500/30 to-transparent rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-green-500/30 to-transparent rounded-full blur-3xl" />

        {/* Central Glow */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-blue-400/25 to-green-400/25 rounded-full blur-3xl" />

        {/* Additional Glowing Elements */}
        <div className="absolute top-1/3 right-1/3 w-32 h-32 bg-gradient-to-br from-purple-400/20 to-pink-400/20 rounded-full blur-2xl" />
        <div className="absolute bottom-1/3 left-1/3 w-24 h-24 bg-gradient-to-tl from-orange-400/20 to-red-400/20 rounded-full blur-2xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 0.12, scale: 1 }}
        transition={{ duration: 1.2, ease: "easeOut" }}
        className="absolute -top-32 -left-32 w-[300px] h-[300px] sm:w-[500px] sm:h-[500px] bg-gradient-to-br from-primary/30 to-accent/20 rounded-full blur-3xl z-0"
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 0.08, scale: 1 }}
        transition={{ duration: 1.2, ease: "easeOut", delay: 0.3 }}
        className="absolute -bottom-32 -right-32 w-[400px] h-[400px] sm:w-[600px] sm:h-[600px] bg-gradient-to-br from-accent/20 to-primary/30 rounded-full blur-3xl z-0"
      />

      <section
        id={id}
        ref={sectionRef}
        className="min-h-[100vh] flex items-center py-10 xs:py-14 sm:py-16 md:py-24 lg:py-32 pt-8 w-full relative z-10 px-4 sm:px-8 md:px-12 lg:px-8"
      >
        <div className="w-full max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="flex flex-col items-center lg:items-start text-center lg:text-left"
          >
            <motion.div
              variants={sectionVariants}
              className="space-y-6 sm:space-y-8 max-w-2xl"
            >
              <motion.span
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.7, delay: 0.2, type: "spring" }}
                className="inline-flex items-center gap-2 bg-gradient-to-r from-primary to-accent text-white font-semibold px-4 py-2 rounded-full text-xs sm:text-sm tracking-wide shadow-lg"
              >
                <IconStar className="w-4 h-4" />
                Trusted by 2000+ Tanzanian Businesses
              </motion.span>

              <h1 className="text-4xl xs:text-5xl sm:text-6xl md:text-7xl font-extrabold text-primary drop-shadow-sm relative leading-tight">
                Simplify Your
                <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent block mt-2">
                  Tax Compliance
                </span>
              </h1>

              <p className="text-lg sm:text-xl md:text-2xl text-secondary leading-relaxed">
                The all-in-one platform for Tanzanian businesses to manage
                taxes, track finances, and stay compliant. Effortlessly.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Link
                  href="/register"
                  className="group text-lg font-semibold text-white px-8 py-4 rounded-xl bg-gradient-to-r from-primary to-accent shadow-lg transition-all duration-200 hover:scale-105 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-primary/40 text-center flex items-center justify-center gap-2"
                >
                  Start Free Trial
                  <IconArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  href="/login"
                  className="text-lg font-semibold text-primary px-8 py-4 rounded-xl border-2 border-primary transition-all duration-200 hover:scale-105 hover:bg-primary hover:text-white focus:outline-none focus:ring-2 focus:ring-primary/40 text-center"
                >
                  Sign In
                </Link>
              </div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.8 }}
                className="flex flex-wrap justify-center lg:justify-start items-center gap-6 mt-12 text-sm text-secondary"
              >
                <div className="flex items-center gap-2">
                  <IconShield className="w-5 h-5 text-green-500" />
                  <span>Bank-level Security</span>
                </div>
                <div className="flex items-center gap-2">
                  <IconClock className="w-5 h-5 text-blue-500" />
                  <span>24/7 AI Support</span>
                </div>
                <div className="flex items-center gap-2">
                  <IconTarget className="w-5 h-5 text-purple-500" />
                  <span>TRA Compliant</span>
                </div>
              </motion.div>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9, rotateY: -20 }}
            animate={{ opacity: 1, scale: 1, rotateY: 0 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.3 }}
            className="hidden lg:block relative w-full h-[450px]"
            style={{ perspective: "1000px" }}
          >
            <motion.div
              variants={cardVariants}
              className="absolute top-0 left-10 w-80 bg-white/70 backdrop-blur-md p-4 rounded-xl shadow-lg border border-gray-200/60"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                  <IconRobot className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <p className="font-bold text-sm text-primary">AI Assistant</p>
                  <p className="text-xs text-secondary">
                    Replying instantly...
                  </p>
                </div>
              </div>
              <p className="mt-3 text-sm bg-blue-50 p-3 rounded-lg">
                What is the current VAT rate for tourism services?
              </p>
            </motion.div>

            <motion.div
              variants={cardVariants}
              className="absolute top-1/3 right-0 w-72 bg-white/70 backdrop-blur-md p-4 rounded-xl shadow-lg border border-gray-200/60"
            >
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                  <IconCalculator className="w-6 h-6 text-green-600" />
                </div>
                <p className="font-bold text-sm text-primary">Tax Calculator</p>
              </div>
              <div className="bg-green-50 p-3 rounded-lg text-center">
                <p className="text-sm text-secondary">VAT Due</p>
                <p className="text-xl font-bold text-green-700">
                  TZS 1,800,000
                </p>
              </div>
            </motion.div>

            <motion.div
              variants={cardVariants}
              className="absolute bottom-0 left-0 w-80 bg-white/70 backdrop-blur-md p-4 rounded-xl shadow-lg border border-gray-200/60"
            >
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center">
                  <IconCalendar className="w-6 h-6 text-orange-600" />
                </div>
                <p className="font-bold text-sm text-primary">
                  Deadline Reminder
                </p>
              </div>
              <div className="bg-orange-50 p-3 rounded-lg flex items-center justify-between">
                <p className="text-sm text-secondary">PAYE Return</p>
                <p className="text-sm font-semibold text-orange-700">
                  Due in 3 days
                </p>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </main>
  );
}
