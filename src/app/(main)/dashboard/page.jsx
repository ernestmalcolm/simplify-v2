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
  const [company, setCompany] = useState(null);
  const [user, setUser] = useState(null);
  const [metrics, setMetrics] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Tooltip state
  const [hoveredBar, setHoveredBar] = useState(null);
  const chartRef = useRef();

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
      const { data: company, error: companyError } = await supabase
        .from("companies")
        .select("id, name, plan")
        .eq("user_id", user.id)
        .single();
      if (!company || companyError) {
        notifications.show({
          color: "red",
          title: "Company not found",
          message: "Company not found.",
        });
        setLoading(false);
        return;
      }
      setCompany(company);
      // Fetch metrics
      const { data: metricsData, error: metricsError } = await supabase
        .from("company_financial_metrics")
        .select("*")
        .eq("company_id", company.id)
        .order("year", { ascending: false });
      if (metricsError) {
        notifications.show({
          color: "red",
          title: "Error",
          message: "Could not load company metrics.",
        });
        setLoading(false);
        return;
      }
      setMetrics(metricsData || []);
      setLoading(false);
    }
    fetchData();
  }, [router]);

  // Greeting logic
  const greeting = getGreeting();
  const fullName = user?.user_metadata?.full_name;
  const displayName = fullName || company?.name || "-";

  // Metrics logic
  const last5 = metrics.slice(0, 5).reverse();
  const years = last5.map((m) => m.year);
  const yearStrings = years.map((y) => String(y));
  const [selectedYear, setSelectedYear] = useState(
    yearStrings[yearStrings.length - 1] || null
  );
  useEffect(() => {
    if (yearStrings.length && !selectedYear)
      setSelectedYear(yearStrings[yearStrings.length - 1]);
  }, [yearStrings]);
  const selectedMetric =
    last5.find((m) => String(m.year) === selectedYear) ||
    last5[last5.length - 1] ||
    {};
  const revenues = last5.map((m) => m.annual_revenue || 0);
  const expenses = last5.map((m) => m.annual_expenses || 0);
  // Chart Y-axis logic (must come after revenues/expenses are defined)
  const maxValue = Math.max(...revenues, ...expenses, 1);
  const yTicks = [0, 0.25, 0.5, 0.75, 1].map((f) => Math.round(maxValue * f));
  const netIncome =
    (selectedMetric.annual_revenue || 0) -
    (selectedMetric.annual_expenses || 0);
  const profitMargin = getProfitMargin(
    selectedMetric.annual_revenue,
    selectedMetric.annual_expenses
  );
  const netIncomePositive = netIncome >= 0;
  const latestYear = selectedMetric.year || "-";

  // Reminders logic
  const reminders = [];
  if (selectedMetric.employee_count > 0)
    reminders.push({
      label: "PAYE due on 7th",
      icon: <IconReceipt size={18} />,
    });
  if (selectedMetric.vat_registered)
    reminders.push({
      label: "VAT due on 20th",
      icon: <IconReceipt size={18} />,
    });
  if (selectedMetric.withholding_obligations)
    reminders.push({ label: "WHT reminders", icon: <IconReceipt size={18} /> });
  if (selectedMetric.provisional_taxpayer)
    reminders.push({
      label: "Provisional Tax due (quarterly)",
      icon: <IconReceipt size={18} />,
    });

  // Smart insights (improved)
  let insights = [];
  if (metrics.length >= 2) {
    const prev = metrics[1];
    if (prev && selectedMetric.annual_revenue && prev.annual_revenue) {
      const diff = selectedMetric.annual_revenue - prev.annual_revenue;
      const pct = Math.round((diff / prev.annual_revenue) * 100);
      if (pct < 0)
        insights.push({
          type: "trend",
          message: `Your income dropped ${Math.abs(pct)}% from ${
            prev.year
          } to ${selectedMetric.year}`,
          explanation: `Compared annual revenue for ${prev.year} and ${selectedMetric.year}`,
        });
      else if (pct > 0)
        insights.push({
          type: "trend",
          message: `Your income grew ${pct}% from ${prev.year} to ${selectedMetric.year}`,
          explanation: `Compared annual revenue for ${prev.year} and ${selectedMetric.year}`,
        });
    }
    // Profit margin streak
    const marginThis = getProfitMargin(
      selectedMetric.annual_revenue,
      selectedMetric.annual_expenses
    );
    const marginPrev = getProfitMargin(
      prev.annual_revenue,
      prev.annual_expenses
    );
    if (marginThis && marginPrev && marginThis === marginPrev) {
      insights.push({
        type: "profit",
        message: `You've kept a ${marginThis}% profit margin for ${prev.year} and ${selectedMetric.year}`,
        explanation: `Profit margin = (net income / revenue) × 100, same for both years`,
      });
    }
    // Net margin for latest year
    if (marginThis) {
      insights.push({
        type: "profit",
        message: `Your net margin in ${selectedMetric.year} is ${marginThis}%`,
        explanation: `Net margin = (net income / revenue) × 100 for ${selectedMetric.year}`,
      });
    }
    // Risk: net income negative
    const netIncome =
      (selectedMetric.annual_revenue || 0) -
      (selectedMetric.annual_expenses || 0);
    if (netIncome < 0) {
      insights.push({
        type: "risk",
        message: `You recorded a loss in ${selectedMetric.year} — expenses exceeded revenue`,
        explanation: `Net income is negative: expenses > revenue in ${selectedMetric.year}`,
      });
    }
    // Risk: expenses exceed revenue
    if (selectedMetric.annual_expenses > selectedMetric.annual_revenue) {
      insights.push({
        type: "risk",
        message: `Expenses exceeded revenue in ${selectedMetric.year}`,
        explanation: `Annual expenses > annual revenue in ${selectedMetric.year}`,
      });
    }
  }
  // Data gap: VAT deductible expenses missing
  if (
    selectedMetric.vat_registered &&
    !selectedMetric.vat_deductible_expenses
  ) {
    insights.push({
      type: "gap",
      message:
        "No VAT deductible expenses recorded for this year — possible missed claims",
      explanation:
        "VAT registered but no deductible expenses found in your data",
    });
  }
  // Action prompt: Suggest tax calculator
  insights.push({
    type: "action",
    message: "Estimate your tax using the Tax Calculator",
    explanation:
      "Use the Tax Calculator tool for a quick estimate based on your latest data",
  });
  if (insights.length === 0)
    insights.push({
      type: "info",
      message: "No major changes detected in your metrics.",
      explanation: "No significant trends, risks, or data gaps found.",
    });

  // Locked features
  const locked = company?.plan === "free";

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-white via-blue-50 to-accent/10">
        <div className="max-w-4xl w-full p-8 bg-white/90 rounded-xl shadow">
          {/* Greeting skeleton */}
          <div className="mb-6">
            <Skeleton height={32} width={220} radius="xl" className="mb-2" />
            <Skeleton height={18} width={180} radius="xl" />
          </div>
          {/* Summary cards skeleton */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 px-2 mb-8">
            {["💰", "📉", "📈"].map((emoji, i) => (
              <div
                key={i}
                className="rounded-xl shadow border border-blue-100 flex flex-col items-center justify-center py-6 bg-blue-50/40"
              >
                <span className="text-2xl mb-1 animate-pulse">{emoji}</span>
                <Skeleton height={16} width={60} radius="xl" className="mb-2" />
                <Skeleton height={28} width={80} radius="xl" />
                <Skeleton height={12} width={50} radius="xl" className="mt-2" />
              </div>
            ))}
          </div>
          {/* Chart skeleton */}
          <div className="w-full h-64 bg-blue-50/60 rounded-2xl border border-blue-100 flex items-end justify-center mb-8">
            <div className="flex gap-12 w-full h-full items-end justify-center px-8">
              {[1, 2].map((_, i) => (
                <div
                  key={i}
                  className="flex flex-col items-center min-w-[48px]"
                >
                  <Skeleton
                    height={40 + i * 30}
                    width={28}
                    radius="xl"
                    className="mb-2"
                  />
                  <Skeleton height={28 - i * 5} width={28} radius="xl" />
                  <Skeleton
                    height={12}
                    width={36}
                    radius="xl"
                    className="mt-2"
                  />
                </div>
              ))}
            </div>
          </div>
          {/* Reminders/insights skeleton */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 px-2">
            <div className="rounded-xl border border-blue-100 bg-blue-50/40 p-4">
              <Skeleton height={20} width={160} radius="xl" className="mb-2" />
              <Skeleton height={16} width={120} radius="xl" />
            </div>
            <div className="rounded-xl border border-blue-100 bg-blue-50/40 p-4">
              <Skeleton height={20} width={160} radius="xl" className="mb-2" />
              <Skeleton height={16} width={120} radius="xl" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <Box className="min-h-screen bg-gradient-to-br from-white via-blue-50 to-accent/10 py-10 px-2">
      <Card
        shadow="lg"
        radius="xl"
        p={0}
        className="max-w-4xl mx-auto bg-white rounded-xl relative"
        style={{
          borderRadius: 20,
          boxShadow: "0 4px 32px 0 rgba(80, 80, 180, 0.08)",
        }}
      >
        {/* Greeting Section */}
        <Box className="flex flex-col gap-2 px-8 pt-8 pb-2">
          <Title
            order={2}
            className="font-extrabold tracking-tight text-2xl sm:text-3xl text-primary flex items-center gap-2"
          >
            <span>{getGreetingEmoji()}</span> {greeting}, {displayName}
          </Title>
          <div className="flex items-center gap-2 mt-0.5">
            <Text size="md" color="dimmed">
              Here's a quick summary for
            </Text>
            <Select
              data={yearStrings.map((y) => ({ value: y, label: y }))}
              value={selectedYear}
              onChange={setSelectedYear}
              size="xs"
              className="w-20"
              withinPortal
              styles={{
                input: {
                  fontWeight: 700,
                  color: "#4C459D",
                  textAlign: "center",
                },
              }}
              disabled={yearStrings.length === 0}
              placeholder="Year"
            />
          </div>
        </Box>
        <Divider my={0} />
        {/* Summary Cards (3 only) */}
        <Box className="px-8 pt-6 pb-2 grid grid-cols-1 sm:grid-cols-3 gap-6">
          <Card className="rounded-xl shadow border border-blue-100 flex flex-col items-center justify-center py-4">
            <span className="text-2xl mb-1">💰</span>
            <Text size="sm" color="dimmed">
              Revenue
            </Text>
            <Title order={3}>
              {formatCurrency(selectedMetric.annual_revenue)}
            </Title>
          </Card>
          <Card className="rounded-xl shadow border border-blue-100 flex flex-col items-center justify-center py-4">
            <span className="text-2xl mb-1">📉</span>
            <Text size="sm" color="dimmed">
              Expenses
            </Text>
            <Title order={3}>
              {formatCurrency(selectedMetric.annual_expenses)}
            </Title>
          </Card>
          <Card
            className={`rounded-xl shadow border flex flex-col items-center justify-center py-4 ${
              netIncomePositive
                ? "border-green-200 bg-green-50"
                : "border-red-200 bg-red-50"
            }`}
          >
            <span className="text-2xl mb-1">📈</span>
            <Text size="sm" color={netIncomePositive ? "green" : "red"}>
              Net Income
            </Text>
            <Title order={3} color={netIncomePositive ? "green" : "red"}>
              {formatCurrency(netIncome)}
            </Title>
            <Text
              size="xs"
              color={netIncomePositive ? "green" : "red"}
              className="mt-1"
            >
              Margin: {profitMargin !== null ? `${profitMargin}%` : "-"}
            </Text>
          </Card>
        </Box>
        <Divider my={0} />
        {/* Revenue vs Expenses Chart (refined, improved axis, spacing, colors) */}
        <Box className="px-8 pt-6 pb-2">
          <Group align="center" justify="space-between" className="mb-2">
            <Title order={4} className="text-primary">
              Revenue vs Expenses (Last 5 Years)
            </Title>
          </Group>
          {last5.length < 2 ? (
            <div className="text-center text-gray-400 py-8">
              Add at least 2 years of data to see trends.
            </div>
          ) : (
            <div
              ref={chartRef}
              className="w-full h-64 flex items-end justify-center bg-white rounded-lg border border-blue-100 relative overflow-visible shadow-soft"
              style={{ minHeight: 260, position: "relative", paddingLeft: 56 }}
            >
              {/* Y-axis with TZS label */}
              <div
                className="absolute left-0 top-0 bottom-0 flex flex-col justify-between h-full z-10"
                style={{ width: 56 }}
              >
                <div className="flex flex-col h-full justify-between">
                  {yTicks
                    .slice()
                    .reverse()
                    .map((tick, i) => (
                      <div
                        key={i}
                        className="flex items-center h-1/5"
                        style={{ height: "20%" }}
                      >
                        <span className="text-xs text-muted min-w-[40px] text-right inline-block font-semibold tracking-tight">
                          {formatYAxisTick(tick)}
                        </span>
                        <div className="w-3 h-px border-t border-dashed border-gray-200/60 ml-2" />
                      </div>
                    ))}
                </div>
                <span className="text-xs text-muted mt-1 ml-6 font-semibold">
                  TZS
                </span>
              </div>
              {/* Soft gridlines */}
              <div className="absolute left-0 top-0 w-full h-full z-0 pointer-events-none">
                {yTicks.slice(1, -1).map((_, i) => (
                  <div
                    key={i}
                    className="absolute left-0 w-full border-t border-dashed border-gray-200/40"
                    style={{ top: `${((i + 1) / (yTicks.length - 1)) * 100}%` }}
                  />
                ))}
              </div>
              {/* Grouped Bars */}
              <div className="flex-1 flex items-end justify-center gap-10 h-full relative z-20 pb-6">
                {years.map((year, i) => {
                  const revHeight = (revenues[i] / maxValue) * 90;
                  const expHeight = (expenses[i] / maxValue) * 90;
                  const hasData = revenues[i] > 0 || expenses[i] > 0;
                  return (
                    <div
                      key={year}
                      className="flex flex-col items-center relative min-w-[56px]"
                    >
                      <div className="flex flex-row items-end gap-2 h-48">
                        {/* Revenue Bar */}
                        <motion.div
                          layout
                          initial={{ height: 0 }}
                          animate={{ height: hasData ? `${revHeight}%` : 12 }}
                          transition={{ duration: 0.7, type: "spring" }}
                          className={`w-6 rounded bg-primary shadow-sm cursor-pointer transition-all duration-200 ${
                            !hasData ? "opacity-30" : ""
                          }`}
                          style={{
                            minHeight: 8,
                            marginBottom: 0,
                            position: "relative",
                          }}
                          onMouseEnter={() =>
                            setHoveredBar({
                              year,
                              type: "revenue",
                              value: revenues[i],
                              expenses: expenses[i],
                            })
                          }
                          onMouseLeave={() => setHoveredBar(null)}
                        />
                        {/* Expenses Bar */}
                        <motion.div
                          layout
                          initial={{ height: 0 }}
                          animate={{ height: hasData ? `${expHeight}%` : 12 }}
                          transition={{
                            duration: 0.7,
                            type: "spring",
                            delay: 0.1,
                          }}
                          className={`w-6 rounded bg-info shadow-sm cursor-pointer transition-all duration-200 ${
                            !hasData ? "opacity-30" : ""
                          }`}
                          style={{
                            minHeight: 8,
                            marginBottom: 0,
                            position: "relative",
                          }}
                          onMouseEnter={() =>
                            setHoveredBar({
                              year,
                              type: "expenses",
                              value: expenses[i],
                              revenue: revenues[i],
                            })
                          }
                          onMouseLeave={() => setHoveredBar(null)}
                        />
                      </div>
                      <div className="h-4" />{" "}
                      {/* Spacing between bars and year label */}
                      <Text
                        size="sm"
                        className="mt-2 font-semibold text-secondary"
                      >
                        {year}
                      </Text>
                      {/* Data missing tag */}
                      {!hasData && (
                        <span className="text-xs text-muted mt-1">
                          Data missing
                        </span>
                      )}
                      {/* Tooltip */}
                      <AnimatePresence>
                        {hoveredBar && hoveredBar.year === year && (
                          <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 10 }}
                            transition={{ duration: 0.2 }}
                            className="absolute -top-28 left-1/2 -translate-x-1/2 z-30 bg-white border border-blue-100 rounded-lg shadow-lg px-6 py-3 text-xs text-gray-700 pointer-events-none min-w-[200px] max-w-[260px]"
                          >
                            <div className="font-bold text-primary mb-1 text-base">
                              {year}
                            </div>
                            <div className="mb-1">
                              <span className="font-semibold text-primary">
                                Revenue:
                              </span>{" "}
                              <span className="font-bold text-primary">
                                {formatCurrency(revenues[i])}
                              </span>
                            </div>
                            <div className="mb-1">
                              <span className="font-semibold text-info">
                                Expenses:
                              </span>{" "}
                              <span className="font-bold text-info">
                                {formatCurrency(expenses[i])}
                              </span>
                            </div>
                            <div>
                              <span className="font-semibold text-success">
                                Net:
                              </span>{" "}
                              <span
                                className={
                                  revenues[i] - expenses[i] >= 0
                                    ? "text-success font-bold"
                                    : "text-danger font-bold"
                                }
                              >
                                {formatCurrency(revenues[i] - expenses[i])}
                              </span>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })}
              </div>
              {/* Legend (small, subtle, unified) */}
              <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-5 z-30 items-center">
                <div className="flex items-center gap-1">
                  <span className="inline-block w-3 h-3 rounded-full bg-primary border border-primary/30" />
                  <span className="text-xs text-primary font-medium">
                    Revenue
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="inline-block w-3 h-3 rounded-full bg-info border border-info/30" />
                  <span className="text-xs text-info font-medium">
                    Expenses
                  </span>
                </div>
              </div>
            </div>
          )}
        </Box>
        <Divider my={0} />
        {/* Upcoming Tax Reminders */}
        <Box className="px-8 pt-6 pb-2">
          <Title order={4} className="mb-2 text-primary">
            Upcoming Tax Reminders
          </Title>
          {reminders.length === 0 ? (
            <Text size="sm" color="dimmed">
              Add payroll or tax status to see reminders
            </Text>
          ) : (
            <Group spacing={16}>
              {reminders.map((r, i) => (
                <Badge key={i} color="yellow" size="lg" leftSection={r.icon}>
                  {r.label}
                </Badge>
              ))}
            </Group>
          )}
        </Box>
        <Divider my={0} />
        {/* Smart Insights */}
        <Box className="px-8 pt-6 pb-2">
          <Title order={4} className="mb-2 text-primary">
            Smart Insights
          </Title>
          <Card className="bg-gradient-to-br from-blue-50 via-white to-accent/10 border border-blue-100 rounded-xl shadow p-4">
            <div className="flex flex-col gap-3">
              {insights.slice(0, 3).map((insight, i) => (
                <div
                  key={i}
                  className={`flex items-start gap-3 border-l-4 pl-3 py-2 rounded bg-white/80 ${
                    insight.type === "trend"
                      ? "border-info"
                      : insight.type === "profit"
                      ? "border-green-400"
                      : insight.type === "gap"
                      ? "border-yellow-400"
                      : insight.type === "risk"
                      ? "border-red-400"
                      : insight.type === "action"
                      ? "border-indigo-400"
                      : "border-blue-100"
                  }`}
                >
                  <span className="mt-1">
                    {insight.type === "trend" && (
                      <IconTrendingUp className="text-blue-400" size={20} />
                    )}
                    {insight.type === "profit" && (
                      <IconCalculator className="text-green-500" size={20} />
                    )}
                    {insight.type === "gap" && (
                      <IconBulb className="text-yellow-500" size={20} />
                    )}
                    {insight.type === "risk" && (
                      <IconAlertTriangle className="text-red-500" size={20} />
                    )}
                    {insight.type === "action" && (
                      <IconBulb className="text-indigo-500" size={20} />
                    )}
                    {insight.type === "info" && (
                      <IconBulb className="text-blue-400" size={20} />
                    )}
                  </span>
                  <div className="flex-1">
                    <span className="font-semibold text-primary/90">
                      {insight.message}
                    </span>
                    {insight.explanation && (
                      <Tooltip label={insight.explanation} withArrow>
                        <IconInfoCircle
                          className="inline ml-2 text-gray-400 cursor-pointer"
                          size={16}
                        />
                      </Tooltip>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </Box>
        {/* Optional CTA Row */}
        <Box className="px-8 pt-4 pb-2 flex flex-col sm:flex-row gap-4 items-center justify-between">
          <Button
            leftSection={<span className="text-xl">📚</span>}
            variant="light"
            color="blue"
            size="md"
            className="font-semibold flex-1"
            onClick={() => router.push("/tax-corner/tax-info")}
            style={{ minWidth: 0 }}
          >
            Tax Info: See your tax obligations
          </Button>
          <Button
            leftSection={<span className="text-xl">🤖</span>}
            variant="light"
            color="indigo"
            size="md"
            className="font-semibold flex-1"
            onClick={() => router.push("/tax-corner/tax-ai")}
            style={{ minWidth: 0 }}
          >
            Tax Chat: Ask AI about your taxes
          </Button>
        </Box>
        <Divider my={0} />
        {/* Locked Features */}
        <Box className="px-8 pt-6 pb-8 grid grid-cols-1 sm:grid-cols-3 gap-6">
          {[
            {
              label: "Receipts",
              icon: <IconReceipt2 size={32} />,
              desc: "Unlock Receipts to issue invoices",
            },
            {
              label: "Expenses",
              icon: <IconFileText size={32} />,
              desc: "Unlock Expenses to track spending",
            },
            {
              label: "Reports",
              icon: <IconReport size={32} />,
              desc: "Unlock Reports for analytics",
            },
          ].map((feature) => (
            <Card
              key={feature.label}
              className="rounded-xl shadow border border-blue-100 flex flex-col items-center justify-center py-8 relative overflow-hidden"
            >
              {locked && (
                <div
                  className="absolute inset-0 bg-white/80 flex flex-col items-center justify-center z-10"
                  style={{ backdropFilter: "blur(2px)" }}
                >
                  <IconLock className="w-10 h-10 text-gray-400 mb-2" />
                  <Text className="text-gray-700 font-semibold mb-2">
                    Locked
                  </Text>
                  <Button
                    size="xs"
                    color="yellow"
                    variant="light"
                    onClick={() => router.push("/billing")}
                  >
                    {feature.desc}
                  </Button>
                </div>
              )}
              {feature.icon}
              <Title order={5} className="text-primary mb-1">
                {feature.label}
              </Title>
              <Text size="sm" color="dimmed">
                {feature.desc}
              </Text>
            </Card>
          ))}
        </Box>
      </Card>
    </Box>
  );
}
