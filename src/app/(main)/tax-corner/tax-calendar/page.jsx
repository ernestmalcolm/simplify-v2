"use client";

import {
  IconCalendarEvent,
  IconAlertCircle,
  IconInfoCircle,
} from "@tabler/icons-react";
import {
  Paper,
  Text,
  Title,
  Alert,
  ThemeIcon,
  Badge,
  Timeline,
  Tooltip,
  ActionIcon,
  Modal,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";

function getDayWithOrdinal(day) {
  if (day > 3 && day < 21) return `${day}th`;
  switch (day % 10) {
    case 1:
      return `${day}st`;
    case 2:
      return `${day}nd`;
    case 3:
      return `${day}rd`;
    default:
      return `${day}th`;
  }
}

function DisclaimerModal({ opened, close }) {
  return (
    <Modal
      opened={opened}
      onClose={close}
      title={
        <Title order={3} className="text-primary flex items-center gap-2">
          <IconInfoCircle /> Disclaimer
        </Title>
      }
      size="lg"
      radius="lg"
      overlayProps={{ opacity: 0.5, blur: 2 }}
    >
      <Text p="md" c="dimmed">
        This calendar provides a general guide to key tax deadlines for
        businesses with a standard January-December financial year. Deadlines
        can vary based on your company's specific circumstances and fiscal year.
        Always confirm with the Tanzania Revenue Authority (TRA) for official
        dates.
      </Text>
    </Modal>
  );
}

const getYearlyDeadlines = (year = new Date().getFullYear()) => [
  {
    month: "January",
    events: [
      {
        day: 7,
        type: "PAYE/SDL/WHT",
        description: "Remittance for December of the previous year.",
      },
    ],
  },
  {
    month: "February",
    events: [
      {
        day: 7,
        type: "PAYE/SDL/WHT",
        description: "Remittance for January.",
      },
    ],
  },
  {
    month: "March",
    events: [
      {
        day: 7,
        type: "PAYE/SDL/WHT",
        description: "Remittance for February.",
      },
      {
        day: 31,
        type: "Provisional Tax",
        description: `1st quarterly installment for ${
          year - 1
        } year of income.`,
      },
    ],
  },
  {
    month: "April",
    events: [
      {
        day: 7,
        type: "PAYE/SDL/WHT",
        description: "Remittance for March.",
      },
    ],
  },
  {
    month: "May",
    events: [
      { day: 7, type: "PAYE/SDL/WHT", description: "Remittance for April." },
    ],
  },
  {
    month: "June",
    events: [
      { day: 7, type: "PAYE/SDL/WHT", description: "Remittance for May." },
      {
        day: 30,
        type: "Income Tax",
        description: `Filing of final income tax return for the year ended 31st December ${
          year - 1
        }.`,
      },
      {
        day: 30,
        type: "Provisional Tax",
        description: `2nd quarterly installment for ${
          year - 1
        } year of income.`,
      },
      {
        day: 30,
        type: "Financial Audit",
        description: `Submission of audited financial statements for companies with a 31st December year-end.`,
      },
    ],
  },
  {
    month: "July",
    events: [
      { day: 7, type: "PAYE/SDL/WHT", description: "Remittance for June." },
    ],
  },
  {
    month: "August",
    events: [
      { day: 7, type: "PAYE/SDL/WHT", description: "Remittance for July." },
    ],
  },
  {
    month: "September",
    events: [
      { day: 7, type: "PAYE/SDL/WHT", description: "Remittance for August." },
      {
        day: 30,
        type: "Provisional Tax",
        description: `3rd quarterly installment for ${year} year of income.`,
      },
    ],
  },
  {
    month: "October",
    events: [
      {
        day: 7,
        type: "PAYE/SDL/WHT",
        description: "Remittance for September.",
      },
    ],
  },
  {
    month: "November",
    events: [
      { day: 7, type: "PAYE/SDL/WHT", description: "Remittance for October." },
    ],
  },
  {
    month: "December",
    events: [
      {
        day: 7,
        type: "PAYE/SDL/WHT",
        description: "Remittance for November.",
      },
      {
        day: 31,
        type: "Provisional Tax",
        description: `4th (final) quarterly installment for ${year} year of income.`,
      },
    ],
  },
];

const taxTypeColors = {
  "PAYE/SDL/WHT": "blue",
  "Provisional Tax": "green",
  "Income Tax": "red",
  "Financial Audit": "orange",
  VAT: "grape",
};

export default function TaxCalendarPage() {
  const [opened, { open, close }] = useDisclosure(false);
  const deadlines = getYearlyDeadlines();
  // Add VAT to every month's events
  deadlines.forEach((month) => {
    month.events.push({
      day: 20,
      type: "VAT",
      description: `Filing of VAT return for the previous month.`,
    });
    // Sort events by day
    month.events.sort((a, b) => a.day - b.day);
  });

  return (
    <>
      <DisclaimerModal opened={opened} close={close} />
      <div className="max-w-7xl mx-auto p-4 sm:p-6 md:p-8">
        <Paper
          shadow="lg"
          p="xl"
          radius="xl"
          className="bg-white/80 border border-gray-200/80 relative"
        >
          <div className="absolute top-4 right-4 z-10">
            <Tooltip label="About our Tax Calendar" withArrow>
              <ActionIcon
                variant="light"
                color="yellow"
                size="lg"
                radius="xl"
                onClick={open}
              >
                <IconInfoCircle />
              </ActionIcon>
            </Tooltip>
          </div>
          <div className="flex items-center gap-4 mb-8 text-center flex-col">
            <div className="bg-primary/10 p-4 rounded-full">
              <IconCalendarEvent className="w-10 h-10 text-primary" />
            </div>
            <div>
              <Title order={1} className="text-primary text-3xl sm:text-4xl">
                Tanzania Annual Tax Calendar
              </Title>
              <Text c="dimmed" size="lg" mt={4}>
                Key compliance dates for businesses with a December year-end.
              </Text>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {deadlines.map((monthData) => (
              <Paper
                key={monthData.month}
                withBorder
                radius="lg"
                p="lg"
                className="flex flex-col h-full"
              >
                <Title order={3} className="text-primary mb-4 text-center">
                  {monthData.month}
                </Title>
                <Timeline
                  active={monthData.events.length}
                  bulletSize={24}
                  lineWidth={2}
                >
                  {monthData.events.map((event, index) => (
                    <Timeline.Item
                      key={index}
                      title={
                        <Text fw={500} size="md">
                          {getDayWithOrdinal(event.day)}
                        </Text>
                      }
                      bullet={
                        <ThemeIcon
                          size={22}
                          variant="filled"
                          radius="xl"
                          color={taxTypeColors[event.type] || "gray"}
                        >
                          <IconCalendarEvent size="0.8rem" />
                        </ThemeIcon>
                      }
                    >
                      <Badge
                        color={taxTypeColors[event.type] || "gray"}
                        variant="light"
                        size="sm"
                        mb={4}
                      >
                        {event.type}
                      </Badge>
                      <Text c="dimmed" size="sm">
                        {event.description}
                      </Text>
                    </Timeline.Item>
                  ))}
                </Timeline>
              </Paper>
            ))}
          </div>
        </Paper>
      </div>
    </>
  );
}
