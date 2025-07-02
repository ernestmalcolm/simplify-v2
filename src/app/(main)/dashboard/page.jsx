"use client";

import { useEffect, useState, useRef } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";
import {
  Loader,
  Skeleton,
  Card,
  Group,
  Title,
  Text,
  Badge,
  Button,
  Tooltip,
  Divider,
  Box,
  Notification,
  Select,
} from "@mantine/core";
import {
  IconChartBar,
  IconCurrencyDollar,
  IconReceipt,
  IconLock,
  IconChevronRight,
  IconBulb,
  IconRocket,
  IconCrown,
  IconAlertCircle,
  IconFileText,
  IconReport,
  IconReceipt2,
  IconLockOpen,
  IconMessageCircle2,
  IconDatabase,
  IconTrendingUp,
  IconCalculator,
  IconAlertTriangle,
  IconInfoCircle,
  IconCalendar,
  IconBrain,
  IconCreditCard,
  IconHome,
  IconCash,
  IconBook,
  IconRobot,
  IconChevronDown,
  IconChevronUp,
  IconFolder,
} from "@tabler/icons-react";
import PlanBadge from "@/components/ui/PlanBadge";
import { motion, AnimatePresence } from "framer-motion";
import { notifications } from "@mantine/notifications";

function formatCurrency(value) {
  if (value == null || value === "") return "-";
  return "TZS " + Number(value).toLocaleString();
}

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
}

function getGreetingEmoji() {
  const hour = new Date().getHours();
  if (hour < 12) return "🌤";
  if (hour < 18) return "☀️";
  return "🌙";
}

function getProfitMargin(revenue, expenses) {
  if (!revenue || revenue === 0) return null;
  const margin = ((revenue - expenses) / revenue) * 100;
  return Math.round(margin);
}

function formatYAxisTick(value) {
  if (value >= 1000000) return `TZS ${(value / 1000000).toLocaleString()}M`;
  if (value >= 1000) return `TZS ${(value / 1000).toLocaleString()}K`;
  return `TZS ${value}`;
}

export default function DashboardPage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentPlan, setCurrentPlan] = useState("free");
  const router = useRouter();

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();
      if (!user || userError) {
        router.replace("/login");
        return;
      }
      setUser(user);

      // Fetch user's plan (you can implement this based on your billing system)
      // For now, we'll set it to free as default
      setCurrentPlan("free");

      setLoading(false);
    }
    fetchData();
  }, [router]);

  const greeting = getGreeting();
  const fullName = user?.user_metadata?.full_name;
  const displayName = fullName || "-";

  const taxCornerFeatures = [
    {
      title: "Tax Information",
      description: "Comprehensive tax guides and resources",
      icon: IconBook,
      href: "/tax-corner/tax-info",
      color: "blue",
      plan: "free",
    },
    {
      title: "Tax AI Assistant",
      description: "Get AI-powered tax advice and answers",
      icon: IconRobot,
      href: "/tax-corner/tax-ai",
      color: "blue",
      plan: "free",
    },
    {
      title: "Tax Calendar",
      description: "Never miss important tax deadlines",
      icon: IconCalendar,
      href: "/tax-corner/tax-calendar",
      color: "blue",
      plan: "free",
    },
    {
      title: "Tax Calculator",
      description: "Calculate your tax obligations",
      icon: IconCalculator,
      href: "/tax-corner/tax-calculator",
      color: "blue",
      plan: "free",
    },
  ];

  const lockedFeatures = [
    {
      title: "Sales Management",
      description: "Track sales, invoices, and revenue",
      icon: IconTrendingUp,
      href: "/sales",
      color: "green",
      plan: "pro",
    },
    {
      title: "Expense Tracking",
      description: "Monitor and categorize expenses",
      icon: IconReceipt,
      href: "/expenses",
      color: "red",
      plan: "pro",
    },
    {
      title: "Financial Reports",
      description: "Generate detailed financial reports",
      icon: IconReport,
      href: "/reports",
      color: "blue",
      plan: "pro",
    },
  ];

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <Loader size="lg" />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <Card shadow="sm" p="lg" radius="md" withBorder className="mb-12">
        <div className="flex justify-between items-start">
          <div>
            <Title order={2} className="mb-2">
              {getGreetingEmoji()} {greeting}, {displayName}
            </Title>
            <Text c="dimmed">Welcome to your dashboard.</Text>
          </div>
          <PlanBadge plan={currentPlan} />
        </div>
      </Card>

      {/* Tax Corner Section */}
      <div className="mb-12">
        <Title order={3} className="mb-6 flex items-center gap-2">
          <IconBulb className="w-6 h-6 text-blue-600" />
          Tax Corner
        </Title>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {taxCornerFeatures.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="h-full"
            >
              <Card
                shadow="sm"
                p="md"
                radius="md"
                className="h-full cursor-pointer bg-white/60 backdrop-blur-sm border border-black/5 hover:border-blue-500/30 hover:shadow-xl hover:shadow-blue-600/10 transition-all duration-300"
                onClick={() => router.push(feature.href)}
              >
                <div className="flex flex-col h-full">
                  <div className="flex items-center justify-between mb-3">
                    <feature.icon
                      className="w-8 h-8 text-blue-700"
                      strokeWidth={1.5}
                    />
                    <IconChevronRight className="w-5 h-5 text-gray-400" />
                  </div>
                  <Title order={4} fw={600} className="mb-2 text-gray-800">
                    {feature.title}
                  </Title>
                  <Text size="sm" c="dimmed" className="flex-grow">
                    {feature.description}
                  </Text>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Premium Features Section */}
      <div>
        <Title order={3} className="mb-6 flex items-center gap-2">
          <IconLock className="w-6 h-6 text-gray-600" />
          Premium Features
        </Title>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {lockedFeatures.map((feature, index) => {
            const isLocked =
              (feature.plan === "pro" &&
                currentPlan !== "pro" &&
                currentPlan !== "premium") ||
              (feature.plan === "premium" && currentPlan !== "premium");

            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: (index + 4) * 0.1 }}
                className="h-full"
              >
                {isLocked ? (
                  <Card
                    shadow="sm"
                    p="lg"
                    radius="md"
                    withBorder
                    className="h-full flex flex-col items-center justify-center text-center"
                  >
                    <IconLock className="w-8 h-8 text-gray-400 mb-4" />
                    <Text size="sm" c="dimmed">
                      Upgrade to Pro to access
                    </Text>
                    <Text fw={500} className="mb-4">
                      {feature.title}
                    </Text>
                    <Button
                      onClick={() => router.push("/billing")}
                      className="bg-primary hover:bg-primary/90"
                    >
                      Upgrade Plan
                    </Button>
                  </Card>
                ) : (
                  <Card
                    shadow="sm"
                    p="md"
                    radius="md"
                    className="h-full cursor-pointer bg-white/60 backdrop-blur-sm border border-black/5 hover:border-blue-500/30 hover:shadow-xl hover:shadow-blue-600/10 transition-all duration-300"
                    onClick={() => router.push(feature.href)}
                  >
                    <div className="flex flex-col h-full">
                      <div className="flex items-center justify-between mb-3">
                        <feature.icon
                          className="w-8 h-8 text-blue-700"
                          strokeWidth={1.5}
                        />
                        <IconChevronRight className="w-5 h-5 text-gray-400" />
                      </div>
                      <Title order={4} fw={600} className="mb-2 text-gray-800">
                        {feature.title}
                      </Title>
                      <Text size="sm" c="dimmed" className="flex-grow">
                        {feature.description}
                      </Text>
                    </div>
                  </Card>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
