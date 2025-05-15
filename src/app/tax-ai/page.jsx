"use client";

import { useState, useEffect, useRef } from "react";
import Navbar from "@/components/Navbar";
import { Collapse } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { motion } from "framer-motion";

const quickPrompts = [
  "What is VAT and who must register?",
  "How is PAYE calculated and when is it due?",
  "What is Skills Development Levy (SDL) and who pays it?",
  "How do I register for a TIN in Tanzania?",
  "What are the penalties for late tax filing?",
  "What is the corporate income tax rate and who pays it?",
  "What are exempt supplies under VAT?",
  "How do I file my annual income tax return?",
  "What is withholding tax and when does it apply?",
  "What are the deadlines for filing different taxes?",
];

const mockResponses = {
  "What is VAT and who must register?":
    "VAT (Value Added Tax) is a consumption tax charged at 18% on most goods and services in Tanzania. Businesses with annual turnover exceeding TZS 200 million must register for VAT with the TRA. For example, if your business made TZS 120 million last year, you are required to register for VAT.",
  "How is PAYE calculated and when is it due?":
    "PAYE (Pay As You Earn) is income tax withheld from employees' salaries. The rates are progressive, up to 30%. For example, if an employee earns TZS 1,000,000/month, the employer calculates PAYE using the TRA tax bands. PAYE returns and payments are due by the 7th of the following month.",
  "What is Skills Development Levy (SDL) and who pays it?":
    "SDL is a levy paid by employers with 4 or more employees, calculated at 4.5% of gross salaries. For example, if your total monthly payroll is TZS 2,000,000, SDL payable is TZS 90,000. Returns and payments are due by the 7th of the following month.",
  "How do I register for a TIN in Tanzania?":
    "To register for a TIN (Tax Identification Number), visit your nearest TRA office with your business registration documents, ID, and proof of address. You can also register online via the TRA portal (https://ots.tra.go.tz/). For example, a new business must obtain a TIN before starting operations.",
  "What are the penalties for late tax filing?":
    "Penalties for late filing vary by tax type. For VAT, late filing attracts a penalty of TZS 100,000 and 2% interest per month on unpaid tax. For PAYE, penalties and interest are also charged. For example, if you file your VAT return 2 months late, you may owe TZS 200,000 plus interest.",
  "What is the corporate income tax rate and who pays it?":
    "Corporate income tax is paid by companies operating in Tanzania at a standard rate of 30%. For example, if a company has taxable profits of TZS 10,000,000, the tax due is TZS 3,000,000. Some sectors (like new manufacturers) may have reduced rates.",
  "What are exempt supplies under VAT?":
    "Exempt supplies are goods and services not subject to VAT, such as basic food items, medical services, and educational services. For example, selling maize flour is exempt from VAT, so you do not charge VAT on such sales.",
  "How do I file my annual income tax return?":
    "Annual income tax returns are filed with the TRA by 30th June each year. You need to complete the relevant forms (available on the TRA portal), attach supporting documents, and submit online or at a TRA office. For example, individuals and companies must declare all income earned in the previous year.",
  "What is withholding tax and when does it apply?":
    "Withholding tax is deducted at source on certain payments such as rent, interest, dividends, and service fees. For example, if you pay a consultant TZS 1,000,000, you must withhold 5% (TZS 50,000) and remit it to TRA. Rates vary by payment type.",
  "What are the deadlines for filing different taxes?":
    "VAT returns: 20th of the following month. PAYE & SDL: 7th of the following month. Income tax: 30th June annually. For example, January VAT is due by February 20th, and January PAYE is due by February 7th.",
};

const BOT_AVATAR = "/logos/letter-logo.svg";
const USER_AVATAR = null; // We'll use a colored circle for user

