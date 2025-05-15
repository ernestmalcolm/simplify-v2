"use client";

import Navbar from "@/components/Navbar";
import Calendar from "react-calendar";
import { Popover } from "@headlessui/react";
import { useState, useMemo, useRef } from "react";
import { Modal, Tabs } from "@mantine/core";
import "react-calendar/dist/Calendar.css";
import { motion } from "framer-motion";

// Generate recurring PAYE, SDL, VAT deadlines for every month in 2025
const months = Array.from({ length: 12 }, (_, i) => i + 1);
const recurringEvents = months.flatMap((month) => {
  const y = 2025;
  const mm = month.toString().padStart(2, "0");
  const monthName = new Date(y, month - 1).toLocaleString("default", {
    month: "long",
    year: "numeric",
  });
  return [
    {
      id: `vat-${mm}`,
      title: "VAT Return Due",
      due_date: `${y}-${mm}-20`,
      category: "VAT",
      description: `Monthly VAT return and payment due for ${monthName}. Example: If you collected VAT in ${monthName}, file and pay by this date.`,
    },
    {
      id: `paye-${mm}`,
      title: "PAYE Payment",
      due_date: `${y}-${mm}-07`,
      category: "PAYE",
      description: `PAYE payment for ${monthName} due. Example: Remit employee PAYE deductions for ${monthName} by this date.`,
    },
    {
      id: `sdl-${mm}`,
      title: "SDL Payment",
      due_date: `${y}-${mm}-07`,
      category: "SDL",
      description: `Skills Development Levy payment due for ${monthName}. Example: Employers with 4+ employees must pay SDL for ${monthName} by this date.`,
    },
  ];
});

const mockEvents = [
  ...recurringEvents,
  {
    id: "income-tax",
    title: "Income Tax Return",
    due_date: "2025-06-30",
    category: "Income Tax",
    description:
      "Annual income tax return due for 2024/2025. Example: File your business or personal income tax for the year ending June 2025.",
  },
  {
    id: "withholding-tax-04",
    title: "Withholding Tax Payment",
    due_date: "2025-04-15",
    category: "Withholding Tax",
    description:
      "Withholding tax on payments made in March due. Example: If you paid a consultant, remit 5% withholding tax by this date.",
  },
  {
    id: "provisional-tax",
    title: "Provisional Tax Installment",
    due_date: "2025-09-30",
    category: "Income Tax",
    description:
      "Second installment of provisional income tax due for 2025/2026.",
  },
];

const categoryColors = {
  VAT: "bg-blue-600",
  PAYE: "bg-green-600",
  SDL: "bg-yellow-400",
  "Income Tax": "bg-purple-600",
  "Withholding Tax": "bg-pink-500",
};

const categoryEmojis = {
  VAT: "🔵",
  PAYE: "🟢",
  SDL: "🟡",
  "Income Tax": "🟣",
  "Withholding Tax": "��",
};

// Hex color mapping for border and dot colors
const categoryHexColors = {
  VAT: "#2563eb", // blue-600
  PAYE: "#16a34a", // green-600
  SDL: "#facc15", // yellow-400
  "Income Tax": "#7c3aed", // purple-600
  "Withholding Tax": "#ec4899", // pink-500
};

function getEventsForDate(date) {
  const d = date.toLocaleDateString("en-CA"); // 'YYYY-MM-DD' in local time
  return mockEvents.filter((e) => e.due_date === d);
}

function getUpcomingEvents(events, fromDate = new Date()) {
  return events
    .filter((e) => new Date(e.due_date) >= fromDate)
    .sort((a, b) => new Date(a.due_date) - new Date(b.due_date))
    .slice(0, 5);
}

