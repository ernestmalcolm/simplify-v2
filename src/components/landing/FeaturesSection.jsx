"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import {
  IconRobot,
  IconCalculator,
  IconCalendar,
  IconBook,
  IconCash,
  IconFileText,
  IconChartBar,
  IconBuilding,
  IconCheck,
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

const iconMap = {
  robot: IconRobot,
  calculator: IconCalculator,
  calendar: IconCalendar,
  book: IconBook,
  cash: IconCash,
  fileText: IconFileText,
  chartBar: IconChartBar,
  building: IconBuilding,
};

const features = [
  {
    icon: "robot",
    title: "AI Tax Assistant",
    description:
      "Get instant answers to your tax questions with our intelligent AI.",
    color: "from-indigo-600 to-purple-800",
    hoverContent: [
      "24/7 Availability",
      "Powered by Tanzanian Tax Law",
      "Step-by-step Guidance",
    ],
  },
  {
    icon: "calculator",
    title: "Smart Tax Calculator",
    description: "Calculate VAT, PAYE, and Presumptive Tax instantly.",
    color: "from-green-600 to-teal-800",
    hoverContent: [
      "Handles multiple tax types",
      "Accurate and up-to-date rates",
      "Simple interface for quick results",
    ],
  },
  {
    icon: "calendar",
    title: "Tax Calendar",
    description: "Never miss a tax deadline with our smart calendar.",
    color: "from-red-600 to-rose-800",
    hoverContent: [
      "Key filing dates pre-loaded",
      "Customizable reminders",
      "Syncs with your personal calendar",
    ],
  },
  {
    icon: "book",
    title: "Tax Information Library",
    description: "Access comprehensive guides and tax law resources.",
    color: "from-sky-600 to-blue-800",
    hoverContent: [
      "In-depth VAT & Income Tax guides",
      "Regularly updated content",
      "Searchable and easy to navigate",
    ],
  },
  {
    icon: "cash",
    title: "Sales Management",
    description: "Create TRA-ready receipts and track your revenue.",
    color: "from-emerald-600 to-lime-800",
    hoverContent: [
      "Generate compliant e-receipts",
      "Track sales performance",
      "Manage customer information",
    ],
  },
  {
    icon: "fileText",
    title: "Expense Tracking",
    description:
      "Organize your business expenses for better financial management.",
    color: "from-violet-600 to-fuchsia-800",
    hoverContent: [
      "Categorize spending automatically",
      "Attach digital receipts",
      "Export data for reporting",
    ],
  },
  {
    icon: "chartBar",
    title: "Advanced Reports",
    description: "Generate detailed reports to understand your business.",
    color: "from-amber-600 to-orange-800",
    hoverContent: [
      "Profit & Loss statements",
      "Tax liability summaries",
      "Customizable date ranges",
    ],
  },
  {
    icon: "building",
    title: "Company Profile",
    description:
      "Manage your business information and keep details up to date.",
    color: "from-gray-700 to-slate-900",
    hoverContent: [
      "Store TIN and VRN securely",
      "Manage business locations",
      "Control user access",
    ],
  },
];

