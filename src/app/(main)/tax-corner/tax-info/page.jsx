"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { IconCheck, IconAlertCircle } from "@tabler/icons-react";
import Link from "next/link";
import { useRef } from "react";

const TAX_TYPES = [
  {
    key: "income-tax",
    title: "Income Tax",
    icon: "💰",
    summary: "Annual tax on company profits or personal income.",
    compliance: (data) =>
      data.tin
        ? `TIN: ${data.tin}. Income tax must be filed annually by 30th June.`
        : null,
    requirements: [
      "Register with TRA and obtain a TIN.",
      "File annual returns by 30th June.",
    ],
    deadline: "30th June (annually)",
    cta: { label: "Learn More", href: "/tax-info/income-tax" },
    always: true,
    requiredFields: ["tin"],
  },
  {
    key: "vat",
    title: "Value Added Tax (VAT)",
    icon: "🧾",
    summary: "Tax on goods and services for VAT-registered companies.",
    compliance: (data) =>
      data.vat_registered
        ? `VAT registered. File monthly VAT returns by the 20th.`
        : null,
    requirements: [
      "Register for VAT if annual turnover exceeds threshold.",
      "File monthly VAT returns by the 20th.",
    ],
    deadline: "20th (monthly)",
    cta: { label: "Learn More", href: "/tax-info/vat" },
    always: false,
    requiredFields: ["vat_registered"],
    isApplicable: (data) => !!data.vat_registered,
  },
  {
    key: "paye",
    title: "PAYE - Pay As You Earn",
    icon: "👥",
    summary: "Payroll tax for companies with employees.",
    compliance: (data) =>
      data.employee_count > 0
        ? `You have ${data.employee_count} employees. PAYE must be filed monthly by the 7th.`
        : null,
    requirements: [
      "Register as an employer with TRA.",
      "File monthly PAYE returns by the 7th.",
    ],
    deadline: "7th (monthly)",
    cta: { label: "Learn More", href: "/tax-info/paye" },
    always: false,
    requiredFields: ["employee_count"],
    isApplicable: (data) => Number(data.employee_count) > 0,
  },
  {
    key: "sdl",
    title: "SDL - Skills Development Levy",
    icon: "🎓",
    summary: "Levy for employers with more than 10 employees.",
    compliance: (data) =>
      data.employee_count > 10
        ? `You have ${data.employee_count} employees. SDL must be filed monthly by the 7th.`
        : null,
    requirements: [
      "Register as an employer with TRA.",
      "File monthly SDL returns by the 7th.",
    ],
    deadline: "7th (monthly)",
    cta: { label: "Learn More", href: "/tax-info/sdl" },
    always: false,
    requiredFields: ["employee_count"],
    isApplicable: (data) => Number(data.employee_count) > 10,
  },
  {
    key: "withholding-tax",
    title: "WHT - Withholding Tax",
    icon: "🏦",
    summary: "Tax withheld on certain payments (e.g. rent, dividends).",
    compliance: (data) =>
      data.withholding_obligations
        ? `Withholding obligations active. WHT must be filed monthly by the 7th.`
        : null,
    requirements: [
      "Register with TRA for WHT obligations.",
      "File monthly WHT returns by the 7th.",
    ],
    deadline: "7th (monthly)",
    cta: { label: "Learn More", href: "/tax-info/withholding-tax" },
    always: false,
    requiredFields: ["withholding_obligations"],
    isApplicable: (data) => !!data.withholding_obligations,
  },
  {
    key: "provisional-tax",
    title: "Provisional Tax",
    icon: "📅",
    summary:
      "Quarterly tax for provisional taxpayers or high-revenue companies.",
    compliance: (data) =>
      data.provisional_taxpayer || Number(data.annual_revenue) > 200_000_000
        ? `Provisional tax applies. Quarterly payments required.`
        : null,
    requirements: [
      "Register as a provisional taxpayer if applicable.",
      "Make quarterly payments (Sept, Dec, Mar, Jun).",
    ],
    deadline: "Quarterly (Sept, Dec, Mar, Jun)",
    cta: { label: "Learn More", href: "/tax-info/provisional-tax" },
    always: false,
    requiredFields: ["provisional_taxpayer", "annual_revenue"],
    isApplicable: (data) =>
      !!data.provisional_taxpayer || Number(data.annual_revenue) > 200_000_000,
  },
];

