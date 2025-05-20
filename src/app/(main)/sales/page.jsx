"use client";
import { useState, useEffect } from "react";
import { Skeleton } from "@mantine/core";
import FeatureLockOverlay from "@/components/ui/FeatureLockOverlay";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";

export default function SalesPage() {
  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  useEffect(() => {
    async function fetchPlan() {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;
      const { data } = await supabase
        .from("companies")
        .select("plan")
        .eq("user_id", user.id)
        .single();
      setPlan(data?.plan || "free");
      setLoading(false);
    }
    fetchPlan();
  }, []);
  if (loading || plan === null) {
    return (
      <div className="max-w-3xl mx-auto bg-white/80 rounded-xl shadow p-8 mt-8">
        <Skeleton height={32} width={180} radius="xl" className="mb-4" />
        <Skeleton height={20} width={220} radius="xl" className="mb-2" />
        <Skeleton height={16} width={180} radius="xl" className="mb-2" />
        <Skeleton height={16} width={160} radius="xl" />
      </div>
    );
  }
  return (
    <FeatureLockOverlay
      requiredPlan="pro"
      currentPlan={plan}
      customMessage={
        "This feature is available in Pro and above. Upgrade to unlock issuing receipts, tracking expenses, and viewing reports."
      }
    >
      <div className="max-w-3xl mx-auto bg-white/80 rounded-xl shadow p-8 mt-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-primary mb-4">
          Sales
        </h1>
        <p className="text-secondary text-lg mb-2">
          Your sales data and tools will appear here.
        </p>
        <p className="text-muted">
          (This page will show sales records, analytics, and management
          features.)
        </p>
      </div>
    </FeatureLockOverlay>
  );
}
