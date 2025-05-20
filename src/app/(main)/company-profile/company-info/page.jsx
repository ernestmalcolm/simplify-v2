"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Skeleton,
  Button,
  TextInput,
  Checkbox,
  Group,
  Notification,
  Tooltip,
  Card,
  Divider,
  Title,
  Text,
  Box,
  Select,
  Loader,
} from "@mantine/core";
import { supabase } from "@/lib/supabaseClient";
import {
  IconId,
  IconBuildingSkyscraper,
  IconChartBar,
  IconUser,
  IconId as IconId2,
  IconMapPin,
  IconBriefcase,
  IconCheck,
  IconEdit,
} from "@tabler/icons-react";
import { notifications } from "@mantine/notifications";

const FIELDS = [
  "name",
  "business_category_id",
  "region",
  "director_name",
  "vat_registered",
  "vat_number",
  "tin",
  "plan",
  "created_at",
];

export default function CompanyInfoPage() {
  const [company, setCompany] = useState(null);
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [categories, setCategories] = useState([]);
  const [dirty, setDirty] = useState(false);
  const router = useRouter();

  useEffect(() => {
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

  useEffect(() => {
    async function fetchCompany() {
      setLoading(true);
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();
      if (!user || userError) {
        setError("Not logged in");
        setLoading(false);
        return;
      }
      const { data, error: fetchError } = await supabase
        .from("companies")
        .select(FIELDS.join(", "))
        .eq("user_id", user.id)
        .single();
      if (fetchError || !data) {
        setError("Company not found");
        setLoading(false);
        return;
      }
      setCompany(data);
      setLoading(false);
      setDirty(false);
    }
    fetchCompany();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setCompany((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    setDirty(true);
  };

  const handleCategoryChange = (value) => {
    setCompany((prev) => ({ ...prev, business_category_id: value }));
    setDirty(true);
  };

  const handleSave = async () => {
    setSaving(true);
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      notifications.show({
        color: "red",
        title: "Not logged in",
        message: "You must be logged in.",
      });
      setSaving(false);
      return;
    }
    const updateFields = { ...company };
    if (company.plan !== "free") {
      delete updateFields.tin;
    }
    const { error: updateError } = await supabase
      .from("companies")
      .update(updateFields)
      .eq("user_id", user.id);
    if (updateError) {
      notifications.show({
        color: "red",
        title: "Error",
        message: updateError.message,
      });
    } else {
      notifications.show({
        color: "green",
        title: "Success",
        message: "Profile updated successfully",
      });
      setEditing(false);
      setDirty(false);
    }
    setSaving(false);
  };

  if (loading || !company) {
    return (
      <Card className="max-w-2xl mx-auto mt-12 bg-gradient-to-br from-white via-blue-50 to-accent/10 border border-blue-100 rounded-xl shadow-lg p-8">
        <div className="flex items-center gap-4 mb-6">
          <Skeleton height={48} width={48} radius="xl" />
          <div className="flex-1">
            <Skeleton height={28} width={180} radius="md" className="mb-2" />
            <Skeleton height={18} width={120} radius="md" />
          </div>
        </div>
        <Skeleton height={16} width={120} radius="md" className="mb-4" />
        {[1, 2, 3, 4].map((i) => (
          <Skeleton
            key={i}
            height={32}
            width="100%"
            radius="md"
            className="mb-3"
          />
        ))}
        <div className="flex gap-2 mt-6">
          <Skeleton height={36} width={120} radius="md" />
          <Skeleton height={36} width={120} radius="md" />
          <Skeleton height={36} width={160} radius="md" className="ml-auto" />
        </div>
      </Card>
    );
  }

  return (
    <Card
      shadow="lg"
      radius="xl"
      p={0}
      className="max-w-2xl mx-auto mt-12 bg-gradient-to-br from-white via-blue-50 to-accent/10 border border-blue-100 rounded-xl relative"
      style={{
        borderRadius: 20,
        boxShadow: "0 4px 32px 0 rgba(80, 80, 180, 0.08)",
      }}
    >
      {saving && (
        <div
          className="absolute inset-0 bg-white/70 flex items-center justify-center z-30 rounded-xl"
          style={{ backdropFilter: "blur(2px)" }}
        >
          <Loader color="blue" size="lg" />
        </div>
      )}
      <Box className="flex items-center justify-between px-8 pt-8 pb-2">
        <Group spacing={10} align="center">
          <IconId className="w-8 h-8" color="#4C459D" />
          <Title
            order={2}
            className="font-extrabold tracking-tight text-2xl sm:text-3xl text-primary"
          >
            Company Info
          </Title>
        </Group>
      </Box>
      <Divider my={0} />
      <Box className="px-8 pt-4 pb-2">
        <Group spacing={16} align="center">
          <Text size="sm" color="dimmed" className="font-medium">
            Created At:
          </Text>
          <Text size="sm" className="font-semibold">
            {company.created_at
              ? new Date(company.created_at).toLocaleDateString()
              : "-"}
          </Text>
        </Group>
      </Box>
      <Divider my={0} />
      <Box className="px-8 py-7 bg-white/80 rounded-xl shadow-soft">
        <form
          className="space-y-7"
          onSubmit={(e) => {
            e.preventDefault();
            handleSave();
          }}
        >
          <div className="mb-2">
            <span className="block text-base font-semibold text-primary/80 mb-2">
              General Info
            </span>
            <Group spacing={12} align="center">
              <IconBuildingSkyscraper className="w-5 h-5 text-primary" />
              <TextInput
                label={<span className="font-semibold">Company Name</span>}
                name="name"
                value={company.name || ""}
                onChange={handleChange}
                disabled={!editing}
                required
                withAsterisk
                className="flex-1 focus:ring-primary/30"
              />
            </Group>
            <div className="mt-4 space-y-4">
              <Group spacing={12} align="center">
                <IconBriefcase className="w-5 h-5 text-primary" />
                <Select
                  label={<span className="font-semibold">Industry</span>}
                  name="business_category_id"
                  data={categories}
                  value={company.business_category_id || ""}
                  onChange={handleCategoryChange}
                  disabled={!editing}
                  searchable
                  placeholder="Select industry"
                  className="flex-1 focus:ring-primary/30"
                  required
                  withAsterisk
                  size="md"
                />
              </Group>
              <Group spacing={12} align="center">
                <IconMapPin className="w-5 h-5 text-primary" />
                <TextInput
                  label={<span className="font-semibold">Region</span>}
                  name="region"
                  value={company.region || ""}
                  onChange={handleChange}
                  disabled={!editing}
                  className="flex-1 focus:ring-primary/30"
                  size="md"
                />
              </Group>
            </div>
            <Group spacing={12} align="center" className="mt-4">
              <IconUser className="w-5 h-5 text-primary" />
              <TextInput
                label={<span className="font-semibold">Director Name</span>}
                name="director_name"
                value={company.director_name || ""}
                onChange={handleChange}
                disabled={!editing}
                className="flex-1 focus:ring-primary/30"
              />
            </Group>
          </div>
          <Divider my={0} className="my-2 border-blue-100" />
          <div className="mb-2">
            <span className="block text-base font-semibold text-primary/80 mb-2">
              Tax Details
            </span>
            <Group spacing={12} align="center" className="mb-4">
              <IconId className="w-5 h-5 text-primary" />
              <TextInput
                label={<span className="font-semibold">TIN</span>}
                name="tin"
                value={company.tin || ""}
                onChange={handleChange}
                disabled={company.plan !== "free" || !editing}
                description={
                  company.plan !== "free"
                    ? "This TIN is linked to TRA and cannot be changed"
                    : undefined
                }
                className="flex-1 focus:ring-primary/30"
              />
            </Group>
            <Group spacing={12} align="center">
              <Checkbox
                label={<span className="font-semibold">VAT Registered</span>}
                name="vat_registered"
                checked={!!company.vat_registered}
                onChange={handleChange}
                disabled={!editing}
                className="mt-2 focus:ring-primary/30"
                color="indigo"
              />
            </Group>
            {company.vat_registered && (
              <Group spacing={12} align="center" className="mt-2">
                <TextInput
                  label={<span className="font-semibold">VAT Number</span>}
                  name="vat_number"
                  value={company.vat_number || ""}
                  onChange={handleChange}
                  disabled={!editing}
                  icon={<IconId className="w-5 h-5 text-primary" />}
                  className="flex-1 focus:ring-primary/30"
                />
              </Group>
            )}
          </div>
          <Group position="right" mt={30} className="pt-2">
            {!editing && (
              <Button
                type="button"
                variant="filled"
                color="primary"
                onClick={() => {
                  setEditing(true);
                  setDirty(false);
                }}
                leftIcon={<IconEdit size={18} />}
                style={{ fontWeight: 600, fontSize: 16 }}
                className="bg-primary text-white hover:bg-primary/90 focus:ring-2 focus:ring-primary/30 h-11"
              >
                Edit Profile
              </Button>
            )}
            {editing && (
              <Group spacing={10}>
                <Button
                  type="button"
                  variant="outline"
                  color="accent"
                  onClick={() => {
                    setEditing(false);
                    setDirty(false);
                  }}
                  leftIcon={<IconEdit size={18} />}
                  style={{ fontWeight: 600, fontSize: 16 }}
                  className="border-accent text-accent hover:border-accent hover:text-accent focus:ring-2 focus:ring-accent/30 h-11"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  color="green"
                  loading={saving}
                  leftIcon={<IconCheck size={18} />}
                  disabled={!dirty || saving}
                  style={{ fontWeight: 600, fontSize: 16 }}
                  className="hover:bg-green-600 focus:ring-2 focus:ring-green-200 bg-green-500 text-white h-11"
                >
                  Save Changes
                </Button>
              </Group>
            )}
          </Group>
        </form>
      </Box>
    </Card>
  );
}
