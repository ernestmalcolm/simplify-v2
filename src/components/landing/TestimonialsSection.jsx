"use client";

import { motion } from "framer-motion";
import { IconQuote } from "@tabler/icons-react";

const sectionVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

const staggerContainer = {
  visible: { transition: { staggerChildren: 0.18 } },
};

const testimonials = [
  {
    name: "Sarah Mwangi",
    role: "Small Business Owner",
    quote:
      "Simplify has been a game-changer for my business. I used to dread tax season, but now I feel confident and in control. The AI assistant is like having a tax expert on call 24/7.",
  },
  {
    name: "John Makame",
    role: "Freelance Consultant",
    quote:
      "As a freelancer, managing invoices and expenses was a constant headache. Simplify's tools are so intuitive and have saved me countless hours. The compliance reminders are a lifesaver!",
  },
  {
    name: "Fatima Al-Habsi",
    role: "Retail Store Manager",
    quote:
      "The advanced reporting features give me a clear overview of my business's financial health at any time. It's powerful, yet surprisingly easy to use. Highly recommended for any Tanzanian business.",
  },
];

export default function TestimonialsSection({ id, sectionRef }) {
  return (
    <section
      id={id}
      ref={sectionRef}
      className="py-20 px-4 sm:px-8 md:px-12 lg:px-8 relative z-10 bg-gray-50"
    >
      {/* Background Patterns */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Subtle Wave Pattern */}
        <div
          className="absolute inset-0 opacity-[0.08]"
          style={{
            backgroundImage: `
            repeating-linear-gradient(
              45deg,
              transparent,
              transparent 10px,
              rgba(59, 130, 246, 0.1) 10px,
              rgba(59, 130, 246, 0.1) 20px
            )
          `,
          }}
        />

        {/* Floating Quote Marks */}
        <div className="absolute top-16 left-16 text-8xl text-blue-400/20 font-serif">
          "
        </div>
        <div className="absolute bottom-16 right-16 text-8xl text-green-400/20 font-serif">
          "
        </div>
        <div className="absolute top-1/3 right-1/4 text-6xl text-purple-400/15 font-serif">
          "
        </div>
        <div className="absolute bottom-1/3 left-1/4 text-6xl text-orange-400/15 font-serif">
          "
        </div>

        {/* Geometric Accents */}
        <div className="absolute top-10 right-10 w-16 h-16 border-2 border-blue-400/25 rounded-full" />
        <div className="absolute bottom-10 left-10 w-12 h-12 border-2 border-green-400/30 rotate-45" />
        <div className="absolute top-1/2 left-10 w-8 h-8 border-2 border-purple-400/25 rounded-full" />
        <div className="absolute bottom-1/2 right-10 w-10 h-10 border-2 border-orange-400/30 rotate-45" />

        {/* Gradient Circles */}
        <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-gradient-to-br from-blue-400/12 to-transparent rounded-full blur-2xl" />
        <div className="absolute bottom-1/4 right-1/4 w-28 h-28 bg-gradient-to-tl from-green-400/12 to-transparent rounded-full blur-2xl" />
        <div className="absolute top-1/2 right-1/3 w-20 h-20 bg-gradient-to-bl from-purple-400/10 to-transparent rounded-full blur-xl" />
        <div className="absolute bottom-1/2 left-1/3 w-24 h-24 bg-gradient-to-tr from-orange-400/10 to-transparent rounded-full blur-xl" />

        {/* Animated Dots */}
        <div className="absolute top-1/4 right-1/3 w-2 h-2 bg-blue-500/50 rounded-full animate-pulse" />
        <div
          className="absolute bottom-1/4 left-1/3 w-2.5 h-2.5 bg-green-500/55 rounded-full animate-pulse"
          style={{ animationDelay: "0.8s" }}
        />
        <div
          className="absolute top-1/3 left-1/3 w-2 h-2 bg-purple-500/45 rounded-full animate-pulse"
          style={{ animationDelay: "1.2s" }}
        />
        <div
          className="absolute bottom-1/3 right-1/3 w-3 h-3 bg-orange-500/50 rounded-full animate-pulse"
          style={{ animationDelay: "0.4s" }}
        />

        {/* Additional Floating Elements */}
        <div className="absolute top-20 left-1/2 transform -translate-x-1/2 w-4 h-4 bg-blue-400/40 rounded-full animate-bounce" />
        <div
          className="absolute bottom-20 right-1/2 transform translate-x-1/2 w-3 h-3 bg-green-400/45 rounded-full animate-bounce"
          style={{ animationDelay: "1s" }}
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
            Loved by Businesses Like Yours
          </motion.h2>
          <motion.p
            variants={sectionVariants}
            className="text-lg sm:text-xl text-secondary max-w-3xl mx-auto"
          >
            See how Simplify is helping business owners across Tanzania
            streamline their tax compliance and financial management.
          </motion.p>
        </motion.div>
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, amount: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              variants={sectionVariants}
              className="bg-white rounded-2xl p-8 shadow-lg flex flex-col"
            >
              <IconQuote className="w-10 h-10 text-primary/30 mb-4" />
              <p className="text-secondary italic mb-6 flex-grow">
                "{testimonial.quote}"
              </p>
              <div>
                <p className="font-bold text-primary">{testimonial.name}</p>
                <p className="text-sm text-secondary">{testimonial.role}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
