"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import Navbar from "@/components/Navbar";
import { Button, TextInput, Select } from "@mantine/core";
import { notifications } from "@mantine/notifications";

export default function OnboardingPage() {
  const [companyName, setCompanyName] = useState("");
  const [tin, setTin] = useState("");
  const [directorName, setDirectorName] = useState("");
  const [categories, setCategories] = useState([]);
  const [category, setCategory] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Fetch business categories from Supabase
    async function fetchCategories() {
      const { data, error } = await supabase
        .from("business_categories")
        .select("id, name")
        .order("name");
      if (!error && data) {
        setCategories(data.map((cat) => ({ value: cat.id, label: cat.name })));
      }
    }
    fetchCategories();
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!companyName || !tin || !category || !directorName) {
      notifications.show({
        color: "red",
        title: "Missing Fields",
        message: "All fields are required.",
      });
      return;
    }
    if (!/^\d{9}$/.test(tin)) {
      notifications.show({
        color: "red",
        title: "Invalid TIN",
        message: "TIN must be exactly 9 digits.",
      });
      return;
    }
    setLoading(true);
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      notifications.show({
        color: "red",
        title: "Not logged in",
        message: "You must be logged in.",
      });
      setLoading(false);
      return;
    }
    const { error: insertError } = await supabase.from("companies").insert({
      user_id: user.id,
      name: companyName,
      tin,
      business_category_id: category,
      director_name: directorName,
      plan: "free",
    });
    setLoading(false);
    if (insertError) {
      notifications.show({
        color: "red",
        title: "Error",
        message: insertError.message,
      });
      return;
    }
    notifications.show({
      color: "green",
      title: "Success",
      message: "Company created successfully",
    });
    setTimeout(() => {
      router.replace("/dashboard");
    }, 1200);
  }

  return (
    <>
      <Navbar />
      <div className="min-h-[80vh] flex flex-col justify-center items-center px-2 py-8 bg-gradient-to-br from-white via-blue-50 to-accent/10">
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-md bg-white p-8 sm:p-10 rounded-2xl shadow-xl border border-blue-100 flex flex-col items-center"
        >
          <h1 className="text-3xl sm:text-4xl font-extrabold text-primary mb-6 text-center">
            Company Onboarding
          </h1>
          <TextInput
            label="Company Name"
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
            required
            className="w-full mb-4"
          />
          <TextInput
            label="TIN (9 digits)"
            value={tin}
            onChange={(e) =>
              setTin(e.target.value.replace(/\D/g, "").slice(0, 9))
            }
            required
            className="w-full mb-4"
            inputMode="numeric"
          />
          <Select
            label="Business Category"
            data={categories}
            value={category}
            onChange={setCategory}
            required
            className="w-full mb-4"
            placeholder="Select category"
            searchable
          />
          <TextInput
            label="Company Director Name"
            value={directorName}
            onChange={(e) => setDirectorName(e.target.value)}
            required
            className="w-full mb-4"
          />
          <Button
            type="submit"
            loading={loading}
            fullWidth
            className="mb-4 btn btn-primary"
          >
            Save & Continue
          </Button>
        </form>
      </div>
    </>
  );
}
