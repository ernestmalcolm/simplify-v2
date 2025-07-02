"use client";

import { useState } from "react";
import {
  Button,
  NumberInput,
  Paper,
  Text,
  Title,
  Alert,
  Tabs,
  Switch,
  Grid,
  SimpleGrid,
  Tooltip,
  ActionIcon,
  Divider,
  Stack,
  Group,
} from "@mantine/core";
import {
  IconCalculator,
  IconAlertCircle,
  IconReceiptTax,
  IconUser,
  IconPercentage,
  IconInfoCircle,
  IconArrowDown,
  IconWallet,
  IconReportMoney,
  IconSum,
  IconTrendingUp,
} from "@tabler/icons-react";

const CURRENCY = "TZS";

const formatNumber = (num) =>
  num.toLocaleString(undefined, { maximumFractionDigits: 2 });

function PresumptiveTaxEstimator() {
  const [monthlyRevenue, setMonthlyRevenue] = useState("");
  const [result, setResult] = useState(null);

  const handleCalculate = () => {
    const monthly = Number(String(monthlyRevenue).replace(/,/g, ""));
    const annualRevenue = monthly * 12;
    let calcResult = { projectedAnnual: annualRevenue };

    if (annualRevenue < 4000000) {
      calcResult.message =
        "Good news! With a projected turnover under TZS 4M, your business may not be required to pay presumptive income tax. Focus on growing your business!";
      calcResult.type = "info";
    } else if (annualRevenue >= 4000000 && annualRevenue <= 7000000) {
      calcResult.amount = 100000;
      calcResult.note =
        "Your business falls under the presumptive tax system, which simplifies tax for small businesses.";
    } else if (annualRevenue > 7000000 && annualRevenue <= 11500000) {
      calcResult.amount = 280000;
      calcResult.note =
        "Your business falls under the presumptive tax system, which simplifies tax for small businesses.";
    } else if (annualRevenue > 11500000 && annualRevenue <= 100000000) {
      calcResult.amount = (annualRevenue - 11500000) * 0.03 + 280000;
      calcResult.note =
        "Your business falls under the presumptive tax system, which simplifies tax for small businesses.";
    } else if (annualRevenue > 100000000) {
      const assumedNetProfit = annualRevenue * 0.15;
      calcResult.amount = assumedNetProfit * 0.3;

      let note =
        "Your projected turnover exceeds the TZS 100M presumptive tax threshold. This estimate is based on an assumed 15% net profit margin for corporate income tax (30%).";

      if (annualRevenue >= 200000000) {
        note +=
          " With a turnover above TZS 200M, you are also likely required to register for VAT.";
      }

      note +=
        " For accurate tax planning, please consult a registered accountant.";
      calcResult.note = note;
    }
    setResult(calcResult);
  };

  return (
    <>
      <Text mb="lg" c="dimmed">
        Enter your average monthly revenue to project your estimated annual
        income tax.
      </Text>
      <NumberInput
        label="Average Monthly Revenue (TZS)"
        value={monthlyRevenue}
        onChange={setMonthlyRevenue}
        thousandSeparator=","
        min={0}
        step={50000}
        size="md"
        mb="md"
      />
      <Button
        onClick={handleCalculate}
        fullWidth
        size="md"
        className="bg-gradient-to-r from-primary to-accent hover:scale-[1.02] transition-transform"
      >
        Estimate Annual Tax
      </Button>

      <div className="flex justify-end mt-4 mb-4">
        <Tooltip
          label={
            <Stack p="xs" spacing="sm">
              <div>
                <Text size="sm" fw={700}>
                  About Income Tax
                </Text>
                <Text size="xs" c="dimmed">
                  This estimator covers two main types of income tax. For
                  turnovers up to TZS 100M, it uses the simplified Presumptive
                  Tax scheme. Above that, it estimates Corporate Income Tax.
                </Text>
              </div>
              <Divider />
              <div>
                <Text size="sm" fw={700} mb="xs">
                  Presumptive Tax Brackets (Annual Turnover)
                </Text>
                <Stack spacing={6}>
                  <Group position="apart" noWrap>
                    <Text size="xs" c="dimmed">
                      Below 4,000,000
                    </Text>
                    <Text size="xs" fw={500}>
                      Tax Exempt
                    </Text>
                  </Group>
                  <Group position="apart" noWrap>
                    <Text size="xs" c="dimmed">
                      4,000,000 - 7,000,000
                    </Text>
                    <Text size="xs" fw={500}>
                      TZS 100,000
                    </Text>
                  </Group>
                  <Group position="apart" noWrap>
                    <Text size="xs" c="dimmed">
                      7,000,001 - 11,500,000
                    </Text>
                    <Text size="xs" fw={500}>
                      TZS 280,000
                    </Text>
                  </Group>
                  <Group position="apart" noWrap>
                    <Text size="xs" c="dimmed">
                      11,500,001 - 100,000,000
                    </Text>
                    <Text size="xs" fw={500} ta="right">
                      280,000 + 3% of turnover over 11.5M
                    </Text>
                  </Group>
                  <Divider my={4} />
                  <Group position="apart" noWrap>
                    <Text size="xs" c="dimmed">
                      100,000,001 - 200,000,000
                    </Text>
                    <Text size="xs" fw={500}>
                      Corporate Tax (30%)
                    </Text>
                  </Group>
                  <Group position="apart" noWrap>
                    <Text size="xs" c="dimmed">
                      Above 200,000,000
                    </Text>
                    <Text size="xs" fw={500}>
                      Corporate Tax (30%) & VAT
                    </Text>
                  </Group>
                </Stack>
              </div>
            </Stack>
          }
          position="top-end"
          withArrow
          styles={{ tooltip: { maxWidth: 600, whiteSpace: "normal" } }}
        >
          <ActionIcon
            variant="transparent"
            c="dimmed"
            radius="xl"
            size="lg"
            style={{ cursor: "help" }}
          >
            <IconInfoCircle />
          </ActionIcon>
        </Tooltip>
      </div>

      {result !== null &&
        (result.message ? (
          <Alert
            icon={<IconInfoCircle size="1rem" />}
            title="Information"
            color="blue"
            radius="md"
            mt="xl"
          >
            <Text c="dimmed" size="sm">
              Projected Annual Turnover:{" "}
              <Text component="span" fw={700}>
                {CURRENCY} {formatNumber(result.projectedAnnual)}
              </Text>
            </Text>
            <Text mt="xs">{result.message}</Text>
          </Alert>
        ) : (
          <Alert
            icon={<IconReportMoney size="1.5rem" />}
            title="Your Estimated Annual Tax"
            color="blue"
            radius="md"
            mt="xl"
          >
            <Text ta="center" c="blue.8" fz="2.5rem" fw={700}>
              {CURRENCY} {formatNumber(result.amount)}
            </Text>

            <Text ta="center" size="sm" c="dimmed" mt="sm">
              Based on a projected annual turnover of{" "}
              <Text span fw={700} c="gray.7">
                {CURRENCY} {formatNumber(result.projectedAnnual)}
              </Text>
            </Text>
            {result.note && (
              <Text ta="center" size="sm" c="dimmed" mt="md" p="xs">
                {result.note}
              </Text>
            )}
          </Alert>
        ))}
    </>
  );
}

