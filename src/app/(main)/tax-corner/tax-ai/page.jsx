"use client";

import { useState, useEffect, useRef } from "react";
import {
  Button,
  Paper,
  Text,
  Title,
  Alert,
  Modal,
  ActionIcon,
  Tooltip,
  Textarea,
  ScrollArea,
  Avatar,
  Collapse,
} from "@mantine/core";
import {
  IconRobot,
  IconInfoCircle,
  IconAlertTriangle,
  IconSend,
  IconSparkles,
  IconUser,
  IconChevronDown,
} from "@tabler/icons-react";
import { useDisclosure } from "@mantine/hooks";

const sampleQuestions = {
  "What is the VAT threshold for a small business in Tanzania?":
    "In Tanzania, a business must register for Value Added Tax (VAT) if its annual taxable turnover exceeds TZS 200 million. If your turnover is below this threshold, you are not required to register for VAT, but you can choose to do so voluntarily.",
  "How do I calculate Skills and Development Levy (SDL)?":
    "The Skills and Development Levy (SDL) is calculated at a rate of 4% of the total gross emoluments paid to all employees during the month. Gross emoluments include salaries, wages, bonuses, and any other payments made to employees. This levy is applicable to employers with four or more employees.",
  "What are the due dates for filing corporate income tax returns?":
    "For companies with a financial year ending on 31st December, the final corporate income tax return must be filed within 6 months after the end of the financial year, which makes the due date 30th June of the following year. Provisional tax estimates are filed quarterly.",
  "Explain the difference between withholding tax and PAYE.":
    "PAYE (Pay As You Earn) is a tax deducted directly from an employee's salary by the employer. Withholding Tax (WHT) is a tax deducted from specific types of payments made to individuals or companies who are providing services, such as rent, royalties, or professional fees. While both are deducted at the source, PAYE applies to employment income, whereas WHT applies to service-based income.",
  "What is presumptive tax?":
    "Presumptive tax is a simplified tax regime for small businesses with an annual turnover between TZS 4 million and TZS 100 million. Instead of calculating tax on profits, a flat tax amount or a percentage of turnover is paid, which simplifies record-keeping and tax calculation for small entrepreneurs.",
  "How is rental income taxed in Tanzania?":
    "Rental income from residential properties is taxed at a flat rate of 10% on the gross rent received, and this is considered a final tax. For commercial properties, the rental income is added to the business income and taxed at the applicable corporate or individual income tax rates after deducting allowable expenses.",
  "What is the deadline for VAT returns?":
    "The deadline for filing monthly VAT returns and paying any VAT due is the 20th day of the month following the month of business. For example, the VAT return for January is due by February 20th. All VAT returns must be filed electronically through the TRA portal.",
};

function InfoModal({ opened, close }) {
  return (
    <Modal
      opened={opened}
      onClose={close}
      title={
        <Title order={3} className="text-primary flex items-center gap-2">
          <IconInfoCircle /> About Tax AI
        </Title>
      }
      size="lg"
      radius="lg"
      overlayProps={{ opacity: 0.5, blur: 2 }}
    >
      <div className="prose prose-lg max-w-none text-secondary p-4">
        <p>
          The Simplify Tax AI is designed to provide instant, clear answers to
          your questions about Tanzanian tax laws. Whether you're wondering
          about VAT, income tax, or specific filing procedures, our AI assistant
          is here to help you navigate the complexities of tax compliance.
        </p>
        <div className="bg-blue-50/80 border border-blue-200/80 rounded-xl p-4 my-6">
          <h3 className="font-semibold text-primary text-lg">How It Works</h3>
          <p className="mt-1">
            Simply type your tax-related question into the chat interface. The
            AI uses a vast database of Tanzanian tax legislation, public
            rulings, and official TRA guides to provide you with a comprehensive
            and easy-to-understand answer.
          </p>
        </div>
        <Alert
          icon={<IconAlertTriangle size="1rem" />}
          title="Important Disclaimer"
          color="yellow"
          variant="light"
          radius="md"
        >
          While our Tax AI provides valuable information based on official
          sources, it is not a substitute for professional legal or financial
          advice. The information provided is for guidance purposes only. Always
          consult with a qualified tax professional for complex matters or
          before making any financial decisions.
        </Alert>
      </div>
    </Modal>
  );
}

