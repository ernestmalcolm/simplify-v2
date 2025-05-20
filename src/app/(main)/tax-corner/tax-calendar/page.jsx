"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function TaxCalendarPage() {
  const [plan, setPlan] = useState(null);
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
    }
    fetchPlan();
  }, []);
  return (
    <div className="max-w-3xl mx-auto bg-white/80 rounded-xl shadow p-8">
      <h1 className="text-2xl sm:text-3xl font-bold text-primary mb-4">
        Tax Calendar
      </h1>
      <p className="text-secondary text-lg mb-2">
        Your company's personalized tax deadlines and events will appear here.
      </p>
      <p className="text-muted">
        (This page will show a calendar of tax events and reminders for your
        company.)
      </p>
    </div>
  );
}
