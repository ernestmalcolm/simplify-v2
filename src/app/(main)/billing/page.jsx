"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import PlanBadge from "@/components/ui/PlanBadge";
import { Loader, Button, Skeleton } from "@mantine/core";
import {
  IconCheck,
  IconX,
  IconCrown,
  IconRocket,
  IconBadge,
} from "@tabler/icons-react";

const plans = [
  {
    key: "free",
    name: "Free",
    icon: <IconBadge className="w-6 h-6 text-gray-500" />,
    color: "gray",
    includes: [
      "Up to 5 years data history",
      "Basic tax tools (calculator, tips, info, calendar)",
    ],
    locked: [
      "AI tax assistant",
      "Create receipts/invoices",
      "Add sales and expenses",
      "Reporting tools",
      "Compliance reminders",
      "Logo saving",
      "Support",
    ],
  },
  {
    key: "pro",
    name: "Pro",
    icon: <IconRocket className="w-6 h-6 text-blue-600" />,
    color: "blue",
    includes: [
      "Unlimited data history",
      "All tax tools",
      "AI tax assistant",
      "Create receipts/invoices (TRA-ready)",
      "Add basic sales and expenses",
      "Basic compliance reminders (email/SMS)",
      "Basic reporting (totals, tax breakdowns)",
    ],
    locked: [
      "Advanced compliance reports",
      "Advanced reminders",
      "Logo saving",
      "Priority support",
      "TRA troubleshooting tools (resend receipts/Z-reports)",
    ],
  },
  {
    key: "premium",
    name: "Premium",
    icon: <IconCrown className="w-6 h-6 text-yellow-500" />,
    color: "yellow",
    includes: [
      "Everything in Pro",
      "Advanced compliance reports",
      "Advanced compliance reminders",
      "Logo saving on receipts",
      "Priority support",
      "Faster troubleshooting (resending to TRA, fixing failed receipts)",
    ],
    locked: [],
  },
];

export default function BillingPage() {
  const [company, setCompany] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    async function fetchCompany() {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;
      const { data } = await supabase
        .from("companies")
        .select("name, plan")
        .eq("user_id", user.id)
        .single();
      setCompany(data);
      setLoading(false);
    }
    fetchCompany();
  }, []);
  if (loading) {
    return (
      <div className="max-w-5xl mx-auto mt-12 bg-white/90 rounded-xl shadow p-8">
        <div className="flex flex-col items-center mb-8">
          <Skeleton height={36} width={220} className="mb-4" radius="xl" />
          <Skeleton height={24} width={120} className="mb-2" radius="xl" />
        </div>
        <div className="text-center text-secondary text-base mb-8 font-medium">
          <Skeleton height={20} width={260} radius="xl" className="mx-auto" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="flex flex-col items-center rounded-2xl border shadow-md p-6 bg-white/95 mb-4 md:mb-0"
            >
              <Skeleton height={32} width={32} circle className="mb-2 mt-2" />
              <Skeleton height={24} width={100} className="mb-2" radius="xl" />
              <Skeleton height={16} width={120} className="mb-2" radius="xl" />
              <Skeleton height={12} width={160} className="mb-1" radius="xl" />
              <Skeleton height={12} width={140} className="mb-1" radius="xl" />
              <Skeleton height={12} width={120} className="mb-1" radius="xl" />
              <Skeleton height={32} width={100} className="mt-4" radius="xl" />
            </div>
          ))}
        </div>
      </div>
    );
  }
  return (
    <div className="max-w-5xl mx-auto mt-12 bg-white/90 rounded-xl shadow p-8">
      <div className="flex flex-col items-center mb-8">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-primary mb-2 text-center">
          Billing & Plans
        </h1>
        <div className="flex flex-col items-center gap-2">
          <PlanBadge plan={company?.plan} />
          <div className="text-lg font-bold text-primary mt-1">
            {company?.name}
          </div>
        </div>
      </div>
      <div className="text-center text-secondary text-base mb-8 font-medium">
        Choose the plan that fits your business
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
        {plans.map((plan) => {
          const isCurrent = company?.plan === plan.key;
          const isPro = plan.key === "pro";
          return (
            <div
              key={plan.key}
              className={`relative flex flex-col items-center rounded-2xl border shadow-md p-6 bg-white/95 transition-all duration-200
                ${
                  isCurrent
                    ? "border-2 border-primary ring-2 ring-primary/20 scale-105 shadow-lg"
                    : "border-gray-200 hover:shadow-lg hover:scale-[1.03] cursor-pointer"
                }
                ${!isCurrent ? "transition-transform" : ""}
                md:mb-0 mb-4
              `}
              style={{ minHeight: 420 }}
            >
              {isPro && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-sm z-10">
                  Most Popular
                </span>
              )}
              <div className="mb-2 mt-2">{plan.icon}</div>
              <div className="text-xl font-bold mb-1">{plan.name} Plan</div>
              <div className="w-full mt-2">
                <div className="font-semibold text-primary mb-1">Includes:</div>
                <ul className="mb-3">
                  {plan.includes.map((f) => (
                    <li
                      key={f}
                      className="flex items-center gap-2 py-0.5 text-[15px] text-primary"
                    >
                      <IconCheck className="w-4 h-4 text-green-500" /> {f}
                    </li>
                  ))}
                </ul>
                {plan.locked.length > 0 && (
                  <>
                    <div className="font-semibold text-gray-500 mt-2 mb-1">
                      Locked:
                    </div>
                    <ul className="mb-2">
                      {plan.locked.map((f) => (
                        <li
                          key={f}
                          className="flex items-center gap-2 py-0.5 text-[15px] text-gray-400 line-through"
                        >
                          <IconX className="w-4 h-4 text-gray-300" /> {f}
                        </li>
                      ))}
                    </ul>
                  </>
                )}
              </div>
              {isCurrent ? (
                <span className="px-4 py-1 rounded-full bg-primary text-white font-semibold text-sm mt-2">
                  Current Plan
                </span>
              ) : (
                <Button
                  color={plan.color}
                  variant="filled"
                  fullWidth
                  disabled
                  className="mt-2"
                >
                  Upgrade
                </Button>
              )}
            </div>
          );
        })}
      </div>
      <div className="mt-10 text-center text-gray-500 text-sm">
        Payment integration coming soon. For upgrades, please contact support.
      </div>
    </div>
  );
}