export default function ChatAIPage() {
  const [messages, setMessages] = useState([
    {
      type: "bot",
      content:
        "Hi! I am Tax AI, your assistant for Tanzanian tax questions. Ask me about VAT, PAYE, TIN registration, and more!",
      timestamp: null, // No timestamp on SSR
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [loading, setLoading] = useState(false);
  const inputRef = useRef(null);
  const messagesEndRef = useRef(null);
  const [mounted, setMounted] = useState(false);
  const [suggestionsOpened, setSuggestionsOpened] = useState(false);

  useEffect(() => {
    setMounted(true);
    setMessages((msgs) =>
      msgs.map((msg, i) =>
        i === 0 && !msg.timestamp ? { ...msg, timestamp: new Date() } : msg
      )
    );
  }, []);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, loading]);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [loading]);

  useEffect(() => {
    if (typeof window !== "undefined" && window.innerWidth >= 640) {
      setSuggestionsOpened(true);
    }
  }, []);

  const handleSendMessage = (message) => {
    if (!message.trim() || loading) return;
    const now = new Date();
    setMessages((prev) => [
      ...prev,
      { type: "user", content: message, timestamp: now },
    ]);
    setInputValue("");
    setLoading(true);
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          type: "bot",
          content:
            mockResponses[message] ||
            "I apologize, but I can only answer questions about VAT, PAYE, and TIN registration at the moment.",
          timestamp: new Date(),
        },
      ]);
      setLoading(false);
    }, 900);
  };

  const handleInputKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage(inputValue);
    }
  };

  const handleClearChat = () => {
    setMessages([
      {
        type: "bot",
        content:
          "Hi! I am Tax AI, your assistant for Tanzanian tax questions. Ask me about VAT, PAYE, TIN registration, and more!",
        timestamp: new Date(),
      },
    ]);
    setInputValue("");
    if (inputRef.current) inputRef.current.focus();
  };

  const formatTime = (date) => {
    if (!(date instanceof Date)) date = new Date(date);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const toggleSuggestions = () => setSuggestionsOpened((o) => !o);

  return (
    <>
      <Navbar />
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="max-w-4xl mx-auto mt-10 px-2 xs:px-4 sm:px-8 md:px-12 lg:px-0 flex flex-col mb-8 h-[90vh] min-h-[500px]"
      >
        <h1 className="text-2xl sm:text-3xl font-bold text-primary mb-2 flex items-center gap-2">
          <span role="img" aria-label="robot">
            🤖
          </span>{" "}
          Chat with Tax AI
        </h1>
        <p className="text-sm sm:text-base text-gray-500 mb-6">
          Tax AI helps you with Tanzanian tax questions—VAT, PAYE, TIN
          registration, and more. <br />
          <span className="text-primary font-semibold">Note:</span> Freeform AI
          chat is in development. For now, please use the predefined questions
          below.
        </p>
        <div className="bg-gradient-to-br from-blue-50/40 to-white p-2 sm:p-4 md:p-6 rounded-xl shadow flex-1 flex flex-col border border-gray-100 relative min-h-0 h-full">
          <div className="flex justify-end mb-2">
            <button
              onClick={handleClearChat}
              className="text-xs sm:text-sm text-red-500 border border-red-200 px-2 sm:px-3 py-1 rounded-lg hover:bg-red-50 transition-colors z-10"
              disabled={loading}
            >
              Clear Chat
            </button>
          </div>
          <div className="mb-2 flex justify-between items-center">
            <button
              onClick={toggleSuggestions}
              className="text-xs sm:text-sm text-primary border border-primary/30 px-2 sm:px-3 py-1 rounded-lg hover:bg-primary/10 transition-colors"
              aria-expanded={suggestionsOpened}
              aria-controls="ai-suggestions-collapse"
              type="button"
            >
              {suggestionsOpened ? "Hide Suggestions" : "Show Suggestions"}
            </button>
          </div>
          <Collapse in={suggestionsOpened} id="ai-suggestions-collapse">
            <div
              className="flex flex-wrap gap-2 mb-3 overflow-y-auto"
              style={{ maxHeight: 120 }}
            >
              {quickPrompts.map((prompt) => (
                <button
                  key={prompt}
                  onClick={() => handleSendMessage(prompt)}
                  className="bg-primary/10 text-primary px-2 sm:px-3 py-1 rounded-lg hover:bg-primary/20 transition-colors text-[11px] sm:text-xs md:text-sm"
                  disabled={loading}
                >
                  {prompt}
                </button>
              ))}
            </div>
          </Collapse>
          <div className="flex-1 overflow-y-auto p-2 sm:p-4 space-y-4 min-h-0">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex items-end gap-2 transition-all duration-300 ${
                  message.type === "user" ? "justify-end" : "justify-start"
                }`}
              >
                {message.type === "bot" && (
                  <img
                    src={BOT_AVATAR}
                    alt="Bot"
                    className="w-8 h-8 rounded-full bg-primary/10 border border-primary/20 object-contain"
                  />
                )}
                {message.type === "user" && (
                  <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white font-bold">
                    U
                  </div>
                )}
                <div
                  className={`max-w-[80%] rounded-lg p-3 sm:p-4 shadow-sm relative transition-all duration-300 text-xs sm:text-sm md:text-base ${
                    message.type === "user"
                      ? "bg-primary text-white rounded-br-none"
                      : "bg-gray-100 text-secondary rounded-bl-none"
                  }`}
                  style={{ animation: "fadeIn 0.3s" }}
                >
                  <div>{message.content}</div>
                  <span className="absolute bottom-1 right-2 text-[10px] sm:text-xs text-gray-400 select-none">
                    {mounted && formatTime(message.timestamp)}
                  </span>
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex items-end gap-2 justify-start animate-pulse">
                <img
                  src={BOT_AVATAR}
                  alt="Bot"
                  className="w-8 h-8 rounded-full bg-primary/10 border border-primary/20 object-contain"
                />
                <div className="max-w-[80%] rounded-lg p-4 bg-gray-100 text-secondary shadow-sm">
                  <span className="inline-block w-6 h-2 bg-gray-300 rounded-full mr-1 animate-bounce"></span>
                  <span className="inline-block w-4 h-2 bg-gray-200 rounded-full animate-bounce"></span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
          <div className="border-t border-gray-200 p-2 sm:p-4 bg-white rounded-b-xl">
            <div className="flex flex-wrap gap-2 mb-3">
              {/* suggestions collapse here, unchanged */}
            </div>
            <div className="flex flex-row gap-2 sm:gap-4 w-full">
              <div className="flex-1 flex">
                <textarea
                  ref={inputRef}
                  rows={1}
                  value={inputValue}
                  onChange={() => {}}
                  onKeyDown={() => {}}
                  placeholder="Text input disabled."
                  className="w-full px-3 sm:px-4 py-2 rounded-lg border border-gray-200 bg-gray-100 text-gray-400 cursor-not-allowed resize-none min-h-[44px] max-h-32 text-xs sm:text-sm md:text-base"
                  disabled
                />
              </div>
              <button
                className="bg-primary text-white px-4 sm:px-6 py-2 rounded-lg opacity-50 cursor-not-allowed text-xs sm:text-sm md:text-base flex-shrink-0"
                disabled
              >
                Send
              </button>
            </div>
            <div className="text-xs text-gray-400 mt-1">
              Freeform input is disabled while AI chat is in development. Select
              a question above to get an answer.
            </div>
          </div>
        </div>
      </motion.div>
      <style jsx global>{`
        body {
          background: linear-gradient(135deg, #e0f2fe 0%, #f8fafc 100%);
        }
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </>
  );
}
