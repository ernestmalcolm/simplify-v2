"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Skeleton,
  Button,
  Table,
  Modal,
  TextInput,
  NumberInput,
  Checkbox,
  Group,
  Tooltip,
  Loader,
  Title,
  Box,
  Select,
  Card,
  Divider,
  Stack,
  Text,
  Badge,
  ActionIcon,
  SimpleGrid,
  Accordion,
  Collapse,
} from "@mantine/core";
import {
  IconPlus,
  IconEdit,
  IconTrash,
  IconCheck,
  IconAlertCircle,
  IconChartBar,
  IconId,
  IconInfoCircle,
  IconCurrencyTaka,
  IconCurrencyDollar,
  IconReceipt,
  IconPercentage,
  IconUser,
} from "@tabler/icons-react";
import { supabase } from "@/lib/supabaseClient";
import { notifications } from "@mantine/notifications";

const currentYear = new Date().getFullYear();
const years = Array.from({ length: 5 }, (_, i) => currentYear - i).reverse();

const EMPTY_METRIC = {
  year: "",
  annual_revenue: "",
  annual_expenses: "",
  taxable_income: "",
  exempt_income: "",
  relieved_income: "",
  foreign_income: "",
  monthly_payroll: "",
  employee_count: "",
  vat_deductible_expenses: "",
  has_nssf_registration: false,
  withholding_obligations: false,
  provisional_taxpayer: false,
};

// --- Helper: Currency Formatting ---
function formatCurrency(value) {
  if (value == null || value === "") return "-";
  return "TZS " + Number(value).toLocaleString();
}

// --- Metric Card Value Display ---
function Metric({ label, value, icon }) {
  return (
    <Group align="center" gap={10}>
      {icon && <span style={{ color: "#4C459D", fontSize: 20 }}>{icon}</span>}
      <div>
        <Text size="sm" color="#6b7280" fw={500} lh={1.1}>
          {label}
        </Text>
        <Text
          size="lg"
          color="#111827"
          fw={700}
          lh={1.2}
          style={{ fontSize: 20 }}
        >
          {value}
        </Text>
      </div>
    </Group>
  );
}

