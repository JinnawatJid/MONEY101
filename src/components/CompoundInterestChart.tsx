"use client";

import { useMemo } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { calculateCompoundInterest, CompoundInterestParams } from "@/utils/finance";

interface Scenario {
  name: string;
  params: CompoundInterestParams;
  color: string;
}

interface Props {
  scenarios: Scenario[];
  targetAge: number;
}

const CustomTooltip = ({ active, payload, label }: { active?: boolean, payload?: Array<Record<string, unknown>>, label?: string }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3 border rounded shadow-md text-sm text-gray-800 z-50">
        <p className="font-bold mb-2">อายุ: {label} ปี</p>
        {payload.map((entry: Record<string, unknown>, index: number) => {
          const dataKey = String(entry.dataKey || "");
          const scenarioName = dataKey.replace("Value", "");
          const investedKey = `${scenarioName}Invested`;
          const payloadData = entry.payload as Record<string, unknown>;
          const invested = Number(payloadData?.[investedKey] || 0);
          const value = Number(entry.value || 0);
          const color = String(entry.color || "#000");

          return (
            <div key={index} className="mb-2" style={{ color }}>
              <p className="font-semibold">{scenarioName}</p>
              <p>มูลค่ารวม: ฿{value.toLocaleString()}</p>
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

    // To mimic the design, we don't want to show every single year if the range is large,
    // but a bar chart looks best with discrete points. Let's sample 4 key points.
    const start = minAge;
    const end = targetAge;
    const interval = Math.floor((end - start) / 3);

    // Fallback to yearly if interval is 0
    const pointsOfInterest = interval > 0 ? [
      start,
      start + interval,
      start + interval * 2,
      end
    ] : [start, end];

    const results = scenarios.map(s => {
      const calculated = calculateCompoundInterest({
        ...s.params,
        endAge: targetAge
      });
      return {
        name: s.name,
        color: s.color,
        data: calculated
      };
    });

    const mergedData = [];
    for (const age of pointsOfInterest) {
      if (age > targetAge) continue; // safety check
      const dataPoint: Record<string, unknown> = { age: `${age} ปี` };

      results.forEach(scenario => {
        const matchingYear = scenario.data.find(d => d.age === age);
        dataPoint[`${scenario.name}Value`] = matchingYear ? matchingYear.totalValue : 0;
        dataPoint[`${scenario.name}Invested`] = matchingYear ? matchingYear.totalInvested : 0;
      });

      mergedData.push(dataPoint);
    }

    return mergedData;
  }, [scenarios, targetAge]);

  return (
    <div className="w-full h-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={chartData}
          margin={{ top: 10, right: 0, left: 0, bottom: 0 }}
          barGap={2}
          barCategoryGap={20}
        >
          <CartesianGrid vertical={false} strokeDasharray="3 3" opacity={0.3} />
          <XAxis
            dataKey="age"
            tick={{ fontSize: 10, fill: '#75777d' }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: 'transparent' }} />

          {scenarios.map((scenario) => (
            <Bar
              key={scenario.name}
              dataKey={`${scenario.name}Value`}
              fill={scenario.color}
              radius={[4, 4, 0, 0]}
            />
          ))}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
