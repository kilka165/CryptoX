export interface Coin {
  id: string;
  symbol: string;
  name: string;
  image: string;
  current_price: number;
}

export interface UserAsset {
  id: number;
  name: string;
  symbol: string;
  amount: number;
  logo_url: string | null;
}

export interface SelectedCoin {
  coin: Coin;
  amount: string;
}

export interface CurrencyItem {
  id: string;
  symbol: string;
  name: string;
  image: string;
}