function PayeCalculator() {
  const [monthlySalary, setMonthlySalary] = useState("");
  const [employeeCount, setEmployeeCount] = useState("");
  const [result, setResult] = useState(null);

  const calculatePAYE = (monthlySalary) => {
    const annualSalary = monthlySalary * 12;
    let tax = 0;

    if (annualSalary <= 3240000) {
      // 0-270,000 monthly = 0-3,240,000 annually
      tax = 0;
    } else if (annualSalary <= 6240000) {
      // 270,001-520,000 monthly = 3,240,001-6,240,000 annually
      tax = (annualSalary - 3240000) * 0.08;
    } else if (annualSalary <= 9120000) {
      // 520,001-760,000 monthly = 6,240,001-9,120,000 annually
      tax = 240000 + (annualSalary - 6240000) * 0.2;
    } else if (annualSalary <= 12000000) {
      // 760,001-1,000,000 monthly = 9,120,001-12,000,000 annually
      tax = 816000 + (annualSalary - 9120000) * 0.25;
    } else {
      // Above 1,000,000 monthly = Above 12,000,000 annually
      tax = 1536000 + (annualSalary - 12000000) * 0.3;
    }

    return tax / 12; // Convert annual tax to monthly
  };

  const handleCalculate = () => {
    const salary = Number(String(monthlySalary).replace(/,/g, ""));
    const employees = employeeCount ? Number(employeeCount) : 1;

    const monthlyPAYE = calculatePAYE(salary);
    const monthlyNet = salary - monthlyPAYE;
    const annualPAYE = monthlyPAYE * 12;
    const annualNet = monthlyNet * 12;

    setResult({
      monthlyPAYE: monthlyPAYE * employees,
      monthlyNet: monthlyNet * employees,
      annualPAYE: annualPAYE * employees,
      annualNet: annualNet * employees,
      employeeCount: employees,
    });
  };

  return (
    <>
      <Text mb="lg" c="dimmed">
        Estimate PAYE (Pay As You Earn) tax for your employees using Tanzania's
        progressive tax system.
      </Text>

      <NumberInput
        label="Average Gross Monthly Salary (TZS)"
        value={monthlySalary}
        onChange={setMonthlySalary}
        thousandSeparator=","
        min={0}
        step={50000}
        size="md"
        mb="md"
      />

      <NumberInput
        label="Number of Employees (Optional)"
        value={employeeCount}
        onChange={setEmployeeCount}
        placeholder="Leave empty for single employee"
        min={1}
        step={1}
        size="md"
        mb="md"
      />

      <Button
        onClick={handleCalculate}
        fullWidth
        size="md"
        className="bg-gradient-to-r from-primary to-accent hover:scale-[1.02] transition-transform"
        mb="md"
      >
        Calculate PAYE
      </Button>

      <div className="flex justify-end mt-4 mb-4">
        <Tooltip
          label={
            <Stack p="xs" spacing="sm">
              <div>
                <Text size="sm" fw={700}>
                  About PAYE Estimator
                </Text>
                <Text size="xs" c="dimmed">
                  This is an estimate based on an average salary. Since PAYE is
                  a progressive tax, the actual amount may vary for each
                  employee.
                </Text>
              </div>
              <Divider />
              <div>
                <Text size="sm" fw={700} mb="xs">
                  PAYE Brackets (Monthly Salary)
                </Text>
                <Stack spacing={6}>
                  <Group position="apart" noWrap>
                    <Text size="xs" c="dimmed">
                      0 - 270,000
                    </Text>
                    <Text size="xs" fw={500}>
                      0%
                    </Text>
                  </Group>
                  <Group position="apart" noWrap>
                    <Text size="xs" c="dimmed">
                      270,001 - 520,000
                    </Text>
                    <Text size="xs" fw={500} ta="right">
                      8% of excess over 270,000
                    </Text>
                  </Group>
                  <Group position="apart" noWrap>
                    <Text size="xs" c="dimmed">
                      520,001 - 760,000
                    </Text>
                    <Text size="xs" fw={500} ta="right">
                      20,000 + 20% of excess over 520,000
                    </Text>
                  </Group>
                  <Group position="apart" noWrap>
                    <Text size="xs" c="dimmed">
                      760,001 - 1,000,000
                    </Text>
                    <Text size="xs" fw={500} ta="right">
                      68,000 + 25% of excess over 760,000
                    </Text>
                  </Group>
                  <Group position="apart" noWrap>
                    <Text size="xs" c="dimmed">
                      Above 1,000,000
                    </Text>
                    <Text size="xs" fw={500} ta="right">
                      128,000 + 30% of excess over 1,000,000
                    </Text>
                  </Group>
                </Stack>
              </div>
            </Stack>
          }
          position="top-end"
          withArrow
          styles={{ tooltip: { maxWidth: 400, whiteSpace: "normal" } }}
        >
          <ActionIcon
            variant="transparent"
            c="dimmed"
            radius="xl"
            size="lg"
            style={{ cursor: "help" }}
          >
            <IconInfoCircle />
          </ActionIcon>
        </Tooltip>
      </div>

      {result && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
          <Paper withBorder p="md" radius="md" className="bg-primary/5">
            <Text size="sm" c="dimmed" ta="center">
              Monthly PAYE
            </Text>
            <Text size="xl" ta="center" fw={700} c="primary">
              {CURRENCY} {formatNumber(result.monthlyPAYE)}
            </Text>
            {result.employeeCount > 1 && (
              <Text size="xs" c="dimmed" ta="center" mt="xs">
                ({result.employeeCount} employees)
              </Text>
            )}
          </Paper>

          <Paper withBorder p="md" radius="md" className="bg-green-50">
            <Text size="sm" c="dimmed" ta="center">
              Monthly Net Salary
            </Text>
            <Text size="xl" ta="center" fw={700} c="green">
              {CURRENCY} {formatNumber(result.monthlyNet)}
            </Text>
            {result.employeeCount > 1 && (
              <Text size="xs" c="dimmed" ta="center" mt="xs">
                ({result.employeeCount} employees)
              </Text>
            )}
          </Paper>

          <Paper withBorder p="md" radius="md" className="bg-primary/5">
            <Text size="sm" c="dimmed" ta="center">
              Projected Annual PAYE
            </Text>
            <Text size="xl" ta="center" fw={700} c="primary">
              {CURRENCY} {formatNumber(result.annualPAYE)}
            </Text>
            {result.employeeCount > 1 && (
              <Text size="xs" c="dimmed" ta="center" mt="xs">
                ({result.employeeCount} employees)
              </Text>
            )}
          </Paper>

          <Paper withBorder p="md" radius="md" className="bg-green-50">
            <Text size="sm" c="dimmed" ta="center">
              Projected Annual Net Salary
            </Text>
            <Text size="xl" ta="center" fw={700} c="green">
              {CURRENCY} {formatNumber(result.annualNet)}
            </Text>
            {result.employeeCount > 1 && (
              <Text size="xs" c="dimmed" ta="center" mt="xs">
                ({result.employeeCount} employees)
              </Text>
            )}
          </Paper>
        </div>
      )}
    </>
  );
}