// Detailed info for each tax type (from mockTaxInfo)
const TAX_DETAILS = {
  vat: {
    title: "Value Added Tax (VAT)",
    sections: [
      {
        heading: "Overview",
        content:
          "VAT is a consumption tax levied on the value added to goods and services at each stage of production and distribution.",
      },
      {
        heading: "Who Must Comply",
        content:
          "Businesses with annual turnover exceeding TZS 200 million, registered with TRA, and holding a valid TIN number.",
      },
      {
        heading: "Registration Requirements",
        content:
          "- Annual turnover exceeding TZS 200 million.\n- Business must be registered with TRA.\n- Valid TIN number required.",
      },
      {
        heading: "Tax Rates",
        content:
          "- Standard rate: 18%\n- Zero rate: 0%\n- Exempt supplies: No VAT charged.",
      },
      {
        heading: "Filing Deadlines",
        content:
          "- Monthly VAT returns due by the 20th of the following month.\n- Electronic filing mandatory.",
      },
      {
        heading: "Penalties",
        content:
          "- Late filing: TZS 100,000\n- Late payment: 2% per month\n- Incorrect returns: Up to 100% of tax due.",
      },
      {
        heading: "Exemptions",
        content:
          "Certain goods and services are exempt from VAT as per TRA guidelines.",
      },
      {
        heading: "Required Forms",
        content:
          "VAT registration form, monthly VAT return form (available on TRA portal).",
      },
      {
        heading: "Useful Links",
        content:
          "- [TRA VAT Guide](https://www.tra.go.tz/index.php/vat)\n- [TRA eFiling Portal](https://ots.tra.go.tz/)",
      },
    ],
  },
  paye: {
    title: "Pay As You Earn (PAYE)",
    sections: [
      {
        heading: "Overview",
        content:
          "PAYE is a system of income tax withholding from employees' salaries.",
      },
      {
        heading: "Who Must Comply",
        content: "All employers paying salaries to employees in Tanzania.",
      },
      {
        heading: "Registration Requirements",
        content:
          "- Register as an employer with TRA.\n- Obtain TIN for the business.",
      },
      {
        heading: "Tax Rates",
        content:
          "- Progressive rates from 0% to 30% based on monthly income.\n- Includes allowances and benefits.",
      },
      {
        heading: "Filing Deadlines",
        content:
          "- Monthly returns and payment due by 7th of the following month.\n- Annual reconciliation by 31st March.",
      },
      {
        heading: "Penalties",
        content:
          "- Late filing/payment: Penalties and interest as per TRA.\n- Incorrect returns: Up to 100% of tax due.",
      },
      {
        heading: "Exemptions",
        content: "Certain income types may be exempt as per TRA.",
      },
      {
        heading: "Required Forms",
        content:
          "PAYE registration and monthly return forms (available on TRA portal).",
      },
      {
        heading: "Useful Links",
        content:
          "- [TRA PAYE Guide](https://www.tra.go.tz/index.php/paye)\n- [TRA eFiling Portal](https://ots.tra.go.tz/)",
      },
    ],
  },
  sdl: {
    title: "Skills Development Levy (SDL)",
    sections: [
      {
        heading: "Overview",
        content:
          "SDL is a levy paid by employers to support skills development in Tanzania.",
      },
      {
        heading: "Who Must Comply",
        content: "All employers with at least 4 employees.",
      },
      {
        heading: "Registration Requirements",
        content: "- Register as an employer with TRA.\n- Obtain TIN.",
      },
      { heading: "Tax Rates", content: "- 4.5% of gross salaries/wages." },
      {
        heading: "Filing Deadlines",
        content:
          "- Monthly returns and payment due by 7th of the following month.",
      },
      {
        heading: "Penalties",
        content: "- Late payment: Penalties and interest as per TRA.",
      },
      {
        heading: "Exemptions",
        content: "Employers with less than 4 employees are exempt.",
      },
      {
        heading: "Required Forms",
        content: "SDL return forms (available on TRA portal).",
      },
      {
        heading: "Useful Links",
        content: "- [TRA SDL Guide](https://www.tra.go.tz/index.php/sdl)",
      },
    ],
  },
  "income-tax": {
    title: "Income Tax",
    sections: [
      {
        heading: "Overview",
        content:
          "Income tax is levied on individuals and entities earning income in Tanzania.",
      },
      {
        heading: "Who Must Comply",
        content:
          "Individuals, companies, partnerships, and trusts with taxable income.",
      },
      {
        heading: "Registration Requirements",
        content: "- Register with TRA.\n- Obtain TIN.",
      },
      {
        heading: "Tax Rates",
        content:
          "- Individuals: Progressive rates up to 30%.\n- Companies: 30%.",
      },
      {
        heading: "Filing Deadlines",
        content: "- Annual returns due by 30th June.",
      },
      {
        heading: "Penalties",
        content: "- Late filing/payment: Penalties and interest as per TRA.",
      },
      {
        heading: "Exemptions",
        content: "Certain income types may be exempt as per TRA.",
      },
      {
        heading: "Required Forms",
        content: "Income tax return forms (available on TRA portal).",
      },
      {
        heading: "Useful Links",
        content:
          "- [TRA Income Tax Guide](https://www.tra.go.tz/index.php/income-tax)",
      },
    ],
  },
  "withholding-tax": {
    title: "Withholding Tax",
    sections: [
      {
        heading: "Overview",
        content: "Withholding tax is deducted at source on specified payments.",
      },
      {
        heading: "Who Must Comply",
        content:
          "Payers of specified income (e.g., interest, dividends, rent).",
      },
      {
        heading: "Registration Requirements",
        content: "- Register with TRA.\n- Obtain TIN.",
      },
      { heading: "Tax Rates", content: "- Varies by payment type (5%–15%)." },
      {
        heading: "Filing Deadlines",
        content: "- Monthly returns due by 7th of the following month.",
      },
      {
        heading: "Penalties",
        content: "- Late filing/payment: Penalties and interest as per TRA.",
      },
      {
        heading: "Exemptions",
        content: "Some payments may be exempt as per TRA.",
      },
      {
        heading: "Required Forms",
        content: "Withholding tax return forms (available on TRA portal).",
      },
      {
        heading: "Useful Links",
        content:
          "- [TRA Withholding Tax Guide](https://www.tra.go.tz/index.php/withholding-tax)",
      },
    ],
  },
  "provisional-tax": {
    title: "Provisional Tax",
    sections: [
      {
        heading: "Overview",
        content:
          "Provisional tax is paid in advance based on estimated annual income.",
      },
      {
        heading: "Who Must Comply",
        content:
          "Taxpayers with income not subject to PAYE or withholding tax.",
      },
      {
        heading: "Registration Requirements",
        content: "- Register with TRA.\n- Obtain TIN.",
      },
      { heading: "Tax Rates", content: "- Based on estimated annual income." },
      {
        heading: "Filing Deadlines",
        content:
          "- Quarterly payments due in September, December, March, and June.",
      },
      {
        heading: "Penalties",
        content: "- Late payment: Penalties and interest as per TRA.",
      },
      {
        heading: "Exemptions",
        content: "Some taxpayers may be exempt as per TRA.",
      },
      {
        heading: "Required Forms",
        content: "Provisional tax return forms (available on TRA portal).",
      },
      {
        heading: "Useful Links",
        content:
          "- [TRA Provisional Tax Guide](https://www.tra.go.tz/index.php/provisional-tax)",
      },
    ],
  },
};

