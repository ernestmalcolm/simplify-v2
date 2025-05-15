"use client";

import { useParams } from "next/navigation";
import ReactMarkdown from "react-markdown";
import Navbar from "@/components/Navbar";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import Link from "next/link";

// Mock data - replace with Supabase fetch
const mockTaxInfo = {
  vat: {
    slug: "vat",
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
          "- [TRA VAT Guide](https://www.tra.go.tz/index.php/vat)\n- [TRA eFiling Portal](https://ots.tra.go.tz/)\n",
      },
    ],
  },
  paye: {
    slug: "paye",
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
          "- [TRA PAYE Guide](https://www.tra.go.tz/index.php/paye)\n- [TRA eFiling Portal](https://ots.tra.go.tz/)\n",
      },
    ],
  },
  sdl: {
    slug: "sdl",
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
    slug: "income-tax",
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
  "corporate-tax": {
    slug: "corporate-tax",
    title: "Corporate Tax",
    sections: [
      {
        heading: "Overview",
        content:
          "Corporate tax is levied on the profits of companies operating in Tanzania.",
      },
      {
        heading: "Who Must Comply",
        content:
          "All resident and non-resident companies with income sourced in Tanzania.",
      },
      {
        heading: "Registration Requirements",
        content: "- Register with TRA.\n- Obtain TIN.",
      },
      { heading: "Tax Rates", content: "- Standard rate: 30%." },
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
        content: "Certain companies may qualify for exemptions.",
      },
      {
        heading: "Required Forms",
        content: "Corporate tax return forms (available on TRA portal).",
      },
      {
        heading: "Useful Links",
        content:
          "- [TRA Corporate Tax Guide](https://www.tra.go.tz/index.php/corporate-tax)",
      },
    ],
  },
  "withholding-tax": {
    slug: "withholding-tax",
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
    slug: "provisional-tax",
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
  "stamp-duty": {
    slug: "stamp-duty",
    title: "Stamp Duty",
    sections: [
      {
        heading: "Overview",
        content: "Stamp duty is a tax on legal documents and transactions.",
      },
      {
        heading: "Who Must Comply",
        content: "Anyone executing dutiable documents in Tanzania.",
      },
      {
        heading: "Registration Requirements",
        content: "- Present documents to TRA for assessment.",
      },
      { heading: "Tax Rates", content: "- Varies by document type." },
      {
        heading: "Filing Deadlines",
        content: "- Pay duty before document execution or registration.",
      },
      {
        heading: "Penalties",
        content: "- Late payment: Penalties as per TRA.",
      },
      {
        heading: "Exemptions",
        content: "Some documents may be exempt as per TRA.",
      },
      {
        heading: "Required Forms",
        content: "Stamp duty forms (available on TRA portal).",
      },
      {
        heading: "Useful Links",
        content:
          "- [TRA Stamp Duty Guide](https://www.tra.go.tz/index.php/stamp-duty)",
      },
    ],
  },
  "excise-duty": {
    slug: "excise-duty",
    title: "Excise Duty",
    sections: [
      {
        heading: "Overview",
        content:
          "Excise duty is levied on specific goods and services manufactured or imported into Tanzania.",
      },
      {
        heading: "Who Must Comply",
        content: "Manufacturers and importers of excisable goods/services.",
      },
      {
        heading: "Registration Requirements",
        content: "- Register with TRA.\n- Obtain TIN.",
      },
      { heading: "Tax Rates", content: "- Varies by product/service." },
      {
        heading: "Filing Deadlines",
        content: "- Monthly returns due by 20th of the following month.",
      },
      {
        heading: "Penalties",
        content: "- Late filing/payment: Penalties and interest as per TRA.",
      },
      {
        heading: "Exemptions",
        content: "Some goods/services may be exempt as per TRA.",
      },
      {
        heading: "Required Forms",
        content: "Excise duty return forms (available on TRA portal).",
      },
      {
        heading: "Useful Links",
        content:
          "- [TRA Excise Duty Guide](https://www.tra.go.tz/index.php/excise-duty)",
      },
    ],
  },
  "tin-registration": {
    slug: "tin-registration",
    title: "TIN Registration",
    sections: [
      {
        heading: "Overview",
        content: "TIN is a unique identifier for taxpayers in Tanzania.",
      },
      {
        heading: "Who Must Comply",
        content:
          "All individuals and entities required to pay tax in Tanzania.",
      },
      {
        heading: "Registration Requirements",
        content:
          "- Complete TIN application form.\n- Submit required documents to TRA.",
      },
      { heading: "Tax Rates", content: "N/A" },
      {
        heading: "Filing Deadlines",
        content: "Apply before commencing taxable activities.",
      },
      {
        heading: "Penalties",
        content: "- Failure to register: Penalties as per TRA.",
      },
      { heading: "Exemptions", content: "N/A" },
      {
        heading: "Required Forms",
        content: "TIN application form (available on TRA portal).",
      },
      {
        heading: "Useful Links",
        content:
          "- [TRA TIN Registration Guide](https://www.tra.go.tz/index.php/tin)",
      },
    ],
  },
};

