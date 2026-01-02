<?php

namespace App\Http\Controllers;

use App\Models\Asset;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Cache;

class CoinsController extends Controller
{
    /**
     * Получить все популярные монеты с Binance API
     */
    public function index()
{
    try {
        $coins = Cache::remember('binance_coins_list', 300, function () {
            $response = Http::withoutVerifying()
                ->timeout(10)
                ->get('https://api.binance.com/api/v3/ticker/24hr');

            if (!$response->successful()) {
                throw new \Exception('Binance API error: ' . $response->status());
            }

            $allTickers = $response->json();
            $result = [];

            $coinMapping = $this->getCoinMapping();

            foreach ($allTickers as $ticker) {
                if (!str_ends_with($ticker['symbol'], 'USDT')) {
                    continue;
                }

                $symbol = str_replace('USDT', '', $ticker['symbol']);
                $symbolLower = strtolower($symbol);

                if (!isset($coinMapping[$symbolLower])) {
                    continue;
                }

                $coinData = $coinMapping[$symbolLower];
                $lastPrice = floatval($ticker['lastPrice']);
                $quoteVolume = floatval($ticker['quoteVolume']);

                $result[] = [
                    'id' => $coinData['id'],
                    'symbol' => $symbolLower,
                    'name' => $coinData['name'],
                    'image' => "https://cryptologos.cc/logos/{$coinData['slug']}-logo.png",
                    'current_price' => $lastPrice,
                    'price_change_percentage_24h' => floatval($ticker['priceChangePercent']),
                    'market_cap' => $lastPrice * $quoteVolume * 0.01,
                    'total_volume' => $quoteVolume,
                ];
            }

            usort($result, function($a, $b) {
                return $b['total_volume'] <=> $a['total_volume'];
            });

            return $result;
        });

        return response()->json($coins);
    } catch (\Exception $e) {
        \Log::error('CoinsController error: ' . $e->getMessage());
        return response()->json([
            'error' => $e->getMessage(),
            'message' => 'Failed to fetch coins from Binance'
        ], 500);
    }
}

/**
 * Получить цену конкретной монеты
 */
public function getPrice($symbol)
{
    try {
        $response = Http::withoutVerifying()
            ->timeout(5)
            ->get('https://api.binance.com/api/v3/ticker/price', [
                'symbol' => strtoupper($symbol) . 'USDT'
            ]);

        if (!$response->successful()) {
            return response()->json(['error' => 'Symbol not found'], 404);
        }

        return response()->json([
            'symbol' => $symbol,
            'price' => floatval($response->json()['price'])
        ]);
    } catch (\Exception $e) {
        return response()->json(['error' => $e->getMessage()], 500);
    }
}

/**
 * Получить статистику за 24 часа
 */
public function get24hStats($symbol)
{
    try {
        $response = Http::withoutVerifying() // Добавили
            ->timeout(5)
            ->get('https://api.binance.com/api/v3/ticker/24hr', [
                'symbol' => strtoupper($symbol) . 'USDT'
            ]);

        if (!$response->successful()) {
            return response()->json(['error' => 'Symbol not found'], 404);
        }

        return response()->json($response->json());
    } catch (\Exception $e) {
        return response()->json(['error' => $e->getMessage()], 500);
    }
}

/**
 * Маппинг криптовалют
 */
private function getCoinMapping()
{
    return [
        'btc' => ['id' => 'bitcoin', 'name' => 'Bitcoin', 'slug' => 'bitcoin-btc'],
        'eth' => ['id' => 'ethereum', 'name' => 'Ethereum', 'slug' => 'ethereum-eth'],
        'bnb' => ['id' => 'binancecoin', 'name' => 'BNB', 'slug' => 'bnb-bnb'],
        'sol' => ['id' => 'solana', 'name' => 'Solana', 'slug' => 'solana-sol'],
        'xrp' => ['id' => 'ripple', 'name' => 'XRP', 'slug' => 'xrp-xrp'],
        'usdc' => ['id' => 'usd-coin', 'name' => 'USDC', 'slug' => 'usd-coin-usdc'],
        'ada' => ['id' => 'cardano', 'name' => 'Cardano', 'slug' => 'cardano-ada'],
        'doge' => ['id' => 'dogecoin', 'name' => 'Dogecoin', 'slug' => 'dogecoin-doge'],
        'trx' => ['id' => 'tron', 'name' => 'TRON', 'slug' => 'tron-trx'],
        'avax' => ['id' => 'avalanche', 'name' => 'Avalanche', 'slug' => 'avalanche-avax'],
        'shib' => ['id' => 'shiba-inu', 'name' => 'Shiba Inu', 'slug' => 'shiba-inu-shib'],
        'dot' => ['id' => 'polkadot', 'name' => 'Polkadot', 'slug' => 'polkadot-new-dot'],
        'link' => ['id' => 'chainlink', 'name' => 'Chainlink', 'slug' => 'chainlink-link'],
        'matic' => ['id' => 'polygon', 'name' => 'Polygon', 'slug' => 'polygon-matic'],
        'uni' => ['id' => 'uniswap', 'name' => 'Uniswap', 'slug' => 'uniswap-uni'],
        'ltc' => ['id' => 'litecoin', 'name' => 'Litecoin', 'slug' => 'litecoin-ltc'],
        'atom' => ['id' => 'cosmos', 'name' => 'Cosmos', 'slug' => 'cosmos-atom'],
        'etc' => ['id' => 'ethereum-classic', 'name' => 'Ethereum Classic', 'slug' => 'ethereum-classic-etc'],
        'bch' => ['id' => 'bitcoin-cash', 'name' => 'Bitcoin Cash', 'slug' => 'bitcoin-cash-bch'],
        'xlm' => ['id' => 'stellar', 'name' => 'Stellar', 'slug' => 'stellar-xlm'],
        'near' => ['id' => 'near', 'name' => 'NEAR Protocol', 'slug' => 'near-protocol-near'],
        'apt' => ['id' => 'aptos', 'name' => 'Aptos', 'slug' => 'aptos-apt'],
        'hbar' => ['id' => 'hedera', 'name' => 'Hedera', 'slug' => 'hedera-hbar'],
        'fil' => ['id' => 'filecoin', 'name' => 'Filecoin', 'slug' => 'filecoin-fil'],
        'vet' => ['id' => 'vechain', 'name' => 'VeChain', 'slug' => 'vechain-vet'],
        'algo' => ['id' => 'algorand', 'name' => 'Algorand', 'slug' => 'algorand-algo'],
        'icp' => ['id' => 'internet-computer', 'name' => 'Internet Computer', 'slug' => 'internet-computer-icp'],
        'qnt' => ['id' => 'quant', 'name' => 'Quant', 'slug' => 'quant-qnt'],
        'aave' => ['id' => 'aave', 'name' => 'Aave', 'slug' => 'aave-aave'],
        'egld' => ['id' => 'elrond', 'name' => 'MultiversX', 'slug' => 'elrond-egld'],
        'op' => ['id' => 'optimism', 'name' => 'Optimism', 'slug' => 'optimism-ethereum-op'],
        'arb' => ['id' => 'arbitrum', 'name' => 'Arbitrum', 'slug' => 'arbitrum-arb'],
        'eos' => ['id' => 'eos', 'name' => 'EOS', 'slug' => 'eos-eos'],
        'xtz' => ['id' => 'tezos', 'name' => 'Tezos', 'slug' => 'tezos-xtz'],
        'ftm' => ['id' => 'fantom', 'name' => 'Fantom', 'slug' => 'fantom-ftm'],
        'grt' => ['id' => 'the-graph', 'name' => 'The Graph', 'slug' => 'the-graph-grt'],
        'sand' => ['id' => 'the-sandbox', 'name' => 'The Sandbox', 'slug' => 'the-sandbox-sand'],
        'mana' => ['id' => 'decentraland', 'name' => 'Decentraland', 'slug' => 'decentraland-mana'],
        'axs' => ['id' => 'axie-infinity', 'name' => 'Axie Infinity', 'slug' => 'axie-infinity-axs'],
        'theta' => ['id' => 'theta', 'name' => 'Theta Network', 'slug' => 'theta-network-theta'],
        'rune' => ['id' => 'thorchain', 'name' => 'THORChain', 'slug' => 'thorchain-rune'],
        'kava' => ['id' => 'kava', 'name' => 'Kava', 'slug' => 'kava-kava'],
        'zec' => ['id' => 'zcash', 'name' => 'Zcash', 'slug' => 'zcash-zec'],
        'dash' => ['id' => 'dash', 'name' => 'Dash', 'slug' => 'dash-dash'],
        'xmr' => ['id' => 'monero', 'name' => 'Monero', 'slug' => 'monero-xmr'],
        'mkr' => ['id' => 'maker', 'name' => 'Maker', 'slug' => 'maker-mkr'],
        'snx' => ['id' => 'synthetix', 'name' => 'Synthetix', 'slug' => 'synthetix-network-token-snx'],
        'comp' => ['id' => 'compound', 'name' => 'Compound', 'slug' => 'compound-comp'],
        'enj' => ['id' => 'enjincoin', 'name' => 'Enjin Coin', 'slug' => 'enjin-coin-enj'],
        'chz' => ['id' => 'chiliz', 'name' => 'Chiliz', 'slug' => 'chiliz-chz'],
        'bat' => ['id' => 'basic-attention-token', 'name' => 'Basic Attention', 'slug' => 'basic-attention-token-bat'],
        'zil' => ['id' => 'zilliqa', 'name' => 'Zilliqa', 'slug' => 'zilliqa-zil'],
        'waves' => ['id' => 'waves', 'name' => 'Waves', 'slug' => 'waves-waves'],
        'iotx' => ['id' => 'iotex', 'name' => 'IoTeX', 'slug' => 'iotex-iotx'],
        'ont' => ['id' => 'ontology', 'name' => 'Ontology', 'slug' => 'ontology-ont'],
        'icx' => ['id' => 'icon', 'name' => 'ICON', 'slug' => 'icon-icx'],
        'zrx' => ['id' => '0x', 'name' => '0x', 'slug' => '0x-zrx'],
        'rvn' => ['id' => 'ravencoin', 'name' => 'Ravencoin', 'slug' => 'ravencoin-rvn'],
        'qtum' => ['id' => 'qtum', 'name' => 'Qtum', 'slug' => 'qtum-qtum'],
        'omg' => ['id' => 'omg-network', 'name' => 'OMG Network', 'slug' => 'omg-network-omg'],
        'ankr' => ['id' => 'ankr', 'name' => 'Ankr', 'slug' => 'ankr-network-ankr'],
        'celo' => ['id' => 'celo', 'name' => 'Celo', 'slug' => 'celo-celo'],
        'skl' => ['id' => 'skale', 'name' => 'SKALE', 'slug' => 'skale-skl'],
        'storj' => ['id' => 'storj', 'name' => 'Storj', 'slug' => 'storj-storj'],
        'ksm' => ['id' => 'kusama', 'name' => 'Kusama', 'slug' => 'kusama-ksm'],
        'crv' => ['id' => 'curve-dao-token', 'name' => 'Curve DAO', 'slug' => 'curve-dao-token-crv'],
        'yfi' => ['id' => 'yearn-finance', 'name' => 'yearn.finance', 'slug' => 'yearn-finance-yfi'],
        'uma' => ['id' => 'uma', 'name' => 'UMA', 'slug' => 'uma-uma'],
        'bal' => ['id' => 'balancer', 'name' => 'Balancer', 'slug' => 'balancer-bal'],
        'ren' => ['id' => 'ren', 'name' => 'REN', 'slug' => 'ren-ren'],
        'lrc' => ['id' => 'loopring', 'name' => 'Loopring', 'slug' => 'loopring-lrc'],
        'ocean' => ['id' => 'ocean-protocol', 'name' => 'Ocean Protocol', 'slug' => 'ocean-protocol-ocean'],
        'band' => ['id' => 'band-protocol', 'name' => 'Band Protocol', 'slug' => 'band-protocol-band'],
        'nkn' => ['id' => 'nkn', 'name' => 'NKN', 'slug' => 'nkn-nkn'],
        'klay' => ['id' => 'klaytn', 'name' => 'Klaytn', 'slug' => 'klaytn-klay'],
        'rose' => ['id' => 'oasis-network', 'name' => 'Oasis Network', 'slug' => 'oasis-network-rose'],
        'ar' => ['id' => 'arweave', 'name' => 'Arweave', 'slug' => 'arweave-ar'],
        'fet' => ['id' => 'fetch-ai', 'name' => 'Fetch.ai', 'slug' => 'fetch-ai-fet'],
        'inj' => ['id' => 'injective', 'name' => 'Injective', 'slug' => 'injective-protocol-inj'],
        'one' => ['id' => 'harmony', 'name' => 'Harmony', 'slug' => 'harmony-one'],
        'hot' => ['id' => 'holo', 'name' => 'Holo', 'slug' => 'holo-hot'],
        'imx' => ['id' => 'immutablex', 'name' => 'Immutable X', 'slug' => 'immutable-x-imx'],
        'gala' => ['id' => 'gala', 'name' => 'Gala', 'slug' => 'gala-gala'],
        'chr' => ['id' => 'chromia', 'name' => 'Chromia', 'slug' => 'chromaway-chr'],
        'coti' => ['id' => 'coti', 'name' => 'COTI', 'slug' => 'coti-coti'],
        'dent' => ['id' => 'dent', 'name' => 'Dent', 'slug' => 'dent-dent'],
        'ens' => ['id' => 'ethereum-name-service', 'name' => 'ENS', 'slug' => 'ethereum-name-service-ens'],
        'gmt' => ['id' => 'stepn', 'name' => 'STEPN', 'slug' => 'stepn-gmt'],
        'ape' => ['id' => 'apecoin', 'name' => 'ApeCoin', 'slug' => 'apecoin-ape'],
        'ldo' => ['id' => 'lido-dao', 'name' => 'Lido DAO', 'slug' => 'lido-dao-ldo'],
        'mask' => ['id' => 'mask-network', 'name' => 'Mask Network', 'slug' => 'mask-network-mask'],
        'blur' => ['id' => 'blur', 'name' => 'Blur', 'slug' => 'blur-blur'],
        'pepe' => ['id' => 'pepe', 'name' => 'Pepe', 'slug' => 'pepe-pepe'],
        'sui' => ['id' => 'sui', 'name' => 'Sui', 'slug' => 'sui-sui'],
        'sei' => ['id' => 'sei', 'name' => 'Sei', 'slug' => 'sei-network-sei'],
        'tia' => ['id' => 'celestia', 'name' => 'Celestia', 'slug' => 'celestia-tia'],
        'wld' => ['id' => 'worldcoin', 'name' => 'Worldcoin', 'slug' => 'worldcoin-wld'],
        'floki' => ['id' => 'floki', 'name' => 'FLOKI', 'slug' => 'floki-floki'],
        'bonk' => ['id' => 'bonk', 'name' => 'Bonk', 'slug' => 'bonk-bonk'],
        'wif' => ['id' => 'dogwifhat', 'name' => 'dogwifhat', 'slug' => 'dogwifhat-wif'],
        'pyth' => ['id' => 'pyth-network', 'name' => 'Pyth Network', 'slug' => 'pyth-network-pyth'],
        'jup' => ['id' => 'jupiter', 'name' => 'Jupiter', 'slug' => 'jupiter-jup'],
        'strk' => ['id' => 'starknet', 'name' => 'Starknet', 'slug' => 'starknet-strk'],
        'ordi' => ['id' => 'ordinals', 'name' => 'Ordinals', 'slug' => 'ordinals-ordi'],
        'trb' => ['id' => 'tellor', 'name' => 'Tellor', 'slug' => 'tellor-trb'],
        'jto' => ['id' => 'jito', 'name' => 'Jito', 'slug' => 'jito-governance-token-jto'],
        'manta' => ['id' => 'manta-network', 'name' => 'Manta Network', 'slug' => 'manta-network-manta'],
        'alt' => ['id' => 'altlayer', 'name' => 'AltLayer', 'slug' => 'altlayer-alt'],
        'dym' => ['id' => 'dymension', 'name' => 'Dymension', 'slug' => 'dymension-dym'],
        'aevo' => ['id' => 'aevo', 'name' => 'Aevo', 'slug' => 'aevo-aevo'],
        'render' => ['id' => 'render-token', 'name' => 'Render', 'slug' => 'render-token-render'],
        'fet' => ['id' => 'fetch-ai', 'name' => 'Fetch.ai', 'slug' => 'fetch-ai-fet'],
        'woo' => ['id' => 'woo-network', 'name' => 'WOO Network', 'slug' => 'woo-network-woo'],
        'pendle' => ['id' => 'pendle', 'name' => 'Pendle', 'slug' => 'pendle-pendle'],
        'sfp' => ['id' => 'safepal', 'name' => 'SafePal', 'slug' => 'safepal-sfp'],
    ];
}