function getMissingFields(data, fields) {
  return fields.filter(
    (f) => data[f] === undefined || data[f] === null || data[f] === ""
  );
}

function renderSectionContent(content) {
  // If content contains markdown links, render them as clickable blue links
  // Simple regex for [text](url)
  const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
  const parts = [];
  let lastIndex = 0;
  let match;
  while ((match = linkRegex.exec(content))) {
    if (match.index > lastIndex) {
      parts.push(content.slice(lastIndex, match.index));
    }
    parts.push(
      <a
        key={match[2] + match.index}
        href={match[2]}
        target="_blank"
        rel="noopener noreferrer"
        className="text-info underline hover:text-blue-700"
      >
        {match[1]}
      </a>
    );
    lastIndex = match.index + match[0].length;
  }
  if (lastIndex < content.length) {
    parts.push(content.slice(lastIndex));
  }
  return parts.length > 0
    ? parts.map((p, i) => <span key={i}>{p}</span>)
    : content;
}

function TaxDetailModal({ open, onClose, taxKey }) {
  if (!open || !taxKey) return null;
  const detail = TAX_DETAILS[taxKey];
  if (!detail) return null;
  // Close modal on overlay click
  function handleOverlayClick(e) {
    if (e.target === e.currentTarget) {
      onClose();
    }
  }
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/30"
      onClick={handleOverlayClick}
    >
      <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full p-6 relative animate-fade-in">
        <button
          className="absolute top-3 right-3 text-gray-400 hover:text-primary text-xl"
          onClick={onClose}
          aria-label="Close"
        >
          ×
        </button>
        <h2 className="text-2xl font-bold text-primary mb-4 flex items-center gap-2">
          {detail.title}
        </h2>
        <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
          {detail.sections.map((section, idx) => (
            <div key={idx}>
              <div className="font-semibold text-primary mb-1 flex items-center gap-1">
                {getSectionIcon(section.heading)}
                {section.heading}
              </div>
              <div className="text-gray-700 text-sm whitespace-pre-line">
                {renderSectionContent(section.content)}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function getSectionIcon(heading) {
  const iconClass = "text-accent text-lg md:text-xl mr-1.5";
  switch (heading) {
    case "Overview":
      return <span className={iconClass}>📄</span>;
    case "Who Must Comply":
      return <span className={iconClass}>👥</span>;
    case "Registration Requirements":
      return <span className={iconClass}>📝</span>;
    case "Tax Rates":
      return <span className={iconClass}>💰</span>;
    case "Filing Deadlines":
      return <span className={iconClass}>⏰</span>;
    case "Penalties":
      return <span className={iconClass}>⚠️</span>;
    case "Exemptions":
      return <span className={iconClass}>🚫</span>;
    case "Required Forms":
      return <span className={iconClass}>📑</span>;
    case "Useful Links":
      return <span className={iconClass}>🔗</span>;
    default:
      return null;
  }
}

export default function TaxInfoPage() {
  const [company, setCompany] = useState(null);
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedTaxKey, setSelectedTaxKey] = useState(null);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      setError(null);
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();
      if (!user || userError) {
        setError("Not logged in");
        setLoading(false);
        return;
      }
      // Fetch company profile
      const { data: companyData, error: companyError } = await supabase
        .from("companies")
        .select("id, name, tin, vat_registered, plan")
        .eq("user_id", user.id)
        .single();
      if (!companyData || companyError) {
        setError("Company profile not found");
        setLoading(false);
        return;
      }
      setCompany(companyData);
      // Fetch latest metrics
      const { data: metricsData, error: metricsError } = await supabase
        .from("company_financial_metrics")
        .select("*")
        .eq("company_id", companyData.id)
        .order("year", { ascending: false })
        .limit(1);
      if (metricsError) {
        setError("Could not load company metrics");
        setLoading(false);
        return;
      }
      setMetrics(metricsData && metricsData[0] ? metricsData[0] : {});
      setLoading(false);
    }
    fetchData();
  }, []);

  const data = { ...company, ...metrics };

  // Collect missing required fields for any applicable tax type
  const missingFields = TAX_TYPES.flatMap((tax) =>
    getMissingFields(data, tax.requiredFields || [])
  );
  const uniqueMissingFields = [...new Set(missingFields)];

  return (
    <div className="max-w-4xl mx-auto py-10 px-4">
      <h1 className="text-2xl sm:text-3xl font-bold text-primary mb-4 flex items-center gap-2">
        <span>📚</span> Tax Info
      </h1>
      <p className="text-secondary text-lg mb-4">
        Personalized tax information for your company.
      </p>
      {loading && (
        <div className="flex items-center gap-2 text-blue-500">
          <span className="animate-spin">🔄</span> Loading your company data...
        </div>
      )}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 mb-4 flex items-center gap-2">
          <IconAlertCircle size={20} /> {error}
        </div>
      )}
      {!loading && !error && uniqueMissingFields.length > 0 && (
        <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 rounded-lg px-4 py-3 mb-4 flex items-center gap-2">
          <IconAlertCircle size={20} />
          Some required company info is missing:{" "}
          {uniqueMissingFields.join(", ")}. Please update your company profile
          and metrics for full tax guidance.
        </div>
      )}
      <TaxDetailModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        taxKey={selectedTaxKey}
      />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        {TAX_TYPES.map((tax) => {
          const applicable =
            tax.always || (tax.isApplicable ? tax.isApplicable(data) : false);
          const missing = getMissingFields(data, tax.requiredFields || []);
          return (
            <div
              key={tax.key}
              className={`relative bg-white/90 border rounded-2xl shadow-soft px-6 py-5 flex flex-col min-h-[180px] transition-all duration-200 ${
                applicable && missing.length === 0
                  ? "border-blue-200"
                  : "border-gray-200 opacity-60"
              }`}
            >
              <div className="flex items-center gap-3 mb-2">
                <span className="text-2xl">{tax.icon}</span>
                <h2 className="text-lg font-bold text-primary flex-1">
                  {tax.title}
                </h2>
                {!applicable && (
                  <span className="bg-gray-100 text-gray-500 text-xs px-2 py-1 rounded font-semibold ml-2">
                    Not applicable
                  </span>
                )}
              </div>
              <div className="text-secondary text-sm mb-2">{tax.summary}</div>
              {applicable && missing.length === 0 && (
                <div className="text-blue-900 text-sm mb-2">
                  <IconCheck
                    size={16}
                    className="inline-block mr-1 text-green-500 align-text-bottom"
                  />
                  {tax.compliance(data)}
                </div>
              )}
              {applicable && missing.length > 0 && (
                <div className="text-yellow-800 text-xs mb-2 flex items-center gap-1">
                  <IconAlertCircle size={14} className="text-yellow-600" />
                  Missing: {missing.join(", ")}
                </div>
              )}
              <ul className="text-xs text-gray-700 mb-2 list-disc list-inside">
                {tax.requirements.map((req, i) => (
                  <li key={i}>{req}</li>
                ))}
              </ul>
              <div className="flex items-center justify-between mt-auto">
                <span className="text-xs text-gray-500">
                  Deadline: {tax.deadline}
                </span>
                {tax.cta && (
                  <button
                    className="text-info text-xs font-semibold hover:underline ml-2"
                    onClick={() => {
                      setSelectedTaxKey(tax.key);
                      setModalOpen(true);
                    }}
                  >
                    {tax.cta.label} →
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
