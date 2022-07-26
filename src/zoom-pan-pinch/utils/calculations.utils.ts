/**
 * Rounds number to given decimal
 * eg. roundNumber(2.34343, 1) => 2.3
 */
export function roundNumber(num: number, decimal: number) {
  return Number(num.toFixed(decimal));
}