function VatCalculator() {
  const [amount, setAmount] = useState("");
  const [isVatInclusive, setIsVatInclusive] = useState(false);
  const [result, setResult] = useState(null);

  const calculateVat = () => {
    const monthlySales = Number(String(amount).replace(/,/g, ""));
    const vatRate = 0.18;
    let base, vat, total;
    if (isVatInclusive) {
      total = monthlySales;
      base = monthlySales / (1 + vatRate);
      vat = total - base;
    } else {
      base = monthlySales;
      vat = monthlySales * vatRate;
      total = base + vat;
    }
    setResult({ base, vat, total });
  };

  return (
    <>
      <Text mb="lg" c="dimmed">
        Enter your average monthly sales to estimate the VAT you would need to
        remit each month and annually.
      </Text>
      <Grid align="flex-end">
        <Grid.Col span="auto">
          <NumberInput
            label="Total Monthly Sales (TZS)"
            value={amount}
            onChange={setAmount}
            thousandSeparator=","
            min={0}
            step={10000}
            size="md"
          />
        </Grid.Col>
        <Grid.Col span="content">
          <Switch
            checked={isVatInclusive}
            onChange={(e) => setIsVatInclusive(e.currentTarget.checked)}
            label="Sales amount includes VAT"
            mb={10}
          />
        </Grid.Col>
      </Grid>
      <Button
        onClick={calculateVat}
        fullWidth
        mt="md"
        size="md"
        className="bg-gradient-to-r from-primary to-accent hover:scale-[1.02] transition-transform"
      >
        Calculate VAT
      </Button>

      <div className="flex justify-end mt-4 mb-4">
        <Tooltip
          label={
            <Stack p="xs" spacing="sm">
              <div>
                <Text size="sm" fw={700}>
                  About VAT Registration
                </Text>
                <Text size="xs" c="dimmed">
                  Value Added Tax (VAT) is a tax on consumption. In Tanzania,
                  businesses with a projected annual turnover of TZS 200 million
                  or more are legally required to register for VAT and charge it
                  on their sales.
                </Text>
              </div>
            </Stack>
          }
          position="top-end"
          withArrow
          styles={{ tooltip: { maxWidth: 320, whiteSpace: "normal" } }}
        >
          <ActionIcon
            variant="transparent"
            c="dimmed"
            radius="xl"
            size="lg"
            style={{ cursor: "help" }}
          >
            <IconInfoCircle />
          </ActionIcon>
        </Tooltip>
      </div>

      {result && (
        <SimpleGrid cols={2} mt="xl" spacing="xl">
          <Paper withBorder p="md" radius="md" className="bg-primary/5">
            <Text
              size="xs"
              ta="center"
              c="dimmed"
              className="flex items-center justify-center gap-2"
            >
              <IconSum size="1rem" /> Monthly Sales (Excl. VAT)
            </Text>
            <Text size="lg" ta="center" fw={600}>
              {CURRENCY} {formatNumber(result.base)}
            </Text>
          </Paper>
          <Paper withBorder p="md" radius="md" className="bg-primary/5">
            <Text
              size="xs"
              ta="center"
              c="dimmed"
              className="flex items-center justify-center gap-2"
            >
              <IconReportMoney size="1rem" /> Monthly VAT
            </Text>
            <Text size="lg" ta="center" fw={600} c="primary">
              {CURRENCY} {formatNumber(result.vat)}
            </Text>
          </Paper>
          <Paper withBorder p="md" radius="md" className="bg-blue-50">
            <Text size="md" ta="center" fw={500} c="primary">
              Projected Annual VAT to Remit
            </Text>
            <Text size="2rem" ta="center" fw={700} c="primary">
              {CURRENCY} {formatNumber(result.vat * 12)}
            </Text>
          </Paper>
        </SimpleGrid>
      )}
    </>
  );
}

