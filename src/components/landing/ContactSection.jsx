"use client";

import { motion } from "framer-motion";
import {
  IconMail,
  IconPhone,
  IconMapPin,
  IconUser,
  IconMessageCircle,
} from "@tabler/icons-react";

const sectionVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

export default function ContactSection({ id, sectionRef }) {
  return (
    <section
      id={id}
      ref={sectionRef}
      className="py-20 px-4 sm:px-8 md:px-12 lg:px-8 relative z-10 bg-white"
    >
      {/* Background Patterns */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Subtle Grid Pattern */}
        <div
          className="absolute inset-0 opacity-[0.10]"
          style={{
            backgroundImage: `
            linear-gradient(rgba(59, 130, 246, 0.2) 1px, transparent 1px),
            linear-gradient(90deg, rgba(59, 130, 246, 0.2) 1px, transparent 1px)
          `,
            backgroundSize: "60px 60px",
          }}
        />

        {/* Floating Envelope Icons */}
        <div className="absolute top-16 left-16 text-6xl text-blue-400/20">
          <IconMail className="w-16 h-16" />
        </div>
        <div className="absolute bottom-16 right-16 text-6xl text-green-400/20">
          <IconPhone className="w-16 h-16" />
        </div>
        <div className="absolute top-1/3 right-1/4 text-5xl text-purple-400/15">
          <IconMessageCircle className="w-12 h-12" />
        </div>
        <div className="absolute bottom-1/3 left-1/4 text-5xl text-orange-400/15">
          <IconMapPin className="w-12 h-12" />
        </div>

        {/* Geometric Shapes */}
        <div className="absolute top-10 right-10 w-20 h-20 border-2 border-blue-400/25 rounded-full" />
        <div className="absolute bottom-10 left-10 w-16 h-16 border-2 border-green-400/30 rotate-45" />
        <div className="absolute top-1/2 left-10 w-12 h-12 border-2 border-purple-400/25 rounded-full" />
        <div className="absolute bottom-1/2 right-10 w-14 h-14 border-2 border-orange-400/30 rotate-45" />

        {/* Additional Shapes */}
        <div className="absolute top-1/4 left-1/3 w-10 h-10 border border-blue-300/40 rotate-12" />
        <div className="absolute bottom-1/4 right-1/3 w-8 h-8 border border-green-300/45 rounded-full" />

        {/* Gradient Orbs */}
        <div className="absolute top-1/4 right-1/4 w-36 h-36 bg-gradient-to-br from-blue-400/12 to-transparent rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 left-1/4 w-28 h-28 bg-gradient-to-tl from-green-400/12 to-transparent rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-gradient-to-r from-purple-400/10 to-pink-400/10 rounded-full blur-2xl" />
        <div className="absolute top-1/3 left-1/3 w-24 h-24 bg-gradient-to-bl from-orange-400/10 to-red-400/10 rounded-full blur-2xl" />

        {/* Animated Elements */}
        <div className="absolute top-1/4 left-1/4 w-3 h-3 bg-blue-500/55 rounded-full animate-pulse" />
        <div
          className="absolute bottom-1/4 right-1/4 w-2.5 h-2.5 bg-green-500/60 rounded-full animate-pulse"
          style={{ animationDelay: "0.8s" }}
        />
        <div
          className="absolute top-1/2 right-1/3 w-2 h-2 bg-purple-500/50 rounded-full animate-pulse"
          style={{ animationDelay: "1.2s" }}
        />
        <div
          className="absolute bottom-1/2 left-1/3 w-3 h-3 bg-orange-500/55 rounded-full animate-pulse"
          style={{ animationDelay: "0.4s" }}
        />

        {/* Floating Dots */}
        <div className="absolute top-20 left-1/2 transform -translate-x-1/2 w-4 h-4 bg-blue-400/40 rounded-full animate-bounce" />
        <div
          className="absolute bottom-20 right-1/2 transform translate-x-1/2 w-3 h-3 bg-green-400/45 rounded-full animate-bounce"
          style={{ animationDelay: "1s" }}
        />
        <div
          className="absolute top-1/3 right-1/2 transform translate-x-1/2 w-2.5 h-2.5 bg-purple-400/35 rounded-full animate-bounce"
          style={{ animationDelay: "0.6s" }}
        />
        <div
          className="absolute bottom-1/3 left-1/2 transform -translate-x-1/2 w-3.5 h-3.5 bg-orange-400/40 rounded-full animate-bounce"
          style={{ animationDelay: "1.4s" }}
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
            Get in Touch
          </motion.h2>
          <motion.p
            variants={sectionVariants}
            className="text-lg sm:text-xl text-secondary max-w-3xl mx-auto"
          >
            Have questions? We'd love to hear from you. Send us a message and
            we'll respond as soon as possible.
          </motion.p>
        </motion.div>
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, amount: 0.2 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-12"
        >
          <motion.div variants={sectionVariants}>
            <form className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label
                    htmlFor="firstName"
                    className="block text-sm font-medium text-primary mb-2"
                  >
                    First Name
                  </label>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-colors"
                    placeholder="John"
                  />
                </div>
                <div>
                  <label
                    htmlFor="lastName"
                    className="block text-sm font-medium text-primary mb-2"
                  >
                    Last Name
                  </label>
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-colors"
                    placeholder="Doe"
                  />
                </div>
              </div>
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-primary mb-2"
                >
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-colors"
                  placeholder="john@example.com"
                />
              </div>
              <div>
                <label
                  htmlFor="message"
                  className="block text-sm font-medium text-primary mb-2"
                >
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={6}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-colors resize-none"
                  placeholder="Tell us about your business needs..."
                />
              </div>
              <button
                type="submit"
                className="w-full bg-primary text-white py-3 px-6 rounded-lg font-semibold hover:bg-primary/90 transition-colors duration-200"
              >
                Send Message
              </button>
            </form>
          </motion.div>
          <motion.div variants={sectionVariants} className="space-y-8">
            <div>
              <h3 className="text-2xl font-bold text-primary mb-6">
                Contact Information
              </h3>
              <div className="space-y-4">
                <div className="flex items-center">
                  <div className="bg-primary/10 p-3 rounded-lg mr-4">
                    <IconMail className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold text-primary">Email</p>
                    <p className="text-secondary">sales@simplify.co.tz</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <div className="bg-primary/10 p-3 rounded-lg mr-4">
                    <IconPhone className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold text-primary">Phone</p>
                    <p className="text-secondary">+255 742 200 105</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <div className="bg-primary/10 p-3 rounded-lg mr-4">
                    <IconMapPin className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold text-primary">Address</p>
                    <p className="text-secondary">
                      Mikocheni
                      <br />
                      Dar es Salaam, Tanzania
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div>
              <h3 className="text-2xl font-bold text-primary mb-6">
                Business Hours
              </h3>
              <div className="space-y-2 text-secondary">
                <p>Monday - Friday: 8:30 AM - 5:00 PM EAT</p>
                <p>Saturday - Sunday: 9:00 AM - 2:00 PM EAT</p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