const BentoGrid = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  const getGridClasses = (index) => {
    switch (index) {
      case 0: // AI Tax Assistant
        return "lg:col-span-2 lg:row-span-2";
      case 1: // Smart Tax Calculator
        return "lg:col-span-1";
      case 2: // Tax Calendar
        return "lg:col-span-1";
      case 3: // Tax Information Library
        return "lg:col-span-1";
      case 4: // Sales Management
        return "lg:col-span-1";
      case 5: // Expense Tracking
        return "lg:col-span-2";
      case 6: // Advanced Reports
        return "lg:col-span-1";
      case 7: // Company Profile
        return "lg:col-span-1";
      default:
        return "";
    }
  };

  return (
    <motion.div
      ref={ref}
      variants={staggerContainer}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 auto-rows-[250px] gap-6"
    >
      {features.map((feature, index) => {
        const Icon = iconMap[feature.icon];
        const isHero = index === 0;

        return (
          <motion.div
            key={feature.title}
            variants={cardVariants}
            className={`relative rounded-2xl overflow-hidden group transition-all duration-300 ease-in-out hover:shadow-2xl hover:-translate-y-1 bg-neutral-900 ${getGridClasses(
              index
            )}`}
            whileHover="hover"
            initial="rest"
            animate="rest"
          >
            <div
              className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-50 group-hover:opacity-60 transition-opacity duration-300`}
            />
            <div className="relative z-10 p-6 flex flex-col h-full">
              <div>
                <div className={`p-3 rounded-xl mb-4 inline-block bg-white/10`}>
                  <Icon
                    className={`text-white ${isHero ? "w-10 h-10" : "w-7 h-7"}`}
                  />
                </div>
                <h3
                  className={`font-bold text-white ${
                    isHero ? "text-3xl" : "text-xl"
                  }`}
                >
                  {feature.title}
                </h3>
              </div>
              <div className="relative mt-2 flex-grow flex items-center">
                <motion.div
                  className="w-full"
                  variants={{
                    rest: { opacity: 1, y: 0 },
                    hover: { opacity: 0, y: -20 },
                  }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                >
                  <p
                    className={`text-white/70 ${
                      isHero ? "text-base" : "text-sm"
                    }`}
                  >
                    {feature.description}
                  </p>
                </motion.div>
                <motion.div
                  className="absolute w-full"
                  variants={{
                    rest: { opacity: 0, y: 20 },
                    hover: { opacity: 1, y: 0 },
                  }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                >
                  <ul className="space-y-2">
                    {feature.hoverContent.map((item, i) => (
                      <li
                        key={i}
                        className="flex items-start gap-2 text-sm text-white/90"
                      >
                        <IconCheck
                          className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5"
                          aria-hidden="true"
                        />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              </div>
            </div>
          </motion.div>
        );
      })}
    </motion.div>
  );
};

export default function FeaturesSection({ id, sectionRef }) {
  return (
    <section
      id={id}
      ref={sectionRef}
      className="py-20 px-4 sm:px-8 md:px-12 lg:px-8 relative z-10 bg-[#0D1117]"
    >
      {/* Background Patterns */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Subtle Grid Pattern */}
        <div
          className="absolute inset-0 opacity-[0.15]"
          style={{
            backgroundImage: `
            linear-gradient(rgba(255, 255, 255, 0.4) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255, 255, 255, 0.4) 1px, transparent 1px)
          `,
            backgroundSize: "100px 100px",
          }}
        />

        {/* Floating Elements */}
        <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-gradient-to-br from-blue-500/35 to-purple-500/35 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-40 h-40 bg-gradient-to-tl from-green-500/35 to-teal-500/35 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-24 h-24 bg-gradient-to-r from-red-500/35 to-pink-500/35 rounded-full blur-2xl" />

        {/* Additional Glowing Elements */}
        <div className="absolute top-10 right-10 w-20 h-20 bg-gradient-to-br from-blue-400/40 to-cyan-400/40 rounded-full blur-2xl" />
        <div className="absolute bottom-10 left-10 w-16 h-16 bg-gradient-to-tl from-green-400/40 to-emerald-400/40 rounded-full blur-2xl" />
        <div className="absolute top-1/3 left-1/3 w-28 h-28 bg-gradient-to-br from-purple-400/30 to-indigo-400/30 rounded-full blur-2xl" />
        <div className="absolute bottom-1/3 right-1/3 w-24 h-24 bg-gradient-to-tl from-orange-400/30 to-yellow-400/30 rounded-full blur-2xl" />

        {/* Subtle Dots */}
        <div className="absolute top-20 right-20 w-3 h-3 bg-white/60 rounded-full" />
        <div className="absolute bottom-32 left-32 w-2.5 h-2.5 bg-white/70 rounded-full" />
        <div className="absolute top-1/3 right-1/3 w-2 h-2 bg-white/50 rounded-full" />
        <div className="absolute bottom-1/3 left-1/3 w-2.5 h-2.5 bg-white/65 rounded-full" />
        <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-white/55 rounded-full" />
        <div className="absolute bottom-1/4 right-1/4 w-3 h-3 bg-white/60 rounded-full" />

        {/* Animated Elements */}
        <div className="absolute top-1/4 right-1/4 w-4 h-4 bg-blue-400/80 rounded-full animate-pulse" />
        <div
          className="absolute bottom-1/4 left-1/4 w-3 h-3 bg-green-400/85 rounded-full animate-pulse"
          style={{ animationDelay: "1s" }}
        />
        <div
          className="absolute top-1/2 left-1/3 w-3.5 h-3.5 bg-purple-400/75 rounded-full animate-pulse"
          style={{ animationDelay: "0.5s" }}
        />
        <div
          className="absolute bottom-1/2 right-1/3 w-2.5 h-2.5 bg-orange-400/80 rounded-full animate-pulse"
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
            className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-6"
          >
            Everything You Need for{" "}
            <span className="bg-gradient-to-r from-blue-400 to-teal-400 bg-clip-text text-transparent">
              Tax Success
            </span>
          </motion.h2>
          <motion.p
            variants={sectionVariants}
            className="text-lg sm:text-xl text-white/70 max-w-3xl mx-auto"
          >
            Our comprehensive suite of tools covers every aspect of Tanzanian
            tax compliance, from basic calculations to advanced AI assistance.
          </motion.p>
        </motion.div>
        <div className="mt-12">
          <BentoGrid />
        </div>
      </div>
    </section>
  );
}