    /**
     * Получить монету с иконкой по ID (старый метод)
     */
    public function show($coinId)
    {
        try {
            $coin = Cache::remember("coin_{$coinId}", 3600, function () use ($coinId) {
                $data = Http::withoutVerifying()
                    ->get("https://api.coingecko.com/api/v3/coins/{$coinId}")
                    ->json();

                Asset::updateOrCreate(
                    ['name' => $coinId],
                    [
                        'symbol' => strtoupper($data['symbol'] ?? ''),
                        'icon_url' => $data['image']['small'] ?? null,
                        'logo_url' => $data['image']['large'] ?? null,
                    ]
                );

                return $data;
            });

            return response()->json($coin);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    /**
     * Получить все монеты из БД
     */
    public function fromDatabase()
    {
        $assets = Asset::all(['name', 'symbol', 'icon_url', 'logo_url']);
        return response()->json($assets);
    }

    /**
     * Получить иконку конкретной монеты из БД
     */
    public function getCoinIcon($coinId)
    {
        $asset = Asset::where('name', $coinId)->first();

        if (!$asset || !$asset->icon_url) {
            return response()->json(['error' => 'Icon not found'], 404);
        }

        return response()->json([
            'id' => $asset->name,
            'symbol' => $asset->symbol,
            'icon_url' => $asset->icon_url,
            'logo_url' => $asset->logo_url,
        ]);
    }
}
