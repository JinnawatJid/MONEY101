"use client";

import { useMemo } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
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
      <div className="bg-white p-4 border rounded shadow-lg text-sm text-gray-800">
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

    // Find the absolute minimum starting age across all scenarios
    const minAge = Math.min(...scenarios.map(s => s.params.startAge));

    // Generate individual results
    const results = scenarios.map(s => {
      // Create a padded array of results starting from minAge
      const calculated = calculateCompoundInterest({
        ...s.params,
        endAge: targetAge // Force end age to target
      });

      return {
        name: s.name,
        color: s.color,
        data: calculated
      };
    });

    // Merge into Recharts format
    const mergedData = [];
    for (let age = minAge; age <= targetAge; age++) {
      const dataPoint: Record<string, unknown> = { age };

      results.forEach(scenario => {
        const matchingYear = scenario.data.find(d => d.age === age);
        // If the scenario hasn't started yet, value is 0
        dataPoint[`${scenario.name}Value`] = matchingYear ? matchingYear.totalValue : 0;
        dataPoint[`${scenario.name}Invested`] = matchingYear ? matchingYear.totalInvested : 0;
      });

      mergedData.push(dataPoint);
    }

    return mergedData;
  }, [scenarios, targetAge]);

  const formatCurrency = (value: number) => {
    if (value >= 1000000) {
      return `฿${(value / 1000000).toFixed(1)}M`;
    }
    if (value >= 1000) {
      return `฿${(value / 1000).toFixed(0)}k`;
    }
    return `฿${value}`;
  };

  return (
    <div className="w-full h-80 md:h-96">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={chartData}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" opacity={0.5} />
          <XAxis
            dataKey="age"
            tick={{ fontSize: 12 }}
            label={{ value: 'อายุ (ปี)', position: 'insideBottomRight', offset: -10 }}
          />
          <YAxis
            tickFormatter={formatCurrency}
            tick={{ fontSize: 12 }}
            width={80}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend wrapperStyle={{ paddingTop: '20px' }}/>

          {scenarios.map((scenario) => (
            <Line
              key={scenario.name}
              type="monotone"
              dataKey={`${scenario.name}Value`}
              name={`${scenario.name} (มูลค่ารวม)`}
              stroke={scenario.color}
              strokeWidth={3}
              dot={false}
              activeDot={{ r: 8 }}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
