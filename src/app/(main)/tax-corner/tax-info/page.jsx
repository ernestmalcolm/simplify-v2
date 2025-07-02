"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import {
  IconCheck,
  IconAlertCircle,
  IconInfoCircle,
  IconX,
} from "@tabler/icons-react";
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
          "- [TRA WHT Guide](https://www.tra.go.tz/index.php/withholding-tax)\n- [TRA eFiling Portal](https://ots.tra.go.tz/)",
      },
    ],
  },
  "provisional-tax": {
    title: "Provisional Tax",
    sections: [
      {
        heading: "Overview",
        content:
          "Provisional tax is paid in quarterly installments to account for income tax liabilities throughout the year.",
      },
      {
        heading: "Who Must Comply",
        content:
          "Individuals and entities receiving income not subject to final withholding tax, such as business income or rent.",
      },
      {
        heading: "Registration Requirements",
        content:
          "- Must have a TIN.\n- Automatically applicable if you have business or rental income.",
      },
      {
        heading: "Tax Rates",
        content:
          "Calculated based on estimated annual income and paid in four equal installments.",
      },
      {
        heading: "Filing Deadlines",
        content:
          "- Quarterly installments due by: 31st March, 30th June, 30th September, 31st December.",
      },
      {
        heading: "Penalties",
        content:
          "Underestimation of tax by more than 20% can lead to interest charges.",
      },
      {
        heading: "Required Forms",
        content:
          "Provisional assessment forms available on the TRA eFiling portal.",
      },
      {
        heading: "Useful Links",
        content:
          "- [TRA Provisional Tax Info](https://www.tra.go.tz/index.php/provisional-tax)\n- [TRA eFiling Portal](https://ots.tra.go.tz/)",
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

function TaxDetailModal({ open, onClose, taxKey, mainRef }) {
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
  switch (heading.toLowerCase()) {
    case "overview":
      return <IconInfoCircle className="w-6 h-6 text-blue-500" />;
    case "who must comply":
      return <IconCheck className="w-6 h-6 text-green-500" />;
    case "registration requirements":
      return <IconCheck className="w-6 h-6 text-green-500" />;
    case "tax rates":
      return "💰";
    case "filing deadlines":
      return "📅";
    case "penalties":
      return <IconAlertCircle className="w-6 h-6 text-red-500" />;
    case "exemptions":
      return <IconCheck className="w-6 h-6 text-green-500" />;
    case "required forms":
      return "📄";
    case "useful links":
      return "🔗";
    default:
      return "🔹";
  }
}

export default function TaxInfoPage() {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedTax, setSelectedTax] = useState(null);
  const mainRef = useRef(null);

  function handleOpenModal(taxKey) {
    setSelectedTax(taxKey);
    setModalOpen(true);
  }

  function handleCloseModal() {
    setModalOpen(false);
    setSelectedTax(null);
  }

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 md:p-8" ref={mainRef}>
      <div className="text-center mb-10">
        <h1 className="text-3xl sm:text-4xl font-bold text-primary">
          Tanzania Tax Information Hub
        </h1>
        <p className="mt-4 text-lg text-secondary max-w-3xl mx-auto">
          Explore key tax categories to understand your obligations, deadlines,
          and compliance requirements. Click on any tax type to learn more.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {TAX_TYPES.map((tax) => (
          <div
            key={tax.key}
            className="bg-white/80 border border-gray-200/80 rounded-xl shadow-lg p-6 flex flex-col hover:shadow-xl transition-shadow duration-300"
          >
            <div className="flex items-center gap-4 mb-3">
              <span className="text-3xl">{tax.icon}</span>
              <h2 className="text-xl font-bold text-primary">{tax.title}</h2>
            </div>
            <p className="text-secondary mb-4 flex-grow">{tax.summary}</p>
            <p className="text-sm text-gray-500 mb-4">
              <span className="font-semibold">Typical Deadline:</span>{" "}
              {tax.deadline}
            </p>
            <button
              onClick={() => handleOpenModal(tax.key)}
              className="mt-auto w-full bg-primary/10 text-primary font-semibold py-2 px-4 rounded-lg hover:bg-primary/20 transition-colors"
            >
              Learn More
            </button>
          </div>
        ))}
      </div>

      <TaxDetailModal
        open={modalOpen}
        onClose={handleCloseModal}
        taxKey={selectedTax}
        mainRef={mainRef}
      />
    </div>
  );
}