export default function TaxInfoDetailPage() {
  const { slug } = useParams();
  const taxInfo = mockTaxInfo[slug];

  if (!taxInfo) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen bg-gradient-to-br from-white via-blue-50 to-accent/10 relative overflow-hidden pt-8 pb-16 flex items-center justify-center font-poppins">
          {/* Decorative Shape */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 0.13, scale: 1 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            className="absolute -top-32 -right-32 w-[420px] h-[420px] bg-gradient-to-br from-primary/30 to-accent/20 rounded-full blur-3xl z-0"
          />
          <section className="w-full max-w-2xl mx-auto relative z-10">
            <Link
              href="/tax-info"
              className="inline-block mb-4 text-info hover:underline text-base font-medium"
            >
              ← Back to Tax Info
            </Link>
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: "easeOut" }}
              className="text-4xl md:text-5xl font-extrabold text-primary mb-4 text-center justify-center"
            >
              Tax Information Not Found
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1, ease: "easeOut" }}
              className="text-secondary md:text-lg mb-8 text-center"
            >
              The requested tax information could not be found.
            </motion.p>
          </section>
        </main>
      </>
    );
  }

  // Animated heading in view
  const headingRef = useRef(null);
  const inView = useInView(headingRef, {
    triggerOnce: false,
    margin: "-100px",
  });

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gradient-to-br from-white via-blue-50 to-accent/10 relative overflow-hidden pt-8 pb-16 flex items-center justify-center font-poppins">
        {/* Decorative Shape */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 0.13, scale: 1 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          className="absolute -top-32 -right-32 w-[420px] h-[420px] bg-gradient-to-br from-primary/30 to-accent/20 rounded-full blur-3xl z-0"
        />
        <section className="w-full max-w-2xl mx-auto relative z-10 px-2 xs:px-4 sm:px-8 md:px-12 lg:px-0">
          <Link
            href="/tax-info"
            className="inline-block mb-4 text-info hover:underline text-base font-medium"
          >
            ← Back to Tax Info
          </Link>
          <div ref={headingRef}>
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              transition={{ duration: 0.7, ease: "easeOut" }}
              className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-primary mb-4 text-center justify-center"
            >
              {taxInfo.title}
            </motion.h1>
          </div>
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1, ease: "easeOut" }}
            className="bg-gradient-to-br from-white/90 via-blue-50/80 to-accent/10 rounded-3xl shadow-2xl px-4 sm:px-7 py-6 sm:py-10 md:py-14 md:px-12 mt-2 mb-4 border border-blue-100/60 backdrop-blur-lg"
          >
            {taxInfo.sections
              .filter(
                (section) =>
                  (section.content || "").trim().toLowerCase() !== "n/a"
              )
              .map((section, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.6 }}
                  transition={{
                    duration: 0.5,
                    delay: 0.08 * idx,
                    ease: "easeOut",
                  }}
                  className={
                    `mb-7 last:mb-0 relative` +
                    (idx !== taxInfo.sections.length - 1
                      ? " pb-7 after:content-[''] after:absolute after:left-0 after:right-0 after:bottom-0 after:h-px after:bg-gradient-to-r after:from-blue-100/60 after:via-accent/10 after:to-transparent"
                      : "")
                  }
                >
                  <div className="flex items-center gap-2 mb-2 mt-4 first:mt-0">
                    {getSectionIcon(section.heading)}
                    <h2 className="text-base sm:text-lg md:text-xl font-extrabold text-primary tracking-tight">
                      {section.heading}
                    </h2>
                  </div>
                  {section.heading === "Useful Links" ? (
                    <ul className="pl-1 space-y-2">
                      {section.content
                        .split("\n")
                        .filter(Boolean)
                        .map((line, i) => {
                          const match = line.match(/\[(.*?)\]\((.*?)\)/);
                          if (match) {
                            return (
                              <li key={i}>
                                <a
                                  href={match[2]}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-1 text-info font-semibold hover:underline hover:text-accent transition-colors"
                                >
                                  {match[1]}{" "}
                                </a>
                              </li>
                            );
                          }
                          return <li key={i}>{line.replace(/^- /, "")}</li>;
                        })}
                    </ul>
                  ) : section.content.includes("\n") ? (
                    <ul className="list-none pl-0 space-y-2 border-l-4 border-purple-500/40 ml-1">
                      {section.content
                        .split("\n")
                        .filter(Boolean)
                        .map((line, i) => (
                          <li
                            key={i}
                            className="pl-3 text-sm sm:text-base text-secondary"
                          >
                            {line.replace(/^- /, "")}
                          </li>
                        ))}
                    </ul>
                  ) : (
                    <p className="text-secondary text-sm sm:text-base leading-relaxed">
                      {section.content}
                    </p>
                  )}
                </motion.div>
              ))}
          </motion.div>
        </section>
      </main>
    </>
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