export default function TaxAIPage() {
  const [infoModalOpened, { open: openInfoModal, close: closeInfoModal }] =
    useDisclosure(false);
  const [samplesOpened, { toggle: toggleSamples }] = useDisclosure(false);
  const [messages, setMessages] = useState([
    {
      sender: "ai",
      text: "Hello! I'm the Simplify Tax AI. Ask me a question, or try one of the samples below. Please note that this is a pre-release demo.",
    },
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const viewport = useRef(null);

  const scrollToBottom = () =>
    viewport.current.scrollTo({
      top: viewport.current.scrollHeight,
      behavior: "smooth",
    });

  useEffect(() => {
    if (messages.length > 1) {
      scrollToBottom();
    }
  }, [messages]);

  const handleSampleClick = (question, answer) => {
    if (isTyping) return;

    // Add user question
    setMessages((prev) => [...prev, { sender: "user", text: question }]);
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      setMessages((prev) => [...prev, { sender: "ai", text: answer }]);
      setIsTyping(false);
    }, 1200); // Simulate typing delay
  };

  return (
    <>
      <InfoModal opened={infoModalOpened} close={closeInfoModal} />
      <div className="max-w-3xl mx-auto p-4 flex flex-col h-[calc(100vh-150px)]">
        <Paper
          shadow="lg"
          p="lg"
          radius="xl"
          className="bg-white/80 border border-gray-200/80 h-full flex flex-col"
        >
          <div className="flex justify-between items-center mb-4 pb-4 border-b border-gray-200">
            <div className="flex items-center gap-3">
              <div className="bg-primary/10 p-2 rounded-full">
                <IconRobot className="w-7 h-7 text-primary" />
              </div>
              <div>
                <Title order={2} className="text-primary text-xl sm:text-2xl">
                  Tax AI Assistant
                </Title>
                <Text c="dimmed" size="sm">
                  Your guide to Tanzanian tax regulations.
                </Text>
              </div>
            </div>
            <Tooltip label="About our Tax AI" withArrow>
              <ActionIcon
                variant="light"
                color="primary"
                size="lg"
                onClick={openInfoModal}
              >
                <IconInfoCircle />
              </ActionIcon>
            </Tooltip>
          </div>

          {/* Chat Body */}
          <ScrollArea className="flex-grow mb-4 min-h-0" viewportRef={viewport}>
            <div className="p-4 space-y-4">
              {messages.map((msg, index) => (
                <div
                  key={index}
                  className={`flex items-start gap-3 ${
                    msg.sender === "user" ? "justify-end" : ""
                  }`}
                >
                  {msg.sender === "ai" && (
                    <Avatar color="primary" radius="xl">
                      <IconRobot />
                    </Avatar>
                  )}
                  <div
                    className={`max-w-md p-3 rounded-xl ${
                      msg.sender === "user"
                        ? "bg-primary text-white rounded-br-none"
                        : "bg-gray-100 text-gray-800 rounded-bl-none"
                    }`}
                  >
                    <Text>{msg.text}</Text>
                  </div>
                  {msg.sender === "user" && (
                    <Avatar color="blue" radius="xl">
                      <IconUser />
                    </Avatar>
                  )}
                </div>
              ))}
              {isTyping && (
                <div className="flex items-start gap-3">
                  <Avatar color="primary" radius="xl">
                    <IconRobot />
                  </Avatar>
                  <div className="p-3 rounded-xl bg-gray-100 text-gray-500 rounded-bl-none">
                    <div className="flex items-center gap-1">
                      <span className="h-2 w-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                      <span className="h-2 w-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                      <span className="h-2 w-2 bg-gray-400 rounded-full animate-bounce"></span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>

          {/* Sample Questions */}
          <div className="flex-shrink-0 pt-4 border-t border-gray-200">
            <Button
              fullWidth
              variant="light"
              onClick={toggleSamples}
              leftIcon={<IconSparkles size="1.1rem" />}
              rightIcon={
                <IconChevronDown
                  className={`transition-transform ${
                    samplesOpened ? "rotate-180" : ""
                  }`}
                />
              }
            >
              {samplesOpened ? "Hide" : "Show"} Sample Questions
            </Button>
            <Collapse in={samplesOpened}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-3">
                {Object.entries(sampleQuestions).map(([q, a]) => (
                  <Button
                    key={q}
                    variant="subtle"
                    color="gray"
                    onClick={() => handleSampleClick(q, a)}
                    className="text-left h-auto py-2 whitespace-normal text-xs sm:text-sm"
                    disabled={isTyping}
                  >
                    {q}
                  </Button>
                ))}
              </div>
            </Collapse>
          </div>
        </Paper>
      </div>
    </>
  );
}
