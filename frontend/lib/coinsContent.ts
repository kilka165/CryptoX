export type Locale = "ru" | "en" | "kk";

// Локализованные описания популярных монет (общеизвестные факты). Ключ — coin.id
// из бэкенд-маппинга (CoinsController::getCoinMapping). Для монет вне списка
// страница показывает общий шаблон из i18n (market.detail.genericAbout).
export const coinDescriptions: Record<string, Record<Locale, string[]>> = {
  bitcoin: {
    ru: [
      "Bitcoin (BTC) — первая и самая известная криптовалюта, запущенная в 2009 году под псевдонимом Сатоши Накамото.",
      "Это децентрализованная сеть на алгоритме Proof of Work с ограниченной эмиссией в 21 миллион монет. Биткоин часто называют «цифровым золотом» и используют как средство сбережения и расчётов.",
    ],
    en: [
      "Bitcoin (BTC) is the first and best-known cryptocurrency, launched in 2009 by the pseudonymous Satoshi Nakamoto.",
      "It is a decentralized Proof of Work network with a capped supply of 21 million coins. Bitcoin is often called 'digital gold' and is used as a store of value and a means of payment.",
    ],
    kk: [
      "Bitcoin (BTC) — 2009 жылы Сатоши Накамото бүркеншік атымен іске қосылған алғашқы әрі ең танымал криптовалюта.",
      "Бұл — эмиссиясы 21 миллион монетамен шектелген, Proof of Work алгоритміндегі орталықсыздандырылған желі. Биткоинді жиі «цифрлық алтын» деп атап, құнды сақтау мен есеп айырысу құралы ретінде пайдаланады.",
    ],
  },
  ethereum: {
    ru: [
      "Ethereum (ETH) — программируемый блокчейн, запущенный в 2015 году. Он позволяет создавать смарт-контракты и децентрализованные приложения (dApps).",
      "В 2022 году сеть перешла на алгоритм Proof of Stake. Монета ETH используется для оплаты комиссий за транзакции и вычисления в сети.",
    ],
    en: [
      "Ethereum (ETH) is a programmable blockchain launched in 2015. It lets developers build smart contracts and decentralized applications (dApps).",
      "In 2022 the network moved to Proof of Stake. ETH is used to pay transaction fees and for computation on the network.",
    ],
    kk: [
      "Ethereum (ETH) — 2015 жылы іске қосылған бағдарламаланатын блокчейн. Ол смарт-келісімшарттар мен орталықсыздандырылған қосымшалар (dApps) құруға мүмкіндік береді.",
      "2022 жылы желі Proof of Stake алгоритміне көшті. ETH монетасы транзакция комиссияларын төлеу мен желідегі есептеулер үшін қолданылады.",
    ],
  },
  binancecoin: {
    ru: [
      "BNB — токен экосистемы Binance, запущенный в 2017 году. Он используется для оплаты комиссий и получения скидок, а также является базовой монетой сети BNB Chain.",
    ],
    en: [
      "BNB is the token of the Binance ecosystem, launched in 2017. It is used to pay fees and get discounts, and it powers the BNB Chain network.",
    ],
    kk: [
      "BNB — 2017 жылы іске қосылған Binance экожүйесінің токені. Ол комиссияларды төлеу мен жеңілдіктер алу үшін қолданылады әрі BNB Chain желісінің негізгі монетасы болып табылады.",
    ],
  },
  solana: {
    ru: [
      "Solana (SOL) — высокопроизводительный блокчейн первого уровня, известный быстрыми и дешёвыми транзакциями.",
      "Сеть сочетает Proof of History и Proof of Stake и популярна для приложений DeFi, NFT и игр.",
    ],
    en: [
      "Solana (SOL) is a high-performance layer-1 blockchain known for fast and cheap transactions.",
      "It combines Proof of History with Proof of Stake and is popular for DeFi, NFT and gaming applications.",
    ],
    kk: [
      "Solana (SOL) — жылдам әрі арзан транзакцияларымен танымал, жоғары өнімді бірінші деңгейлі блокчейн.",
      "Желі Proof of History пен Proof of Stake-ті біріктіреді және DeFi, NFT мен ойын қосымшалары үшін танымал.",
    ],
  },
  ripple: {
    ru: [
      "XRP — цифровой актив реестра XRP Ledger, созданный для быстрых и недорогих международных платежей и расчётов.",
      "Транзакции в сети подтверждаются за несколько секунд, что делает XRP ориентированным на переводы между банками и платёжными системами.",
    ],
    en: [
      "XRP is the digital asset of the XRP Ledger, designed for fast and low-cost cross-border payments and settlement.",
      "Transactions settle within seconds, making XRP focused on transfers between banks and payment providers.",
    ],
    kk: [
      "XRP — жылдам әрі арзан халықаралық төлемдер мен есеп айырысуға арналған XRP Ledger тізілімінің цифрлық активі.",
      "Желідегі транзакциялар бірнеше секундта расталады, бұл XRP-ні банктер мен төлем жүйелері арасындағы аударымдарға бағыттайды.",
    ],
  },
  cardano: {
    ru: [
      "Cardano (ADA) — блокчейн на алгоритме Proof of Stake, который развивается на основе научных исследований и рецензируемых работ.",
      "Сеть поддерживает смарт-контракты, а монета ADA используется для комиссий и стейкинга.",
    ],
    en: [
      "Cardano (ADA) is a Proof of Stake blockchain built on academic research and peer-reviewed work.",
      "The network supports smart contracts, and ADA is used for fees and staking.",
    ],
    kk: [
      "Cardano (ADA) — ғылыми зерттеулер мен рецензияланған еңбектерге негізделіп дамитын Proof of Stake блокчейні.",
      "Желі смарт-келісімшарттарды қолдайды, ал ADA монетасы комиссиялар мен стейкинг үшін пайдаланылады.",
    ],
  },
  dogecoin: {
    ru: [
      "Dogecoin (DOGE) — криптовалюта, появившаяся в 2013 году как шутка на основе популярного мема с собакой породы сиба-ину.",
      "Несмотря на ироничное происхождение, DOGE собрал большое сообщество и работает на алгоритме Proof of Work.",
    ],
    en: [
      "Dogecoin (DOGE) is a cryptocurrency that started in 2013 as a joke based on the popular Shiba Inu dog meme.",
      "Despite its lighthearted origin, DOGE has built a large community and runs on a Proof of Work algorithm.",
    ],
    kk: [
      "Dogecoin (DOGE) — 2013 жылы сиба-ину тұқымды иттің танымал мемі негізінде әзіл ретінде пайда болған криптовалюта.",
      "Әзіл-оспақ шығу тегіне қарамастан, DOGE үлкен қауымдастық жинады және Proof of Work алгоритмінде жұмыс істейді.",
    ],
  },
  tron: {
    ru: [
      "TRON (TRX) — блокчейн, ориентированный на контентные и развлекательные приложения с высокой пропускной способностью.",
      "Сеть широко используется для переводов стейблкоинов, а TRX оплачивает комиссии и ресурсы сети.",
    ],
    en: [
      "TRON (TRX) is a blockchain focused on content and entertainment applications with high throughput.",
      "The network is widely used for stablecoin transfers, and TRX pays for fees and network resources.",
    ],
    kk: [
      "TRON (TRX) — жоғары өткізу қабілеті бар, контент пен ойын-сауық қосымшаларына бағытталған блокчейн.",
      "Желі стейблкоин аударымдары үшін кеңінен қолданылады, ал TRX комиссиялар мен желі ресурстарын төлейді.",
    ],
  },
  polkadot: {
    ru: [
      "Polkadot (DOT) — сеть, объединяющая несколько блокчейнов (парачейнов) для обмена данными и совместимости между ними.",
      "Работает на Proof of Stake; монета DOT используется для управления сетью, стейкинга и подключения парачейнов.",
    ],
    en: [
      "Polkadot (DOT) is a network that connects multiple blockchains (parachains) so they can share data and interoperate.",
      "It runs on Proof of Stake; DOT is used for governance, staking and connecting parachains.",
    ],
    kk: [
      "Polkadot (DOT) — деректермен алмасу мен өзара үйлесімділік үшін бірнеше блокчейнді (парачейндерді) біріктіретін желі.",
      "Proof of Stake негізінде жұмыс істейді; DOT монетасы желіні басқару, стейкинг және парачейндерді қосу үшін қолданылады.",
    ],
  },
  chainlink: {
    ru: [
      "Chainlink (LINK) — децентрализованная сеть оракулов, которая передаёт смарт-контрактам данные из внешнего мира (цены, события и т. д.).",
      "Токен LINK используется для оплаты услуг операторов узлов сети.",
    ],
    en: [
      "Chainlink (LINK) is a decentralized oracle network that feeds real-world data (prices, events and more) to smart contracts.",
      "The LINK token is used to pay the network's node operators for their services.",
    ],
    kk: [
      "Chainlink (LINK) — смарт-келісімшарттарға сыртқы әлемнен деректерді (бағалар, оқиғалар, т. б.) жеткізетін орталықсыздандырылған оракулдар желісі.",
      "LINK токені желі түйіндері операторларының қызметтерін төлеу үшін қолданылады.",
    ],
  },
  litecoin: {
    ru: [
      "Litecoin (LTC) — одна из ранних криптовалют, созданная в 2011 году на основе кода Bitcoin.",
      "Блоки в сети формируются быстрее, чем у биткоина, поэтому LTC иногда называют «серебром» рядом с «золотым» биткоином.",
    ],
    en: [
      "Litecoin (LTC) is one of the early cryptocurrencies, created in 2011 from Bitcoin's code.",
      "Its blocks are produced faster than Bitcoin's, which is why LTC is sometimes called 'silver' to Bitcoin's 'gold'.",
    ],
    kk: [
      "Litecoin (LTC) — 2011 жылы Bitcoin кодының негізінде жасалған алғашқы криптовалюталардың бірі.",
      "Желідегі блоктар биткоинге қарағанда жылдамырақ құрылады, сондықтан LTC-ні кейде «алтын» биткоин қасындағы «күміс» деп атайды.",
    ],
  },
  avalanche: {
    ru: [
      "Avalanche (AVAX) — быстрый блокчейн на Proof of Stake для смарт-контрактов с почти мгновенным подтверждением транзакций.",
      "Платформа поддерживает создание собственных подсетей (subnets) и приложений DeFi.",
    ],
    en: [
      "Avalanche (AVAX) is a fast Proof of Stake smart-contract blockchain with near-instant transaction finality.",
      "The platform supports custom subnets and a range of DeFi applications.",
    ],
    kk: [
      "Avalanche (AVAX) — транзакциялары лезде дерлік расталатын, смарт-келісімшарттарға арналған жылдам Proof of Stake блокчейні.",
      "Платформа жеке ішкі желілерді (subnets) және DeFi қосымшаларын құруды қолдайды.",
    ],
  },
  "shiba-inu": {
    ru: [
      "Shiba Inu (SHIB) — мем-токен на блокчейне Ethereum, запущенный в 2020 году и собравший большое сообщество.",
      "Вокруг SHIB развивается собственная экосистема, включая решения для более дешёвых транзакций.",
    ],
    en: [
      "Shiba Inu (SHIB) is an Ethereum-based meme token launched in 2020 that has gathered a large community.",
      "An ecosystem has grown around SHIB, including solutions for cheaper transactions.",
    ],
    kk: [
      "Shiba Inu (SHIB) — 2020 жылы іске қосылған, үлкен қауымдастық жинаған Ethereum блокчейніндегі мем-токен.",
      "SHIB айналасында арзанырақ транзакцияларға арналған шешімдерді қамтитын жеке экожүйе дамып келеді.",
    ],
  },
  "usd-coin": {
    ru: [
      "USD Coin (USDC) — стейблкоин, привязанный к доллару США в соотношении 1:1 и обеспеченный резервами.",
      "Его используют для расчётов и торговли, чтобы хранить средства в стабильной по цене валюте.",
    ],
    en: [
      "USD Coin (USDC) is a stablecoin pegged 1:1 to the US dollar and backed by reserves.",
      "It is used for payments and trading to hold funds in a price-stable currency.",
    ],
    kk: [
      "USD Coin (USDC) — АҚШ долларына 1:1 қатынаста байланған, резервтермен қамтамасыз етілген стейблкоин.",
      "Оны қаражатты бағасы тұрақты валютада сақтау үшін есеп айырысу мен саудада пайдаланады.",
    ],
  },
  polygon: {
    ru: [
      "Polygon — решение для масштабирования Ethereum, которое делает транзакции дешевле и быстрее.",
      "Сеть совместима с Ethereum и широко используется для приложений DeFi, NFT и игр.",
    ],
    en: [
      "Polygon is an Ethereum scaling solution that makes transactions cheaper and faster.",
      "It is compatible with Ethereum and is widely used for DeFi, NFT and gaming applications.",
    ],
    kk: [
      "Polygon — транзакцияларды арзанырақ әрі жылдамырақ ететін Ethereum-ды масштабтау шешімі.",
      "Желі Ethereum-мен үйлесімді және DeFi, NFT мен ойын қосымшалары үшін кеңінен қолданылады.",
    ],
  },
};
