"use client";

import { motion } from "framer-motion";
import {
  IconClipboardList,
  IconReceipt,
  IconDeviceAnalytics,
} from "@tabler/icons-react";

const sectionVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

const staggerContainer = {
  visible: { transition: { staggerChildren: 0.18 } },
};

const steps = [
  {
    icon: IconClipboardList,
    title: "Sign Up & Set Up",
    description:
      "Create your account in minutes and set up your company profile with your TIN and business details.",
  },
  {
    icon: IconReceipt,
    title: "Track & Manage",
    description:
      "Record sales and expenses as they happen. Our system helps categorize everything for you.",
  },
  {
    icon: IconDeviceAnalytics,
    title: "Report & Comply",
    description:
      "Generate tax reports, get deadline reminders, and file your returns with confidence using our tools.",
  },
];

export default function HowItWorksSection({ id, sectionRef }) {
  return (
    <section
      id={id}
      ref={sectionRef}
      className="py-20 px-4 sm:px-8 md:px-12 lg:px-8 relative z-10 bg-white"
    >
      {/* Background Patterns */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Subtle Dot Pattern */}
        <div
          className="absolute inset-0 opacity-[0.12]"
          style={{
            backgroundImage: `
            radial-gradient(circle at 1px 1px, rgba(59, 130, 246, 0.3) 1px, transparent 0)
          `,
            backgroundSize: "40px 40px",
          }}
        />

        {/* Floating Geometric Shapes */}
        <div className="absolute top-10 left-10 w-20 h-20 border-2 border-blue-400/30 rounded-full" />
        <div className="absolute top-20 right-20 w-12 h-12 border-2 border-green-400/35 rotate-45" />
        <div className="absolute bottom-20 left-20 w-16 h-16 border-2 border-purple-400/30 rounded-full" />
        <div className="absolute bottom-10 right-10 w-8 h-8 border-2 border-orange-400/35 rotate-45" />

        {/* Additional Shapes */}
        <div className="absolute top-1/3 left-1/3 w-14 h-14 border border-blue-300/40 rotate-12" />
        <div className="absolute bottom-1/3 right-1/3 w-10 h-10 border border-green-300/45 rounded-full" />

        {/* Gradient Orbs */}
        <div className="absolute top-1/4 right-1/4 w-40 h-40 bg-gradient-to-br from-blue-400/15 to-transparent rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 left-1/4 w-32 h-32 bg-gradient-to-tl from-green-400/15 to-transparent rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-24 h-24 bg-gradient-to-r from-purple-400/10 to-pink-400/10 rounded-full blur-2xl" />

        {/* Animated Elements */}
        <div className="absolute top-1/4 left-1/4 w-3 h-3 bg-blue-500/60 rounded-full animate-pulse" />
        <div
          className="absolute bottom-1/4 right-1/4 w-2.5 h-2.5 bg-green-500/65 rounded-full animate-pulse"
          style={{ animationDelay: "1s" }}
        />
        <div
          className="absolute top-1/2 right-1/3 w-2 h-2 bg-purple-500/55 rounded-full animate-pulse"
          style={{ animationDelay: "0.5s" }}
        />
        <div
          className="absolute bottom-1/2 left-1/3 w-3 h-3 bg-orange-500/60 rounded-full animate-pulse"
          style={{ animationDelay: "1.5s" }}
        />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, amount: 0.2 }}
          className="text-center mb-16"
        >
          <motion.h2
            variants={sectionVariants}
            className="text-3xl sm:text-4xl md:text-5xl font-bold text-primary mb-6"
          >
            Get Started in 3 Simple Steps
          </motion.h2>
          <motion.p
            variants={sectionVariants}
            className="text-lg sm:text-xl text-secondary max-w-3xl mx-auto"
          >
            Simplify is designed to be intuitive and easy to use, so you can
            focus on what matters most—running your business.
          </motion.p>
        </motion.div>
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, amount: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={index}
                variants={sectionVariants}
                className="text-center p-8 rounded-2xl bg-gray-50/80 backdrop-blur-sm shadow-sm hover:shadow-lg transition-shadow duration-300"
              >
                <div className="flex justify-center mb-6">
                  <div className="bg-primary/10 text-primary p-4 rounded-full">
                    <Icon className="w-10 h-10" />
                  </div>
                </div>
                <h3 className="text-xl font-bold text-primary mb-3">
                  {step.title}
                </h3>
                <p className="text-secondary">{step.description}</p>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
