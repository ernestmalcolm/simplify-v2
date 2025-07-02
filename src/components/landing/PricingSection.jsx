"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { IconCheck } from "@tabler/icons-react";
import { useState } from "react";

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

const plans = [
  {
    name: "Free",
    price: { monthly: "0", annually: "0" },
    period: { monthly: "forever", annually: "" },
    description: "Perfect for getting started with tax compliance",
    features: [
      "Up to 5 years data history",
      "Tax Calculator (VAT, PAYE, Presumptive)",
      "Tax Calendar & Deadlines",
      "Tax Information Library",
      "Tax Tips & Guides",
      "Company Profile Management",
    ],
    cta: "Get Started Free",
    popular: false,
  },
  {
    name: "Pro",
    price: { monthly: "9,999", annually: "99,999" },
    period: { monthly: "per month", annually: "per year" },
    description: "Everything you need for complete tax management",
    features: [
      "Everything in Free",
      "Unlimited data history",
      "AI Tax Assistant",
      "Create TRA-ready receipts/invoices",
      "Sales & Expense tracking",
      "Basic reporting & analytics",
      "Email/SMS compliance reminders",
      "Priority support",
    ],
    cta: "Contact Sales",
    popular: true,
  },
  {
    name: "Premium",
    price: { monthly: "19,999", annually: "199,999" },
    period: { monthly: "per month", annually: "per year" },
    description: "Advanced features for growing businesses",
    features: [
      "Everything in Pro",
      "Advanced compliance reports",
      "Advanced compliance reminders",
      "Logo saving on invoices and receipts",
      "TRA troubleshooting tools",
    ],
    cta: "Contact Sales",
    popular: false,
  },
];