// --- Metrics Table Component ---
function MetricsTable({ metrics, columns, onEdit, onDelete, deleting }) {
  return (
    <Table.ScrollContainer minWidth={900}>
      <Table striped highlightOnHover withBorder withColumnBorders>
        <thead>
          <tr>
            {columns.map((col) => (
              <th key={col.key}>
                {col.tooltip ? (
                  <Tooltip label={col.tooltip} withArrow>
                    <span>{col.label}</span>
                  </Tooltip>
                ) : (
                  <span>{col.label}</span>
                )}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {metrics.length === 0 ? (
            <tr>
              <td colSpan={columns.length}>
                <Stack align="center" py={32}>
                  <IconChartBar size={56} color="#d0ebff" />
                  <Text size="lg" c="dimmed">
                    No metrics found. Start by adding your first year of data.
                  </Text>
                </Stack>
              </td>
            </tr>
          ) : (
            metrics.map((m) => (
              <tr key={m.id}>
                <td>{m.year}</td>
                <td>{formatCurrency(m.annual_revenue)}</td>
                <td>{formatCurrency(m.annual_expenses)}</td>
                <td>
                  {typeof m.annual_revenue === "number" &&
                  typeof m.annual_expenses === "number"
                    ? formatCurrency(m.annual_revenue - m.annual_expenses)
                    : "-"}
                </td>
                <td>{formatCurrency(m.vat_deductible_expenses)}</td>
                <td>{formatCurrency(m.taxable_income)}</td>
                <td>{formatCurrency(m.exempt_income)}</td>
                <td>
                  <Group gap={4}>
                    <Tooltip label="Edit" withArrow>
                      <ActionIcon
                        variant="light"
                        style={{ color: "#4C459D", background: "#ede9fe" }}
                        onClick={() => onEdit(m)}
                      >
                        <IconEdit size={18} />
                      </ActionIcon>
                    </Tooltip>
                    <Tooltip label="Delete" withArrow>
                      <ActionIcon
                        variant="light"
                        style={{ color: "#EF4444", background: "#fee2e2" }}
                        loading={deleting}
                        onClick={() => onDelete(m)}
                      >
                        <IconTrash size={18} />
                      </ActionIcon>
                    </Tooltip>
                  </Group>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </Table>
    </Table.ScrollContainer>
  );
}

// --- Metrics Modal Component ---
function MetricsModal({
  opened,
  onClose,
  onSave,
  form,
  setForm,
  years,
  metrics,
  editingMetric,
  saving,
  error,
}) {
  // Live Net Income
  const netIncome =
    (Number(form.annual_revenue) || 0) - (Number(form.annual_expenses) || 0);
  // Filtered years for select
  const yearOptions = years
    .filter((y) =>
      editingMetric
        ? String(y) === String(editingMetric.year) ||
          !metrics.some((m) => String(m.year) === String(y))
        : !metrics.some((m) => String(m.year) === String(y))
    )
    .map((y) => ({ value: String(y), label: String(y) }));
  return (
    <Modal
      opened={opened}
      onClose={onClose}
      centered
      size="lg"
      radius="lg"
      title={
        <Group>
          <IconChartBar size={22} />
          <Text fw={700}>
            {editingMetric ? `Edit ${form.year}` : "Add Year"}
          </Text>
        </Group>
      }
    >
      <form
        onSubmit={(e) => {
          e.preventDefault();
          onSave();
        }}
      >
        <Stack gap="md">
          <Group grow>
            <Select
              label="Year"
              name="year"
              data={yearOptions}
              value={form.year ? String(form.year) : ""}
              onChange={(val) => setForm((prev) => ({ ...prev, year: val }))}
              required
              disabled={!!editingMetric}
              placeholder="Select year"
            />
            <Tooltip label="Total company revenue for the year" withArrow>
              <NumberInput
                label="Annual Revenue"
                name="annual_revenue"
                value={form.annual_revenue}
                onChange={(val) =>
                  setForm((prev) => ({ ...prev, annual_revenue: val }))
                }
                min={0}
                step={1000}
                thousandSeparator
                required
                icon={<IconCurrencyTaka size={16} />}
                parser={(v) => v.replace(/\D/g, "")}
                formatter={(v) => formatCurrency(v)}
              />
            </Tooltip>
          </Group>
          <Group grow align="flex-end">
            <Tooltip label="Total business expenses for the year" withArrow>
              <NumberInput
                label="Annual Expenses"
                name="annual_expenses"
                value={form.annual_expenses}
                onChange={(val) =>
                  setForm((prev) => ({ ...prev, annual_expenses: val }))
                }
                min={0}
                step={1000}
                thousandSeparator
                icon={<IconCurrencyTaka size={16} />}
                parser={(v) => v.replace(/\D/g, "")}
                formatter={(v) => formatCurrency(v)}
              />
            </Tooltip>
            <Tooltip
              label="Portion of expenses that qualify for VAT claims"
              withArrow
            >
              <NumberInput
                label={
                  <span>
                    VAT Deductible Expenses{" "}
                    <Badge color="yellow" size="sm">
                      VAT Credit
                    </Badge>
                  </span>
                }
                name="vat_deductible_expenses"
                value={form.vat_deductible_expenses}
                onChange={(val) =>
                  setForm((prev) => ({ ...prev, vat_deductible_expenses: val }))
                }
                min={0}
                step={1000}
                thousandSeparator
                icon={<IconCurrencyTaka size={16} />}
                parser={(v) => v.replace(/\D/g, "")}
                formatter={(v) => formatCurrency(v)}
              />
            </Tooltip>
          </Group>
          <Divider label="Summary" labelPosition="center" />
          <Group>
            <Badge color="teal" size="lg">
              Net Income: {formatCurrency(netIncome)}
            </Badge>
          </Group>
          <Group grow>
            <Tooltip label="Taxable income for the year" withArrow>
              <NumberInput
                label="Taxable Income"
                name="taxable_income"
                value={form.taxable_income}
                onChange={(val) =>
                  setForm((prev) => ({ ...prev, taxable_income: val }))
                }
                min={0}
                step={1000}
                thousandSeparator
                parser={(v) => v.replace(/\D/g, "")}
                formatter={(v) => formatCurrency(v)}
              />
            </Tooltip>
            <Tooltip label="Income exempt from tax" withArrow>
              <NumberInput
                label="Exempt Income"
                name="exempt_income"
                value={form.exempt_income}
                onChange={(val) =>
                  setForm((prev) => ({ ...prev, exempt_income: val }))
                }
                min={0}
                step={1000}
                thousandSeparator
                parser={(v) => v.replace(/\D/g, "")}
                formatter={(v) => formatCurrency(v)}
              />
            </Tooltip>
          </Group>
          <Group grow>
            <Tooltip label="Income relieved from tax" withArrow>
              <NumberInput
                label="Relieved Income"
                name="relieved_income"
                value={form.relieved_income}
                onChange={(val) =>
                  setForm((prev) => ({ ...prev, relieved_income: val }))
                }
                min={0}
                step={1000}
                thousandSeparator
                parser={(v) => v.replace(/\D/g, "")}
                formatter={(v) => formatCurrency(v)}
              />
            </Tooltip>
            <Tooltip label="Foreign income for the year" withArrow>
              <NumberInput
                label="Foreign Income"
                name="foreign_income"
                value={form.foreign_income}
                onChange={(val) =>
                  setForm((prev) => ({ ...prev, foreign_income: val }))
                }
                min={0}
                step={1000}
                thousandSeparator
                parser={(v) => v.replace(/\D/g, "")}
                formatter={(v) => formatCurrency(v)}
              />
            </Tooltip>
          </Group>
          <Group grow>
            <Tooltip label="Total monthly payroll" withArrow>
              <NumberInput
                label="Monthly Payroll"
                name="monthly_payroll"
                value={form.monthly_payroll}
                onChange={(val) =>
                  setForm((prev) => ({ ...prev, monthly_payroll: val }))
                }
                min={0}
                step={100}
                thousandSeparator
                parser={(v) => v.replace(/\D/g, "")}
                formatter={(v) => formatCurrency(v)}
              />
            </Tooltip>
            <Tooltip label="Number of employees" withArrow>
              <NumberInput
                label="Employee Count"
                name="employee_count"
                value={form.employee_count}
                onChange={(val) =>
                  setForm((prev) => ({ ...prev, employee_count: val }))
                }
                min={0}
                step={1}
                thousandSeparator
                parser={(v) => v.replace(/\D/g, "")}
              />
            </Tooltip>
          </Group>
          <Group>
            <Tooltip label="Is your company registered with NSSF?" withArrow>
              <Checkbox
                label="NSSF Registration"
                name="has_nssf_registration"
                checked={!!form.has_nssf_registration}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    has_nssf_registration: e.target.checked,
                  }))
                }
              />
            </Tooltip>
            <Tooltip label="Withholding tax obligations?" withArrow>
              <Checkbox
                label="Withholding Obligations"
                name="withholding_obligations"
                checked={!!form.withholding_obligations}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    withholding_obligations: e.target.checked,
                  }))
                }
              />
            </Tooltip>
            <Tooltip label="Are you a provisional taxpayer?" withArrow>
              <Checkbox
                label="Provisional Taxpayer"
                name="provisional_taxpayer"
                checked={!!form.provisional_taxpayer}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    provisional_taxpayer: e.target.checked,
                  }))
                }
              />
            </Tooltip>
          </Group>
          <Group position="right" mt="md">
            <Button
              type="submit"
              color="green"
              loading={saving}
              leftSection={<IconCheck size={16} />}
              className="hover:bg-green-600 focus:ring-2 focus:ring-green-200 bg-green-500 text-white h-11 font-semibold text-[15px] px-5 py-2 rounded-md shadow-md"
            >
              Save
            </Button>
            <Button variant="outline" onClick={onClose} color="gray" mt={2}>
              Cancel
            </Button>
          </Group>
        </Stack>
      </form>
    </Modal>
  );
}

