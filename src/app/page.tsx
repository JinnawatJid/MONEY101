"use client";

import { useState } from "react";
import CompoundInterestChart from "@/components/CompoundInterestChart";
import { calculateCompoundInterest, CompoundInterestParams } from "@/utils/finance";
import { Calculator, TrendingUp, Target } from "lucide-react";

export default function Home() {
  const [targetAge, setTargetAge] = useState(60);

  const [scenarioA, setScenarioA] = useState<CompoundInterestParams>({
    monthlyInvestment: 1000,
    annualReturnRate: 1, // ฝากออมทรัพย์
    startAge: 22,
    stopInvestmentAge: 60,
    endAge: 60,
  });

  const [scenarioB, setScenarioB] = useState<CompoundInterestParams>({
    monthlyInvestment: 1000,
    annualReturnRate: 6, // กองทุนรวม
    startAge: 22,
    stopInvestmentAge: 60,
    endAge: 60,
  });

  const handleScenarioChange = (
    scenario: 'A' | 'B',
    field: keyof CompoundInterestParams,
    value: string
  ) => {
    const numValue = Number(value);
    if (scenario === 'A') {
      setScenarioA({ ...scenarioA, [field]: numValue });
    } else {
      setScenarioB({ ...scenarioB, [field]: numValue });
    }
  };

  const scenarios = [
    { name: "นาย A (ฝากเงิน)", params: scenarioA, color: "#ef4444" }, // Red
    { name: "นาย B (ลงทุน)", params: scenarioB, color: "#10b981" }, // Green
  ];

  return (
    <main className="min-h-screen bg-gray-50 text-gray-900 pb-20">
      {/* Header */}
      <header className="bg-blue-900 text-white p-6 shadow-md">
        <div className="max-w-4xl mx-auto flex items-center gap-3">
          <Calculator size={28} />
          <h1 className="text-2xl font-bold">Money 101: พลังดอกเบี้ยทบต้น</h1>
        </div>
      </header>

      <div className="max-w-4xl mx-auto p-4 mt-6">
        {/* Intro */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-8">
          <h2 className="text-lg font-semibold mb-2 flex items-center gap-2">
            <TrendingUp className="text-blue-600" />
            &quot;องศาที่แตกต่าง: ทำไมเวลาและผลตอบแทนถึงสำคัญ?&quot;
          </h2>
          <p className="text-gray-600 text-sm leading-relaxed">
            จำลองสถานการณ์จากหนังสือ Money 101 ลองปรับตัวเลขดูว่า
            การออมเงินในที่ที่ให้ผลตอบแทนต่างกัน หรือการเริ่มลงทุนช้า/เร็ว
            ส่งผลต่อเงินเกษียณของคุณอย่างไร
          </p>
        </div>

        {/* Input Forms */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {/* Scenario A */}
          <div className="bg-white p-5 rounded-xl shadow-sm border border-red-100 border-t-4 border-t-red-500">
            <h3 className="font-bold text-red-600 mb-4 text-lg">นาย A</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">เงินลงทุนต่อเดือน (บาท)</label>
                <input
                  type="number"
                  value={scenarioA.monthlyInvestment}
                  onChange={(e) => handleScenarioChange('A', 'monthlyInvestment', e.target.value)}
                  className="w-full p-2 border rounded-md bg-gray-50"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">ผลตอบแทนคาดหวัง (% ต่อปี)</label>
                <input
                  type="number"
                  value={scenarioA.annualReturnRate}
                  onChange={(e) => handleScenarioChange('A', 'annualReturnRate', e.target.value)}
                  className="w-full p-2 border rounded-md bg-gray-50"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">อายุที่เริ่ม</label>
                  <input
                    type="number"
                    value={scenarioA.startAge}
                    onChange={(e) => handleScenarioChange('A', 'startAge', e.target.value)}
                    className="w-full p-2 border rounded-md bg-gray-50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">อายุที่หยุดลงทุน</label>
                  <input
                    type="number"
                    value={scenarioA.stopInvestmentAge}
                    onChange={(e) => handleScenarioChange('A', 'stopInvestmentAge', e.target.value)}
                    className="w-full p-2 border rounded-md bg-gray-50"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Scenario B */}
          <div className="bg-white p-5 rounded-xl shadow-sm border border-green-100 border-t-4 border-t-green-500">
            <h3 className="font-bold text-green-600 mb-4 text-lg">นาย B</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">เงินลงทุนต่อเดือน (บาท)</label>
                <input
                  type="number"
                  value={scenarioB.monthlyInvestment}
                  onChange={(e) => handleScenarioChange('B', 'monthlyInvestment', e.target.value)}
                  className="w-full p-2 border rounded-md bg-gray-50"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">ผลตอบแทนคาดหวัง (% ต่อปี)</label>
                <input
                  type="number"
                  value={scenarioB.annualReturnRate}
                  onChange={(e) => handleScenarioChange('B', 'annualReturnRate', e.target.value)}
                  className="w-full p-2 border rounded-md bg-gray-50"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">อายุที่เริ่ม</label>
                  <input
                    type="number"
                    value={scenarioB.startAge}
                    onChange={(e) => handleScenarioChange('B', 'startAge', e.target.value)}
                    className="w-full p-2 border rounded-md bg-gray-50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">อายุที่หยุดลงทุน</label>
                  <input
                    type="number"
                    value={scenarioB.stopInvestmentAge}
                    onChange={(e) => handleScenarioChange('B', 'stopInvestmentAge', e.target.value)}
                    className="w-full p-2 border rounded-md bg-gray-50"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Target Age Setting */}
        <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-200 mb-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Target className="text-blue-500" />
            <span className="font-medium">อายุเป้าหมาย (ปีที่จะดูผลลัพธ์)</span>
          </div>
          <input
            type="number"
            value={targetAge}
            onChange={(e) => setTargetAge(Number(e.target.value))}
            className="w-24 p-2 border rounded-md font-bold text-center bg-blue-50"
          />
        </div>

        {/* Chart Section */}
        <div className="bg-white p-2 md:p-6 rounded-xl shadow-sm border border-gray-200 mb-8">
          <h3 className="font-bold text-center mb-6 text-gray-800">กราฟเปรียบเทียบความมั่งคั่ง</h3>
          <CompoundInterestChart scenarios={scenarios} targetAge={targetAge} />
        </div>

        {/* Summary Section */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 mb-8">
          <h3 className="font-bold text-lg mb-4 text-center text-gray-800">สรุปผลเมื่ออายุ {targetAge} ปี</h3>
          <div className="grid md:grid-cols-2 gap-6">
            {scenarios.map((scenario) => {
              const results = calculateCompoundInterest({ ...scenario.params, endAge: targetAge });
              const finalYear = results.find(r => r.age === targetAge);
              const invested = finalYear ? finalYear.totalInvested : 0;
              const finalValue = finalYear ? finalYear.totalValue : 0;
              const profit = finalValue - invested;

              return (
                <div key={scenario.name} className={`p-4 rounded-lg border-2`} style={{ borderColor: scenario.color }}>
                  <h4 className="font-bold text-lg mb-3" style={{ color: scenario.color }}>{scenario.name}</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">เงินต้นทั้งหมด:</span>
                      <span className="font-medium">฿{invested.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">ดอกเบี้ย/ผลตอบแทน:</span>
                      <span className="font-medium text-green-600">+฿{profit.toLocaleString()}</span>
                    </div>
                    <div className="pt-2 border-t mt-2 flex justify-between font-bold text-lg">
                      <span>มูลค่ารวมสุทธิ:</span>
                      <span>฿{finalValue.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </main>
  );
}
