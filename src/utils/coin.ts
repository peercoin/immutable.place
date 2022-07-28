
export function satsToCoinString(sats: bigint, decimals = 6) {

  // Split to coin amount and decimal amount
  const oneCoin = BigInt(10**decimals);
  const coinAmt = sats / oneCoin;
  const decimalAmt = sats % oneCoin;

  // Get decimal string
  let decimalStr = decimalAmt.toString();

  // Add leading zeros to decimals
  const zerosToAdd = decimals - decimalStr.length;
  if (zerosToAdd > 0) {
    decimalStr = "0".repeat(zerosToAdd) + decimalStr;
  }

  // Combine coin and decimal amounts
  return `${coinAmt}.${decimalStr}`;

}

