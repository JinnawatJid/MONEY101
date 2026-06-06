export interface CompoundInterestParams {
  monthlyInvestment: number;
  annualReturnRate: number;
  startAge: number;
  stopInvestmentAge: number;
  endAge: number;
}

export interface CompoundInterestResult {
  age: number;
  totalInvested: number;
  totalValue: number;
}

/**
 * Calculates compound interest year over year
 * Assumes investment is made at the beginning of each month
 * Interest is compounded monthly for more accuracy, but points are returned yearly.
 */
export function calculateCompoundInterest(params: CompoundInterestParams): CompoundInterestResult[] {
  const { monthlyInvestment, annualReturnRate, startAge, stopInvestmentAge, endAge } = params;

  const results: CompoundInterestResult[] = [];

  let currentTotalInvested = 0;
  let currentTotalValue = 0;

  // Convert annual rate to monthly rate (e.g. 6% = 0.06 / 12 = 0.005)
  const monthlyRate = annualReturnRate / 100 / 12;

  // We start tracking from the minimum start age in the comparison,
  // but if this specific scenario hasn't started yet, total = 0

  // Wait, let's just calculate from startAge to endAge. We can pad zeroes later if needed
  // when comparing two scenarios.

  for (let age = startAge; age <= endAge; age++) {
    // For a given year, 12 months pass
    for (let month = 1; month <= 12; month++) {
      // Are we still investing?
      const isInvesting = age < stopInvestmentAge;
      const investmentThisMonth = isInvesting ? monthlyInvestment : 0;

      currentTotalInvested += investmentThisMonth;

      // Add investment, then apply interest on the new total
      // This implements "beginning of month" investment
      currentTotalValue += investmentThisMonth;
      currentTotalValue += currentTotalValue * monthlyRate;
    }

    results.push({
      age,
      totalInvested: Math.round(currentTotalInvested),
      totalValue: Math.round(currentTotalValue)
    });
  }

  return results;
}