export default function CompanyMetricsPage() {
  const [metrics, setMetrics] = useState([]);
  const [companyId, setCompanyId] = useState(null);
  const [plan, setPlan] = useState("free");
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingMetric, setEditingMetric] = useState(null);
  const [form, setForm] = useState(EMPTY_METRIC);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [openYear, setOpenYear] = useState(null);
  const router = useRouter();

  // Fetch company and metrics
  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();
      if (!user || userError) {
        notifications.show({
          color: "red",
          title: "Not logged in",
          message: "You must be logged in to view company metrics.",
          icon: <IconAlertCircle />,
        });
        setLoading(false);
        return;
      }
      // Get company
      const { data: company, error: companyError } = await supabase
        .from("companies")
        .select("id, plan")
        .eq("user_id", user.id)
        .single();
      if (!company || companyError) {
        notifications.show({
          color: "red",
          title: "Company not found",
          message: "Could not find your company profile.",
          icon: <IconAlertCircle />,
        });
        setLoading(false);
        return;
      }
      setCompanyId(company.id);
      setPlan(company.plan || "free");
      // Get metrics
      const { data: metricsData, error: metricsError } = await supabase
        .from("company_financial_metrics")
        .select("*")
        .eq("company_id", company.id)
        .order("year", { ascending: false });
      if (metricsError) {
        notifications.show({
          color: "red",
          title: "Failed to load metrics",
          message: metricsError.message || "Could not load company metrics.",
          icon: <IconAlertCircle />,
        });
        setLoading(false);
        return;
      }
      setMetrics(metricsData || []);
      setLoading(false);
    }
    fetchData();
  }, []);

  // Modal open for add/edit
  const openModal = (metric = null) => {
    setEditingMetric(metric);
    setForm(metric ? { ...metric } : { ...EMPTY_METRIC });
    setModalOpen(true);
  };

  // Modal close
  const closeModal = () => {
    setModalOpen(false);
    setEditingMetric(null);
    setForm({ ...EMPTY_METRIC });
  };

  // Form change handler
  const handleFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // Save metric (add or update)
  const handleSave = async () => {
    setSaving(true);
    // Validation
    if (!form.year) {
      notifications.show({
        color: "red",
        title: "Year required",
        message: "Please select a year.",
        icon: <IconAlertCircle />,
      });
      setSaving(false);
      return;
    }
    if (
      metrics.some((m) => String(m.year) === String(form.year)) &&
      (!editingMetric || String(editingMetric.year) !== String(form.year))
    ) {
      notifications.show({
        color: "red",
        title: "Duplicate Year",
        message: "This year already has metrics. Please choose another year.",
        icon: <IconAlertCircle />,
      });
      setSaving(false);
      return;
    }
    if (!companyId) {
      notifications.show({
        color: "red",
        title: "Company not found",
        message: "Could not find your company profile.",
        icon: <IconAlertCircle />,
      });
      setSaving(false);
      return;
    }
    // Prepare data
    const parseNumber = (val) => {
      if (val === undefined || val === null || val === "") return null;
      const n = Number(val);
      return isNaN(n) ? null : n;
    };
    const payload = {
      year: Number(form.year),
      annual_revenue: parseNumber(form.annual_revenue),
      annual_expenses: parseNumber(form.annual_expenses),
      taxable_income: parseNumber(form.taxable_income),
      exempt_income: parseNumber(form.exempt_income),
      relieved_income: parseNumber(form.relieved_income),
      foreign_income: parseNumber(form.foreign_income),
      monthly_payroll: parseNumber(form.monthly_payroll),
      employee_count: parseNumber(form.employee_count),
      vat_deductible_expenses: parseNumber(form.vat_deductible_expenses),
      has_nssf_registration: !!form.has_nssf_registration,
      withholding_obligations: !!form.withholding_obligations,
      provisional_taxpayer: !!form.provisional_taxpayer,
      company_id: companyId,
    };
    // Insert or update
    let result;
    if (editingMetric) {
      result = await supabase
        .from("company_financial_metrics")
        .update(payload)
        .eq("id", editingMetric.id);
    } else {
      if (metrics.length >= 5 && plan === "free") {
        notifications.show({
          color: "red",
          title: "Limit reached",
          message: "Maximum 5 years allowed for Free plan.",
          icon: <IconAlertCircle />,
        });
        setSaving(false);
        return;
      }
      result = await supabase
        .from("company_financial_metrics")
        .insert([payload]);
    }
    if (result.error) {
      notifications.show({
        color: "red",
        title: "Error",
        message: result.error.message,
        icon: <IconAlertCircle />,
      });
      setSaving(false);
      return;
    }
    notifications.show({
      color: "green",
      title: "Success",
      message: "Saved successfully",
      icon: <IconCheck />,
    });
    setModalOpen(false);
    // Refresh metrics
    const { data: metricsData } = await supabase
      .from("company_financial_metrics")
      .select("*")
      .eq("company_id", companyId)
      .order("year", { ascending: false });
    setMetrics(metricsData || []);
    setSaving(false);
  };

  // Delete metric
  const handleDelete = async (metric) => {
    setDeleting(true);
    const { error: delError } = await supabase
      .from("company_financial_metrics")
      .delete()
      .eq("id", metric.id);
    if (delError) {
      notifications.show({
        color: "red",
        title: "Error",
        message: delError.message,
        icon: <IconAlertCircle />,
      });
      setDeleting(false);
      return;
    }
    notifications.show({
      color: "green",
      title: "Success",
      message: "Deleted successfully",
      icon: <IconCheck />,
    });
    // Refresh metrics
    const { data: metricsData } = await supabase
      .from("company_financial_metrics")
      .select("*")
      .eq("company_id", companyId)
      .order("year", { ascending: false });
    setMetrics(metricsData || []);
    setDeleting(false);
  };

  // Table columns
  const columns = [
    { label: "Year", key: "year" },
    { label: "Annual Revenue", key: "annual_revenue" },
    { label: "Annual Expenses", key: "annual_expenses" },
    { label: "Net Income", key: "net_income" },
    { label: "VAT Deductible Expenses", key: "vat_deductible_expenses" },
    { label: "Taxable Income", key: "taxable_income" },
    { label: "Exempt Income", key: "exempt_income" },
    { label: "Actions", key: "actions" },
  ];

  // Loading state
  if (loading) {
    return (
      <Card className="max-w-3xl mx-auto mt-12 bg-gradient-to-br from-white via-blue-50 to-accent/10 border border-blue-100 rounded-xl shadow-lg p-8">
        <div className="flex items-center gap-4 mb-6">
          <Skeleton height={48} width={48} radius="xl" />
          <div className="flex-1">
            <Skeleton height={28} width={220} radius="md" className="mb-2" />
            <Skeleton height={18} width={140} radius="md" />
          </div>
        </div>
        <Skeleton height={20} width="100%" radius="md" className="mb-4" />
        {[1, 2, 3].map((i) => (
          <Skeleton
            key={i}
            height={48}
            width="100%"
            radius="md"
            className="mb-3"
          />
        ))}
        <div className="flex gap-2 mt-6">
          <Skeleton height={36} width={120} radius="md" />
          <Skeleton height={36} width={120} radius="md" />
        </div>
      </Card>
    );
  }

  return (
    <Box className="min-h-screen bg-gradient-to-br from-white via-blue-50 to-accent/10 py-10 px-2">
      <Card
        shadow="lg"
        radius="xl"
        p={0}
        className="max-w-3xl mx-auto bg-white rounded-xl relative"
        style={{
          borderRadius: 20,
          boxShadow: "0 4px 32px 0 rgba(80, 80, 180, 0.08)",
        }}
      >
        {/* Header Section */}
        <Card.Section
          withBorder
          inheritPadding={false}
          style={{
            background: "#fff",
            borderRadius: "20px 20px 0 0",
            padding: "32px 32px 12px 32px",
          }}
        >
          <Group justify="space-between" align="center" style={{ padding: 0 }}>
            <Group gap={10}>
              <IconChartBar size={32} color="#4C459D" />
              <Title
                order={2}
                className="font-extrabold tracking-tight text-2xl sm:text-3xl"
                style={{ color: "#4C459D" }}
              >
                Company Metrics
              </Title>
            </Group>
          </Group>
          <Text size="md" color="dimmed" className="mt-4 mb-2">
            Save your company's key financial data for up to 5 years. This helps
            you track growth, prepare reports, and unlock more features.
          </Text>
        </Card.Section>
        <Box
          className="px-8 py-7"
          style={{ position: "relative", padding: "28px 32px 32px 32px" }}
        >
          {metrics.length === 0 ? (
            <Stack align="center" py={32}>
              <IconChartBar size={56} color="#d0ebff" />
              <Text size="lg" c="dimmed">
                No metrics found. Start by adding your first year of data.
              </Text>
              <div className="flex justify-end mb-6">
                <Button
                  type="button"
                  color="primary"
                  variant="filled"
                  radius="md"
                  size="md"
                  leftSection={<IconPlus size={18} color="#fff" />}
                  onClick={() => openModal()}
                  style={{
                    fontWeight: 600,
                    fontSize: 16,
                    boxShadow: "0 2px 8px 0 rgba(80, 80, 180, 0.10)",
                  }}
                  className="bg-primary text-white hover:bg-primary/90 focus:ring-2 focus:ring-primary/30 h-11 px-6"
                >
                  Add Year
                </Button>
              </div>
            </Stack>
          ) : (
            <div className="flex justify-end mb-6">
              <Button
                type="button"
                color="primary"
                variant="filled"
                radius="md"
                size="md"
                leftSection={<IconPlus size={18} color="#fff" />}
                onClick={() => openModal()}
                style={{
                  fontWeight: 600,
                  fontSize: 16,
                  boxShadow: "0 2px 8px 0 rgba(80, 80, 180, 0.10)",
                }}
                className="bg-primary text-white hover:bg-primary/90 focus:ring-2 focus:ring-primary/30 h-11 px-6"
              >
                Add Year
              </Button>
            </div>
          )}
          {metrics.map((m) => (
            <Card
              key={m.id}
              className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden mb-6"
              style={{ borderRadius: 20 }}
            >
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-2">
                <Badge
                  size="lg"
                  color="primary"
                  radius="md"
                  style={{
                    fontSize: 18,
                    background: "#4C459D",
                    color: "#fff",
                    fontWeight: 700,
                    letterSpacing: 1,
                  }}
                >
                  {m.year}
                </Badge>
                <div className="flex flex-1 flex-wrap gap-8 md:gap-12 items-center">
                  <Metric
                    label="Net Income"
                    value={formatCurrency(
                      (m.annual_revenue || 0) - (m.annual_expenses || 0)
                    )}
                    icon={<IconChartBar size={18} />}
                  />
                  <Metric
                    label="Revenue"
                    value={formatCurrency(m.annual_revenue)}
                    icon={<IconCurrencyDollar size={18} />}
                  />
                  <Metric
                    label="Expenses"
                    value={formatCurrency(m.annual_expenses)}
                    icon={<IconReceipt size={18} />}
                  />
                </div>
                <div className="flex gap-2 items-center">
                  <Tooltip label="Edit" withArrow>
                    <ActionIcon
                      variant="light"
                      style={{ color: "#4C459D", background: "#ede9fe" }}
                      onClick={() => openModal(m)}
                    >
                      <IconEdit size={18} />
                    </ActionIcon>
                  </Tooltip>
                  <Tooltip label="Delete" withArrow>
                    <ActionIcon
                      variant="light"
                      style={{ color: "#EF4444", background: "#fee2e2" }}
                      loading={deleting}
                      onClick={() => handleDelete(m)}
                    >
                      <IconTrash size={18} />
                    </ActionIcon>
                  </Tooltip>
                  <ActionIcon
                    variant="subtle"
                    style={{ color: "#4C459D" }}
                    onClick={() =>
                      setOpenYear(openYear === m.year ? null : m.year)
                    }
                    aria-label={openYear === m.year ? "Collapse" : "Expand"}
                  >
                    <svg width="20" height="20" fill="none" viewBox="0 0 24 24">
                      <path
                        d="M6 9l6 6 6-6"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </ActionIcon>
                </div>
              </div>
              <Collapse in={openYear === m.year} transitionDuration={200}>
                <Divider my="md" color="#e5e7eb" />
                <SimpleGrid
                  cols={2}
                  spacing="lg"
                  breakpoints={[{ maxWidth: "sm", cols: 1 }]}
                >
                  <Metric
                    label="VAT Deductible Expenses"
                    value={formatCurrency(m.vat_deductible_expenses)}
                    icon={<IconPercentage size={20} />}
                  />
                  <Metric
                    label="Taxable Income"
                    value={formatCurrency(m.taxable_income)}
                    icon={<IconCurrencyTaka size={20} />}
                  />
                  <Metric
                    label="Exempt Income"
                    value={formatCurrency(m.exempt_income)}
                    icon={<IconCurrencyTaka size={20} />}
                  />
                  <Metric
                    label="Relieved Income"
                    value={formatCurrency(m.relieved_income)}
                    icon={<IconCurrencyTaka size={20} />}
                  />
                  <Metric
                    label="Foreign Income"
                    value={formatCurrency(m.foreign_income)}
                    icon={<IconCurrencyTaka size={20} />}
                  />
                  <Metric
                    label="Monthly Payroll"
                    value={formatCurrency(m.monthly_payroll)}
                    icon={<IconCurrencyTaka size={20} />}
                  />
                  <Metric
                    label="Employee Count"
                    value={m.employee_count ?? "-"}
                    icon={<IconUser size={20} />}
                  />
                  <Group align="center" gap={10}>
                    <Text size="sm" color="#6b7280" fw={500} lh={1.1}>
                      NSSF Registration
                    </Text>
                    <Text
                      size="lg"
                      color="#111827"
                      fw={700}
                      lh={1.2}
                      style={{ fontSize: 20 }}
                    >
                      {m.has_nssf_registration ? "Yes" : "No"}
                    </Text>
                  </Group>
                  <Group align="center" gap={10}>
                    <Text size="sm" color="#6b7280" fw={500} lh={1.1}>
                      Withholding Obligations
                    </Text>
                    <Text
                      size="lg"
                      color="#111827"
                      fw={700}
                      lh={1.2}
                      style={{ fontSize: 20 }}
                    >
                      {m.withholding_obligations ? "Yes" : "No"}
                    </Text>
                  </Group>
                  <Group align="center" gap={10}>
                    <Text size="sm" color="#6b7280" fw={500} lh={1.1}>
                      Provisional Taxpayer
                    </Text>
                    <Text
                      size="lg"
                      color="#111827"
                      fw={700}
                      lh={1.2}
                      style={{ fontSize: 20 }}
                    >
                      {m.provisional_taxpayer ? "Yes" : "No"}
                    </Text>
                  </Group>
                </SimpleGrid>
              </Collapse>
            </Card>
          ))}
          <MetricsModal
            opened={modalOpen}
            onClose={closeModal}
            onSave={handleSave}
            form={form}
            setForm={setForm}
            years={years}
            metrics={metrics}
            editingMetric={editingMetric}
            saving={saving}
            error={null}
          />
        </Box>
      </Card>
    </Box>
  );
}
