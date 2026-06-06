"use client";

import { useState } from "react";
import CompoundInterestChart from "@/components/CompoundInterestChart";
import { CompoundInterestParams, calculateCompoundInterest } from "@/utils/finance";

export default function Home() {
  const [targetAge, setTargetAge] = useState(60);

  const [scenarioA, setScenarioA] = useState<CompoundInterestParams>({
    monthlyInvestment: 5000,
    annualReturnRate: 5,
    startAge: 25,
    stopInvestmentAge: 60,
    endAge: 60,
  });

  const [scenarioB, setScenarioB] = useState<CompoundInterestParams>({
    monthlyInvestment: 5000,
    annualReturnRate: 10,
    startAge: 25,
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

  const formatCurrency = (value: number) => {
    if (value >= 1000000) {
      return `฿${(value / 1000000).toFixed(1)}M`;
    }
    if (value >= 1000) {
      return `฿${(value / 1000).toFixed(1)}k`;
    }
    return `฿${value}`;
  };

  const calculateScenarioResult = (params: CompoundInterestParams, targetAge: number) => {
    const results = calculateCompoundInterest({ ...params, endAge: targetAge });
    const finalYear = results.find(r => r.age === targetAge);
    const invested = finalYear ? finalYear.totalInvested : 0;
    const finalValue = finalYear ? finalYear.totalValue : 0;

    // Protect against division by zero
    const profitPercentage = invested > 0 ? ((finalValue - invested) / invested) * 100 : 0;

    return {
      finalValue,
      profitPercentage
    };
  };

  const resultA = calculateScenarioResult(scenarioA, targetAge);
  const resultB = calculateScenarioResult(scenarioB, targetAge);

  const scenarios = [
    { name: "A", params: scenarioA, color: "var(--color-on-tertiary-container)", baseColor: "var(--color-tertiary-container)" }, // #7f82ff
    { name: "B", params: scenarioB, color: "var(--color-secondary)", baseColor: "var(--color-on-secondary-container)" }, // #006c49
  ];

  return (
    <>
      {/* TopAppBar */}
      <header className="fixed top-0 w-full z-50 bg-surface shadow-sm flex items-center justify-between px-container-padding h-16">
        <div className="flex items-center gap-4">
          <span className="material-symbols-outlined text-primary">menu</span>
          <h1 className="font-headline-md text-primary font-bold">Money 101</h1>
        </div>
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-on-surface-variant">account_circle</span>
        </div>
      </header>

      <main className="pt-20 pb-28 px-container-padding max-w-lg mx-auto space-y-stack-md">
        {/* Intro Section */}
        <section className="space-y-2 mt-4">
          <h2 className="font-headline-lg-mobile text-primary font-bold">พลังดอกเบี้ยทบต้น</h2>
          <p className="font-body-md text-on-surface-variant leading-relaxed">
            การสร้างความมั่งคั่งไม่ได้ขึ้นอยู่กับจำนวนเงินเพียงอย่างเดียว แต่อยู่ที่ <span className="text-secondary font-bold underline decoration-2 underline-offset-4">ระยะเวลา</span> และ <span className="text-secondary font-bold underline decoration-2 underline-offset-4">อัตราผลตอบแทน</span> ที่สม่ำเสมอ
          </p>
        </section>

        {/* Chart Area */}
        <div className="relative w-full aspect-[4/3] bg-surface-container-lowest rounded-[24px] shadow-sm p-stack-md border border-outline-variant overflow-hidden flex flex-col">
          <div className="flex items-center justify-between mb-4 z-10">
            <span className="font-label-md text-outline">แนวโน้มมูลค่าพอร์ต (ล้านบาท)</span>
            <div className="flex gap-4">
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded-full bg-on-tertiary-container"></div>
                <span className="text-[10px] font-bold">A</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded-full bg-secondary"></div>
                <span className="text-[10px] font-bold">B</span>
              </div>
            </div>
          </div>
          <div className="flex-1 w-full h-full relative z-0 mt-2">
             <CompoundInterestChart scenarios={scenarios} targetAge={targetAge} />
          </div>
        </div>

        {/* Global Input: Target Age */}
        <div className="bg-surface-container-low p-stack-md rounded-[24px] space-y-stack-sm">
          <div className="flex justify-between items-center">
            <label className="font-label-md text-primary">ดูผลลัพธ์เมื่อคุณอายุ</label>
            <span className="font-headline-md text-secondary" id="target-age-val">
              {targetAge}
            </span>
          </div>
          <input
            className="w-full h-2 bg-outline-variant rounded-lg appearance-none cursor-pointer accent-secondary"
            id="target-age"
            max="80"
            min="20"
            type="range"
            value={targetAge}
            onChange={(e) => setTargetAge(Number(e.target.value))}
          />
        </div>

        {/* Scenarios Section */}
        <div className="space-y-gutter">
          {/* Scenario A */}
          <div className="bg-surface-container-lowest border border-on-tertiary-container/20 rounded-[24px] p-stack-md shadow-sm space-y-stack-sm transition-all active:scale-[0.98]">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-2 h-6 bg-on-tertiary-container rounded-full"></div>
              <h3 className="font-label-md font-bold uppercase tracking-wider text-on-tertiary-container">Scenario A</h3>
            </div>
            <div className="grid grid-cols-2 gap-gutter">
              <div className="space-y-1">
                <label className="font-label-sm text-outline">ลงทุน/เดือน (฿)</label>
                <input
                  className="w-full h-12 rounded-xl bg-surface border-none text-body-md font-bold text-primary focus:ring-2 focus:ring-on-tertiary-container px-4"
                  type="number"
                  value={scenarioA.monthlyInvestment}
                  onChange={(e) => handleScenarioChange('A', 'monthlyInvestment', e.target.value)}
                />
              </div>
              <div className="space-y-1">
                <label className="font-label-sm text-outline">ผลตอบแทน (%)</label>
                <input
                  className="w-full h-12 rounded-xl bg-surface border-none text-body-md font-bold text-primary focus:ring-2 focus:ring-on-tertiary-container px-4"
                  type="number"
                  value={scenarioA.annualReturnRate}
                  onChange={(e) => handleScenarioChange('A', 'annualReturnRate', e.target.value)}
                />
              </div>
              <div className="space-y-1">
                <label className="font-label-sm text-outline">เริ่มอายุ</label>
                <input
                  className="w-full h-12 rounded-xl bg-surface border-none text-body-md font-bold text-primary focus:ring-2 focus:ring-on-tertiary-container px-4"
                  type="number"
                  value={scenarioA.startAge}
                  onChange={(e) => handleScenarioChange('A', 'startAge', e.target.value)}
                />
              </div>
              <div className="space-y-1">
                <label className="font-label-sm text-outline">หยุดออมอายุ</label>
                <input
                  className="w-full h-12 rounded-xl bg-surface border-none text-body-md font-bold text-primary focus:ring-2 focus:ring-on-tertiary-container px-4"
                  type="number"
                  value={scenarioA.stopInvestmentAge}
                  onChange={(e) => handleScenarioChange('A', 'stopInvestmentAge', e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Scenario B */}
          <div className="bg-surface-container-lowest border border-secondary/20 rounded-[24px] p-stack-md shadow-sm space-y-stack-sm transition-all active:scale-[0.98]">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-2 h-6 bg-secondary rounded-full"></div>
              <h3 className="font-label-md font-bold uppercase tracking-wider text-secondary">Scenario B</h3>
            </div>
            <div className="grid grid-cols-2 gap-gutter">
              <div className="space-y-1">
                <label className="font-label-sm text-outline">ลงทุน/เดือน (฿)</label>
                <input
                  className="w-full h-12 rounded-xl bg-surface border-none text-body-md font-bold text-primary focus:ring-2 focus:ring-secondary px-4"
                  type="number"
                  value={scenarioB.monthlyInvestment}
                  onChange={(e) => handleScenarioChange('B', 'monthlyInvestment', e.target.value)}
                />
              </div>
              <div className="space-y-1">
                <label className="font-label-sm text-outline">ผลตอบแทน (%)</label>
                <input
                  className="w-full h-12 rounded-xl bg-surface border-none text-body-md font-bold text-primary focus:ring-2 focus:ring-secondary px-4"
                  type="number"
                  value={scenarioB.annualReturnRate}
                  onChange={(e) => handleScenarioChange('B', 'annualReturnRate', e.target.value)}
                />
              </div>
              <div className="space-y-1">
                <label className="font-label-sm text-outline">เริ่มอายุ</label>
                <input
                  className="w-full h-12 rounded-xl bg-surface border-none text-body-md font-bold text-primary focus:ring-2 focus:ring-secondary px-4"
                  type="number"
                  value={scenarioB.startAge}
                  onChange={(e) => handleScenarioChange('B', 'startAge', e.target.value)}
                />
              </div>
              <div className="space-y-1">
                <label className="font-label-sm text-outline">หยุดออมอายุ</label>
                <input
                  className="w-full h-12 rounded-xl bg-surface border-none text-body-md font-bold text-primary focus:ring-2 focus:ring-secondary px-4"
                  type="number"
                  value={scenarioB.stopInvestmentAge}
                  onChange={(e) => handleScenarioChange('B', 'stopInvestmentAge', e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Summary Comparison */}
        <div className="flex gap-gutter">
          {/* Summary A */}
          <div className="flex-1 bg-surface-container-highest/50 rounded-[24px] p-gutter border border-outline-variant/50 space-y-2">
            <span className="font-label-sm text-on-tertiary-container block">Scenario A</span>
            <div className="space-y-0">
              <p className="font-label-sm text-outline">มูลค่าสุทธิ</p>
              <p className="font-headline-md text-primary font-bold">{formatCurrency(resultA.finalValue)}</p>
            </div>
            <div className="pt-2 border-t border-outline-variant flex justify-between items-center">
              <span className="text-[10px] text-outline">ดอกเบี้ย</span>
              <span className="text-[10px] font-bold text-on-tertiary-container">+{resultA.profitPercentage.toLocaleString(undefined, {maximumFractionDigits: 0})}%</span>
            </div>
          </div>

          {/* Summary B */}
          <div className="flex-1 bg-secondary-container/10 rounded-[24px] p-gutter border border-secondary/20 space-y-2">
            <span className="font-label-sm text-secondary block">Scenario B</span>
            <div className="space-y-0">
              <p className="font-label-sm text-outline">มูลค่าสุทธิ</p>
              <p className="font-headline-md text-primary font-bold">{formatCurrency(resultB.finalValue)}</p>
            </div>
            <div className="pt-2 border-t border-outline-variant flex justify-between items-center">
              <span className="text-[10px] text-outline">ดอกเบี้ย</span>
              <span className="text-[10px] font-bold text-secondary">+{resultB.profitPercentage.toLocaleString(undefined, {maximumFractionDigits: 0})}%</span>
            </div>
          </div>
        </div>
      </main>

      {/* BottomNavBar */}
      <nav className="fixed bottom-0 left-0 w-full flex justify-around items-center h-20 pb-safe px-4 bg-surface-container-lowest shadow-[0_-2px_10px_rgba(30,41,59,0.05)] rounded-t-[24px] z-50">
        <div className="flex flex-col items-center justify-center bg-secondary-container text-on-secondary-container rounded-full px-5 py-1 transition-transform duration-150 active:scale-95">
          <span className="material-symbols-outlined mb-1">compare_arrows</span>
          <span className="font-label-sm">Comparator</span>
        </div>
        <div className="flex flex-col items-center justify-center text-on-surface-variant px-5 py-1 hover:text-primary transition-transform duration-150 active:scale-95">
          <span className="material-symbols-outlined mb-1">trending_up</span>
          <span className="font-label-sm">Insights</span>
        </div>
        <div className="flex flex-col items-center justify-center text-on-surface-variant px-5 py-1 hover:text-primary transition-transform duration-150 active:scale-95">
          <span className="material-symbols-outlined mb-1">school</span>
          <span className="font-label-sm">Learn</span>
        </div>
      </nav>
    </>
  );
}