export default function TaxCalculatorPage() {
  return (
    <div className="max-w-3xl mx-auto p-4 sm:p-6 md:p-8">
      <Paper
        shadow="lg"
        p="xl"
        radius="xl"
        className="bg-white/80 border border-gray-200/80"
      >
        <div className="flex items-center gap-4 mb-6">
          <div className="bg-primary/10 p-3 rounded-full">
            <IconCalculator className="w-8 h-8 text-primary" />
          </div>
          <div>
            <Title order={1} className="text-primary text-2xl sm:text-3xl">
              Tax Calculator
            </Title>
            <Text c="dimmed" size="lg" mt={4}>
              Quick estimates for common Tanzanian taxes.
            </Text>
          </div>
        </div>

        <Tabs
          defaultValue="presumptive"
          variant="default"
          radius="md"
          color="primary"
        >
          <Tabs.List grow>
            <Tabs.Tab value="presumptive" icon={<IconReceiptTax size="1rem" />}>
              Income Tax
            </Tabs.Tab>
            <Tabs.Tab value="paye" icon={<IconUser size="1rem" />}>
              Employee PAYE
            </Tabs.Tab>
            <Tabs.Tab value="vat" icon={<IconPercentage size="1rem" />}>
              Monthly VAT
            </Tabs.Tab>
          </Tabs.List>

          <Tabs.Panel value="presumptive" pt="xl">
            <PresumptiveTaxEstimator />
          </Tabs.Panel>
          <Tabs.Panel value="paye" pt="xl">
            <PayeCalculator />
          </Tabs.Panel>
          <Tabs.Panel value="vat" pt="xl">
            <VatCalculator />
          </Tabs.Panel>
        </Tabs>

        <Alert
          icon={<IconAlertCircle size="1rem" />}
          title="Disclaimer"
          color="yellow"
          radius="md"
          mt="xl"
          variant="light"
        >
          These calculators provide estimates for informational purposes only
          and should not substitute professional tax advice. Always consult with
          the TRA or a certified tax advisor.
        </Alert>
      </Paper>
    </div>
  );
}
