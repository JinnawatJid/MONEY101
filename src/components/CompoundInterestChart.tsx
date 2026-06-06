"use client";

import { useMemo } from "react";
import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer } from "recharts";
import { calculateCompoundInterest, CompoundInterestParams } from "@/utils/finance";

interface Scenario {
  name: string;
  params: CompoundInterestParams;
  color: string;
  baseColor: string;
}

interface Props {
  scenarios: Scenario[];
  targetAge: number;
}

const CustomTooltip = ({ active, payload, label }: { active?: boolean, payload?: Array<Record<string, unknown>>, label?: string }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3 border rounded shadow-md text-sm text-gray-800 z-50">
        <p className="font-bold mb-2">อายุ: {label}</p>
        {payload.map((entry: Record<string, unknown>, index: number) => {
          const dataKey = String(entry.dataKey || "");
          const scenarioName = dataKey.replace("Value", "").replace("Invested", "");
          // Recharts tooltip gives us each piece of the stack. We only want to show total values once per scenario.
          // To avoid duplicates, we check if it's the 'Value' bar. We'll handle it carefully.
          if (dataKey.includes("Invested")) return null; // We'll show invested info when we hit the Value bar.

          const investedKey = `${scenarioName}Invested`;
          const payloadData = entry.payload as Record<string, unknown>;
          const invested = Number(payloadData?.[investedKey] || 0);

          // Recharts stacked bar 'value' for the top bar is just the difference. We want the total.
          const totalValue = Number(payloadData?.[`${scenarioName}Value`] || 0);
          const color = String(entry.color || "#000");

          return (
            <div key={index} className="mb-2" style={{ color }}>
              <p className="font-semibold">{scenarioName}</p>
              <p>มูลค่ารวม: ฿{totalValue.toLocaleString()}</p>
              <p className="text-xs text-gray-500">เงินต้น: ฿{invested.toLocaleString()}</p>
            </div>
          );
        })}
      </div>
    );
  }
  return null;
};

export default function CompoundInterestChart({ scenarios, targetAge }: Props) {
  const chartData = useMemo(() => {
    if (scenarios.length === 0) return [];

    const minAge = Math.min(...scenarios.map(s => s.params.startAge));

    // Sample 4 key points to mimic the design
    const start = minAge;
    const end = targetAge;
    const interval = Math.floor((end - start) / 3);

    let pointsOfInterest = [start, end];
    if (interval > 0) {
       pointsOfInterest = [
        start,
        start + interval,
        start + interval * 2,
        end
      ];
    }

    // De-duplicate in case interval is too small
    pointsOfInterest = Array.from(new Set(pointsOfInterest)).sort((a,b) => a-b);

    const results = scenarios.map(s => {
      const calculated = calculateCompoundInterest({
        ...s.params,
        endAge: targetAge
      });
      return {
        name: s.name,
        color: s.color,
        baseColor: s.baseColor,
        data: calculated
      };
    });

    const mergedData = [];
    for (let i = 0; i < pointsOfInterest.length; i++) {
      const age = pointsOfInterest[i];
      if (age > targetAge) continue;

      const label = i === 0 ? "เริ่ม" : `${age} ปี`;
      const dataPoint: Record<string, unknown> = { age: label };

      results.forEach(scenario => {
        const matchingYear = scenario.data.find(d => d.age === age);
        const totalInvested = matchingYear ? matchingYear.totalInvested : 0;
        const totalValue = matchingYear ? matchingYear.totalValue : 0;

        // For stacked bar charts, we need the "base" (invested) and the "top" (interest)
        const interest = Math.max(0, totalValue - totalInvested);

        dataPoint[`${scenario.name}Invested`] = totalInvested;
        dataPoint[`${scenario.name}Interest`] = interest;
        dataPoint[`${scenario.name}Value`] = totalValue; // For tooltip reference
      });

      mergedData.push(dataPoint);
    }

    return mergedData;
  }, [scenarios, targetAge]);

  return (
    <div className="w-full h-full pb-4">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={chartData}
          margin={{ top: 0, right: 0, left: 0, bottom: 0 }}
          barGap={2}
          barCategoryGap="15%"
        >
          <XAxis
            dataKey="age"
            tick={{ fontSize: 10, fill: '#75777d', fontWeight: 'bold' }}
            axisLine={false}
            tickLine={false}
            tickMargin={10}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(0,0,0,0.05)' }} />

          {scenarios.map((scenario) => (
            // Base layer (Invested Principal)
            <Bar
              key={`${scenario.name}-invested`}
              dataKey={`${scenario.name}Invested`}
              stackId={scenario.name}
              fill={scenario.baseColor}
              radius={[0, 0, 0, 0]}
            />
          ))}
          {scenarios.map((scenario) => (
            // Top layer (Interest Earned)
            <Bar
              key={`${scenario.name}-interest`}
              dataKey={`${scenario.name}Interest`}
              stackId={scenario.name}
              fill={scenario.color}
              radius={[0, 0, 0, 0]}
            />
          ))}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