export default function PricingSection({ id, sectionRef }) {
  const [billingCycle, setBillingCycle] = useState("monthly");

  return (
    <section
      id={id}
      ref={sectionRef}
      className="py-20 px-4 sm:px-8 md:px-12 lg:px-8 relative z-10"
    >
      {/* Background Patterns */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Subtle Hexagon Pattern */}
        <div
          className="absolute inset-0 opacity-[0.15]"
          style={{
            backgroundImage: `
            radial-gradient(circle at 25% 25%, rgba(59, 130, 246, 0.5) 0%, transparent 50%),
            radial-gradient(circle at 75% 75%, rgba(16, 185, 129, 0.5) 0%, transparent 50%)
          `,
            backgroundSize: "200px 200px",
          }}
        />

        {/* Floating Shapes */}
        <div className="absolute top-10 left-10 w-16 h-16 border-2 border-blue-500/50 rounded-full" />
        <div className="absolute top-20 right-20 w-8 h-8 border-2 border-green-500/60 rotate-45" />
        <div className="absolute bottom-20 left-20 w-12 h-12 border-2 border-purple-500/55 rounded-full" />
        <div className="absolute bottom-10 right-10 w-6 h-6 border-2 border-orange-500/60 rotate-45" />

        {/* Additional Geometric Shapes */}
        <div className="absolute top-1/3 left-1/3 w-10 h-10 border-2 border-blue-400/70 rotate-12" />
        <div className="absolute bottom-1/3 right-1/3 w-8 h-8 border-2 border-green-400/70 rounded-full" />
        <div className="absolute top-1/4 right-1/4 w-12 h-12 border border-purple-400/60 rotate-45" />
        <div className="absolute bottom-1/4 left-1/4 w-14 h-14 border border-orange-400/65 rounded-full" />

        {/* Gradient Orbs */}
        <div className="absolute top-1/4 right-1/4 w-32 h-32 bg-gradient-to-br from-blue-500/25 to-transparent rounded-full blur-2xl" />
        <div className="absolute bottom-1/4 left-1/4 w-24 h-24 bg-gradient-to-tl from-green-500/25 to-transparent rounded-full blur-2xl" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-20 h-20 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full blur-2xl" />
        <div className="absolute top-1/3 right-1/3 w-28 h-28 bg-gradient-to-br from-orange-400/20 to-red-400/20 rounded-full blur-2xl" />

        {/* Animated Elements */}
        <div className="absolute top-1/4 left-1/4 w-4 h-4 bg-blue-500/80 rounded-full animate-pulse" />
        <div
          className="absolute bottom-1/4 right-1/4 w-3 h-3 bg-green-500/85 rounded-full animate-pulse"
          style={{ animationDelay: "1s" }}
        />
        <div
          className="absolute top-1/2 right-1/3 w-3.5 h-3.5 bg-purple-500/75 rounded-full animate-pulse"
          style={{ animationDelay: "0.5s" }}
        />
        <div
          className="absolute bottom-1/2 left-1/3 w-2.5 h-2.5 bg-orange-500/80 rounded-full animate-pulse"
          style={{ animationDelay: "1.5s" }}
        />
        <div
          className="absolute top-1/3 left-1/2 w-3 h-3 bg-pink-500/70 rounded-full animate-pulse"
          style={{ animationDelay: "0.8s" }}
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
            Choose Your Plan
          </motion.h2>
          <motion.p
            variants={sectionVariants}
            className="text-lg sm:text-xl text-secondary max-w-3xl mx-auto"
          >
            Start free and upgrade as your business grows. All plans include our
            core tax tools.
          </motion.p>
        </motion.div>

        <motion.div
          variants={sectionVariants}
          className="flex justify-center items-center gap-6 mb-12"
        >
          <button
            onClick={() => setBillingCycle("monthly")}
            className={`font-bold text-xl transition-colors duration-300 ${
              billingCycle === "monthly"
                ? "text-primary"
                : "text-gray-400 hover:text-gray-500"
            }`}
          >
            Monthly
          </button>

          <div
            className="relative w-16 h-8 flex items-center cursor-pointer"
            onClick={() =>
              setBillingCycle(
                billingCycle === "monthly" ? "annually" : "monthly"
              )
            }
          >
            <div className="w-full h-2 bg-gray-200 rounded-full"></div>
            <motion.div
              className="absolute w-6 h-6 bg-primary rounded-full border-4 border-white shadow-md"
              layout
              transition={{ type: "spring", stiffness: 500, damping: 25 }}
              style={{
                left: billingCycle === "monthly" ? "0%" : "calc(100% - 24px)",
              }}
            ></motion.div>
          </div>

          <button
            onClick={() => setBillingCycle("annually")}
            className={`font-bold text-xl transition-colors duration-300 ${
              billingCycle === "annually"
                ? "text-primary"
                : "text-gray-400 hover:text-gray-500"
            }`}
          >
            Annually
          </button>
          <span className="ml-2 bg-yellow-200 text-yellow-800 text-xs font-bold px-2.5 py-1 rounded-full">
            SAVE 15%
          </span>
        </motion.div>

        <motion.div
          key={billingCycle}
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, amount: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch"
        >
          {plans.map((plan, index) => (
            <motion.div
              key={index}
              variants={cardVariants}
              className={`relative flex flex-col bg-white/90 backdrop-blur-sm rounded-2xl p-8 border-2 shadow-lg hover:shadow-xl transition-all duration-300 ${
                plan.popular
                  ? "border-primary scale-105 shadow-xl"
                  : "border-gray-200 hover:scale-105"
              }`}
            >
              {plan.popular && (
                <span className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-primary to-accent text-white text-sm font-bold px-4 py-2 rounded-full">
                  Most Popular
                </span>
              )}

              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-primary mb-2">
                  {plan.name}
                </h3>
                <div className="mb-4">
                  <span className="text-4xl font-extrabold text-primary">
                    TZS {plan.price[billingCycle]}
                  </span>
                  <span className="text-secondary ml-1">
                    /{plan.period[billingCycle]}
                  </span>
                </div>
                <p className="text-secondary text-sm">{plan.description}</p>
              </div>

              <ul className="space-y-4 mb-8">
                {plan.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-start gap-3">
                    <IconCheck className="w-5 h-5 text-green-500 flex-shrink-0 mt-1" />
                    <span className="text-secondary">{feature}</span>
                  </li>
                ))}
              </ul>

              <div className="flex-grow" />

              <div className="pt-8 text-center">
                <Link
                  href={plan.cta === "Contact Sales" ? "#contact" : "/register"}
                  className={`inline-block w-full py-3 px-6 rounded-xl font-semibold text-center transition-all duration-200 ${
                    plan.popular
                      ? "bg-gradient-to-r from-primary to-accent text-white shadow-lg hover:scale-105"
                      : "border-2 border-primary text-primary hover:bg-primary hover:text-white"
                  }`}
                >
                  {plan.cta}
                </Link>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