export default function CalendarPage() {
  const [selectedDate, setSelectedDate] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const calendarRef = useRef();
  const [tab, setTab] = useState("calendar");

  // Find the next event's month for initial view
  const today = new Date();
  const nextEvent = mockEvents.find((e) => new Date(e.due_date) >= today);
  const [calendarViewDate, setCalendarViewDate] = useState(
    nextEvent ? new Date(nextEvent.due_date) : today
  );

  // Memoize upcoming events for performance
  const upcomingEvents = useMemo(() => getUpcomingEvents(mockEvents), []);

  // Get all events for the selected date
  const selectedEvents = selectedDate ? getEventsForDate(selectedDate) : [];

  return (
    <>
      <Navbar />
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="max-w-7xl mx-auto mt-10 px-2 min-h-[80vh]"
      >
        {/* Title and description always at the top */}
        <div className="mb-4 px-2 sm:px-6 lg:px-0">
          <h1 className="text-2xl sm:text-3xl font-bold text-primary mb-2 flex items-center gap-2">
            <span className="text-2xl sm:text-3xl">📅</span>
            Tax Calendar
          </h1>
          <p className="text-secondary text-sm sm:text-base mb-6 max-w-2xl">
            View all important Tanzanian tax deadlines for VAT, PAYE, SDL, and
            more. Click a date to see details, and use the upcoming deadlines
            list to stay compliant and organized.
          </p>
        </div>
        {/* Tabs for <1024px, side-by-side for >=1024px */}
        <div className="block lg:hidden">
          <Tabs value={tab} onChange={setTab}>
            <Tabs.List grow className="border-b border-blue-100 bg-transparent">
              <Tabs.Tab
                value="calendar"
                className={({ selected }) =>
                  `px-1 sm:px-4 py-2 text-base sm:text-lg transition-all duration-200 font-semibold
                  ${
                    selected
                      ? "text-accent border-b-2 border-accent"
                      : "text-primary border-b-2 border-transparent hover:text-accent"
                  }`
                }
              >
                Calendar
              </Tabs.Tab>
              <Tabs.Tab
                value="deadlines"
                className={({ selected }) =>
                  `px-1 sm:px-4 py-2 text-base sm:text-lg transition-all duration-200 font-semibold
                  ${
                    selected
                      ? "text-accent border-b-2 border-accent"
                      : "text-primary border-b-2 border-transparent hover:text-accent"
                  }`
                }
              >
                Upcoming Deadlines
              </Tabs.Tab>
            </Tabs.List>
            <Tabs.Panel value="calendar" pt="md">
              {/* Calendar content only */}
              <motion.div
                className="flex flex-col items-center px-2 sm:px-4 pt-2 pb-6"
                initial={{ opacity: 0, y: 32 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
              >
                <div className="w-full max-w-3xl mx-auto">
                  <Calendar
                    ref={calendarRef}
                    value={calendarViewDate}
                    onActiveStartDateChange={({ activeStartDate }) =>
                      setCalendarViewDate(activeStartDate)
                    }
                    onChange={setCalendarViewDate}
                    tileContent={({ date, view }) => {
                      if (view === "month") {
                        const events = getEventsForDate(date);
                        if (events.length > 0) {
                          return (
                            <div className="flex gap-1 mt-1 justify-center">
                              {events.map((ev) => (
                                <motion.span
                                  key={ev.id}
                                  className={`inline-block w-2 h-2 rounded-full ${
                                    categoryColors[ev.category] || "bg-gray-400"
                                  }`}
                                  whileHover={{ scale: 1.5 }}
                                  transition={{
                                    type: "spring",
                                    stiffness: 300,
                                  }}
                                ></motion.span>
                              ))}
                            </div>
                          );
                        }
                      }
                      return null;
                    }}
                    onClickDay={(date) => {
                      setSelectedDate(date);
                      setModalOpen(true);
                    }}
                    className="rounded-2xl shadow-lg bg-white p-8 w-full max-w-3xl border border-blue-100 mx-auto"
                    prev2Label={null}
                    next2Label={null}
                  />
                </div>
                {/* Color legend */}
                <div className="flex flex-wrap gap-4 mt-4 mb-2 justify-center">
                  {Object.entries(categoryColors).map(([cat, color]) => (
                    <div key={cat} className="flex items-center gap-2 text-xs">
                      <span
                        className={`inline-block w-3 h-3 rounded-full border-2 border-white shadow ${color}`}
                      ></span>
                      <span className="font-medium text-gray-500">{cat}</span>
                    </div>
                  ))}
                </div>
                {/* Event details modal (unchanged) */}
                <Modal
                  opened={modalOpen && selectedEvents.length > 0}
                  onClose={() => {
                    setModalOpen(false);
                    setSelectedDate(null);
                  }}
                  title={
                    <span className="font-bold text-primary text-lg sm:text-xl">
                      Tax Deadline Details
                    </span>
                  }
                  centered
                  size="lg"
                  overlayProps={{ opacity: 0.2, blur: 2 }}
                  classNames={{ body: "p-0" }}
                >
                  <div className="p-4 sm:p-6">
                    {selectedEvents.map((ev, idx) => (
                      <div
                        key={ev.id}
                        className={`mb-8 last:mb-0 ${
                          selectedEvents.length > 1
                            ? "border-b border-gray-100 pb-8"
                            : ""
                        }`}
                      >
                        <div className="flex items-center gap-2 mb-3 bg-gray-50 rounded-lg px-4 py-2">
                          <span
                            style={{
                              background:
                                categoryHexColors[ev.category] || "#3b82f6",
                            }}
                            className="inline-block w-3 h-3 rounded-full"
                          ></span>
                          <span className="font-semibold text-primary text-lg">
                            {ev.title}
                          </span>
                        </div>
                        <div className="text-base text-gray-700 mb-3 px-4">
                          {ev.description}
                        </div>
                        <div className="flex flex-wrap gap-6 px-4 pb-2">
                          <div className="text-xs text-gray-500">
                            Due:{" "}
                            <span className="font-semibold">{ev.due_date}</span>
                          </div>
                          <div className="text-xs text-gray-400">
                            Category:{" "}
                            <span
                              style={{
                                color:
                                  categoryHexColors[ev.category] || "#3b82f6",
                              }}
                              className="font-semibold"
                            >
                              {ev.category}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </Modal>
              </motion.div>
            </Tabs.Panel>
            <Tabs.Panel value="deadlines" pt="md">
              {/* Upcoming Deadlines content (copied from below) */}
              <motion.div
                className="w-full bg-white/80 border border-blue-100 rounded-2xl shadow-lg p-8 sm:p-10 h-fit px-2 sm:px-4 pt-4 pb-8 my-6"
                initial={{ opacity: 0, x: 32 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }}
              >
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-xl">⏳</span>
                  <h2 className="text-xl font-semibold text-primary">
                    Upcoming Deadlines
                  </h2>
                  <span className="text-xs text-gray-400 ml-2">
                    as per{" "}
                    {new Date().toLocaleDateString("en-GB", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                  </span>
                </div>
                {upcomingEvents.length === 0 ? (
                  <div className="text-gray-400 text-sm">
                    No upcoming deadlines.
                  </div>
                ) : (
                  <ul className="space-y-4">
                    {upcomingEvents.map((ev) => (
                      <motion.li
                        key={ev.id}
                        className="bg-white rounded-xl shadow p-5 flex flex-col gap-1 border-l-4 transition-transform duration-200 cursor-pointer"
                        style={{
                          borderColor:
                            categoryHexColors[ev.category] || "#3b82f6",
                        }}
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        whileHover={{ scale: 1.03 }}
                        transition={{ duration: 0.25 }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = `linear-gradient(90deg, ${
                            categoryHexColors[ev.category] || "#3b82f6"
                          }22 0%, #fff 100%)`;
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = "";
                        }}
                      >
                        <div className="flex items-center gap-2 mb-1">
                          <span
                            className={`inline-block w-3 h-3 rounded-full border-2 border-white shadow ${
                              categoryColors[ev.category] || "bg-gray-400"
                            }`}
                          ></span>
                          <span className="font-semibold text-primary">
                            {ev.title}
                          </span>
                        </div>
                        <span className="text-xs text-gray-500">
                          {ev.due_date}
                        </span>
                        <span className="text-xs text-secondary">
                          {ev.category}
                        </span>
                      </motion.li>
                    ))}
                  </ul>
                )}
              </motion.div>
            </Tabs.Panel>
          </Tabs>
        </div>
        {/* Side-by-side for >=1024px */}
        <div className="hidden lg:flex flex-row gap-12 min-h-[70vh]">
          <motion.div
            className="flex-[1.4] flex flex-col items-center justify-center h-full"
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            {/* Title/description removed for large screens to avoid repetition */}
            <div className="w-full max-w-3xl mx-auto">
              <Calendar
                ref={calendarRef}
                value={calendarViewDate}
                onActiveStartDateChange={({ activeStartDate }) =>
                  setCalendarViewDate(activeStartDate)
                }
                onChange={setCalendarViewDate}
                tileContent={({ date, view }) => {
                  if (view === "month") {
                    const events = getEventsForDate(date);
                    if (events.length > 0) {
                      return (
                        <div className="flex gap-1 mt-1 justify-center">
                          {events.map((ev) => (
                            <motion.span
                              key={ev.id}
                              className={`inline-block w-2 h-2 rounded-full ${
                                categoryColors[ev.category] || "bg-gray-400"
                              }`}
                              whileHover={{ scale: 1.5 }}
                              transition={{ type: "spring", stiffness: 300 }}
                            ></motion.span>
                          ))}
                        </div>
                      );
                    }
                  }
                  return null;
                }}
                onClickDay={(date) => {
                  setSelectedDate(date);
                  setModalOpen(true);
                }}
                className="rounded-2xl shadow-lg bg-white p-8 w-full max-w-3xl border border-blue-100 mx-auto"
                prev2Label={null}
                next2Label={null}
              />
            </div>
            {/* Color legend */}
            <div className="flex flex-wrap gap-4 mt-4 mb-2 justify-center">
              {Object.entries(categoryColors).map(([cat, color]) => (
                <div key={cat} className="flex items-center gap-2 text-xs">
                  <span
                    className={`inline-block w-3 h-3 rounded-full border-2 border-white shadow ${color}`}
                  ></span>
                  <span className="font-medium text-gray-500">{cat}</span>
                </div>
              ))}
            </div>
            {/* Event details modal (unchanged) */}
            <Modal
              opened={modalOpen && selectedEvents.length > 0}
              onClose={() => {
                setModalOpen(false);
                setSelectedDate(null);
              }}
              title={
                <span className="font-bold text-primary text-lg sm:text-xl">
                  Tax Deadline Details
                </span>
              }
              centered
              size="lg"
              overlayProps={{ opacity: 0.2, blur: 2 }}
              classNames={{ body: "p-0" }}
            >
              <div className="p-4 sm:p-6">
                {selectedEvents.map((ev, idx) => (
                  <div
                    key={ev.id}
                    className={`mb-8 last:mb-0 ${
                      selectedEvents.length > 1
                        ? "border-b border-gray-100 pb-8"
                        : ""
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-3 bg-gray-50 rounded-lg px-4 py-2">
                      <span
                        style={{
                          background:
                            categoryHexColors[ev.category] || "#3b82f6",
                        }}
                        className="inline-block w-3 h-3 rounded-full"
                      ></span>
                      <span className="font-semibold text-primary text-lg">
                        {ev.title}
                      </span>
                    </div>
                    <div className="text-base text-gray-700 mb-3 px-4">
                      {ev.description}
                    </div>
                    <div className="flex flex-wrap gap-6 px-4 pb-2">
                      <div className="text-xs text-gray-500">
                        Due:{" "}
                        <span className="font-semibold">{ev.due_date}</span>
                      </div>
                      <div className="text-xs text-gray-400">
                        Category:{" "}
                        <span
                          style={{
                            color: categoryHexColors[ev.category] || "#3b82f6",
                          }}
                          className="font-semibold"
                        >
                          {ev.category}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Modal>
          </motion.div>
          <motion.div
            className="w-full md:w-[420px] flex-shrink-0 bg-white/80 border border-blue-100 rounded-2xl shadow-lg p-6 h-fit"
            initial={{ opacity: 0, x: 32 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }}
          >
            <div className="flex items-center gap-2 mb-4">
              <span className="text-xl">⏳</span>
              <h2 className="text-xl font-semibold text-primary">
                Upcoming Deadlines
              </h2>
              <span className="text-xs text-gray-400 ml-2">
                as per{" "}
                {new Date().toLocaleDateString("en-GB", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                })}
              </span>
            </div>
            {upcomingEvents.length === 0 ? (
              <div className="text-gray-400 text-sm">
                No upcoming deadlines.
              </div>
            ) : (
              <ul className="space-y-4">
                {upcomingEvents.map((ev) => (
                  <motion.li
                    key={ev.id}
                    className="bg-white rounded-xl shadow p-5 flex flex-col gap-1 border-l-4 transition-transform duration-200 cursor-pointer"
                    style={{
                      borderColor: categoryHexColors[ev.category] || "#3b82f6",
                    }}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    whileHover={{ scale: 1.03 }}
                    transition={{ duration: 0.25 }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = `linear-gradient(90deg, ${
                        categoryHexColors[ev.category] || "#3b82f6"
                      }22 0%, #fff 100%)`;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = "";
                    }}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <span
                        className={`inline-block w-3 h-3 rounded-full border-2 border-white shadow ${
                          categoryColors[ev.category] || "bg-gray-400"
                        }`}
                      ></span>
                      <span className="font-semibold text-primary">
                        {ev.title}
                      </span>
                    </div>
                    <span className="text-xs text-gray-500">{ev.due_date}</span>
                    <span className="text-xs text-secondary">
                      {ev.category}
                    </span>
                  </motion.li>
                ))}
              </ul>
            )}
          </motion.div>
        </div>
      </motion.div>
      <style jsx global>{`
        .react-calendar,
        .react-calendar__viewContainer,
        .react-calendar__month-view,
        .react-calendar__month-view > div,
        .react-calendar__month-view > div > div {
          width: 100%;
          max-width: 100%;
        }
        .react-calendar {
          border: none;
        }
        .react-calendar__tile--active {
          background: #ede9fe !important;
          color: #7c3aed !important;
        }
        .react-calendar__tile--now {
          background: #f0f9ff !important;
        }
      `}</style>
    </>
  );
}
