import { SelectedCoin, UserAsset } from "@/types/convert";

export function validateBalances(
  fromCoins: SelectedCoin[],
  userAssets: UserAsset[]
): boolean[] {
  const errors: boolean[] = [];

  for (const fc of fromCoins) {
    const val = parseFloat(fc.amount.replace(",", ".")) || 0;
    const asset = userAssets.find((a) => a.name === fc.coin.id);
    const balance = asset ? asset.amount : 0;
    errors.push(val > balance || val <= 0);
  }

  return errors;
}

export function calculateTotalInCurrency(fromCoins: SelectedCoin[]): number {
  return fromCoins.reduce((sum, fc) => {
    const val = parseFloat(fc.amount.replace(",", ".")) || 0;
    return sum + val * fc.coin.current_price;
  }, 0);
}

export function parseAmount(value: string): string {
  return value.replace(/[^0-9.,]/g, "");
}
