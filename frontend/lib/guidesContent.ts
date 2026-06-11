import { TrendingUp, Shield, Wallet, type LucideIcon } from "lucide-react";

export type Locale = "ru" | "en" | "kk";

export type GuideSection = {
  heading: string;
  body: string[];
  bullets?: string[];
};

export type GuideArticle = {
  intro: string;
  sections: GuideSection[];
  takeaways: string[];
  ctaText: string;
  ctaButton: string;
  ctaHref: string;
};

export type GuideMeta = {
  id: number;
  titleKey: string;
  descKey: string;
  categoryKey: string;
  icon: LucideIcon;
  color: string;
  minutes: number;
};

// Метаданные гайдов — единый источник для списка и детальной страницы.
export const guidesMeta: GuideMeta[] = [
  { id: 1, titleKey: "footerPages.guides.g1Title", descKey: "footerPages.guides.g1Desc", categoryKey: "footerPages.guides.catBeginner", icon: TrendingUp, color: "blue", minutes: 10 },
  { id: 2, titleKey: "footerPages.guides.g2Title", descKey: "footerPages.guides.g2Desc", categoryKey: "footerPages.guides.catSecurity", icon: Shield, color: "green", minutes: 8 },
  { id: 3, titleKey: "footerPages.guides.g3Title", descKey: "footerPages.guides.g3Desc", categoryKey: "footerPages.guides.catAdvanced", icon: TrendingUp, color: "purple", minutes: 15 },
  { id: 4, titleKey: "footerPages.guides.g4Title", descKey: "footerPages.guides.g4Desc", categoryKey: "footerPages.guides.catBeginner", icon: Wallet, color: "yellow", minutes: 7 },
  { id: 5, titleKey: "footerPages.guides.g5Title", descKey: "footerPages.guides.g5Desc", categoryKey: "footerPages.guides.catIntermediate", icon: TrendingUp, color: "red", minutes: 12 },
  { id: 6, titleKey: "footerPages.guides.g6Title", descKey: "footerPages.guides.g6Desc", categoryKey: "footerPages.guides.catAdvanced", icon: Shield, color: "orange", minutes: 13 },
];

// Полные классы Tailwind (без интерполяции `bg-${color}` — иначе не попадают в сборку).
export const colorMap: Record<string, { box: string; icon: string; badge: string }> = {
  blue: {
    box: "bg-blue-100 dark:bg-blue-900/30",
    icon: "text-blue-600",
    badge: "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400",
  },
  green: {
    box: "bg-green-100 dark:bg-green-900/30",
    icon: "text-green-600",
    badge: "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400",
  },
  purple: {
    box: "bg-purple-100 dark:bg-purple-900/30",
    icon: "text-purple-600",
    badge: "bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400",
  },
  yellow: {
    box: "bg-yellow-100 dark:bg-yellow-900/30",
    icon: "text-yellow-600",
    badge: "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400",
  },
  red: {
    box: "bg-red-100 dark:bg-red-900/30",
    icon: "text-red-600",
    badge: "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400",
  },
  orange: {
    box: "bg-orange-100 dark:bg-orange-900/30",
    icon: "text-orange-600",
    badge: "bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400",
  },
};

// Тексты статей. Платформенные детали соответствуют реальности CryptoX.
export const guidesContent: Record<number, Record<Locale, GuideArticle>> = {
  // 1 — Как начать торговать криптовалютой
  1: {
    ru: {
      intro: "Криптовалюта может казаться сложной, но начать торговать проще, чем кажется. Этот гайд проведёт вас по первым шагам на CryptoX — от создания аккаунта до первой покупки.",
      sections: [
        {
          heading: "Шаг 1. Создайте аккаунт и подтвердите e-mail",
          body: ["Зарегистрируйтесь, указав имя, e-mail и надёжный пароль. После регистрации на почту придёт код подтверждения — введите его, чтобы активировать аккаунт. Подтверждённый e-mail нужен для входа и восстановления доступа."],
        },
        {
          heading: "Шаг 2. Пополните баланс",
          body: ["Перейдите в раздел пополнения и внесите средства. Пополнение баланса на CryptoX бесплатно — комиссия не списывается."],
        },
        {
          heading: "Шаг 3. Выберите криптовалюту",
          body: ["Откройте раздел «Рынок»: там список монет с ценами и графиками. Изучите динамику цены, прежде чем покупать. Новичкам обычно понятнее крупные монеты — например, Bitcoin (BTC) или Ethereum (ETH)."],
        },
        {
          heading: "Шаг 4. Совершите первую сделку",
          body: ["Выберите монету, укажите сумму и подтвердите покупку. За торговую операцию удерживается комиссия 1%. Купленный актив появится в вашем профиле."],
        },
        {
          heading: "Шаг 5. Следите за портфелем и защитите аккаунт",
          body: ["В профиле видны ваши активы, баланс и история операций. Сразу включите двухфакторную аутентификацию (2FA) в настройках — это защитит аккаунт и снимет дневной лимит вывода $1000."],
        },
      ],
      takeaways: [
        "Подтверждённый e-mail обязателен для входа и восстановления доступа.",
        "Пополнение бесплатно, комиссия за сделку — 1%.",
        "Начинайте с небольших сумм и понятных монет.",
        "Включите 2FA сразу после регистрации.",
      ],
      ctaText: "Готовы начать? Откройте рынок и изучите доступные монеты.",
      ctaButton: "Перейти к рынку",
      ctaHref: "/market",
    },
    en: {
      intro: "Crypto can look intimidating, but getting started is easier than it seems. This guide walks you through your first steps on CryptoX — from creating an account to your first purchase.",
      sections: [
        {
          heading: "Step 1. Create an account and confirm your e-mail",
          body: ["Sign up with your name, e-mail and a strong password. After registration a confirmation code is sent to your inbox — enter it to activate your account. A confirmed e-mail is required for login and account recovery."],
        },
        {
          heading: "Step 2. Top up your balance",
          body: ["Go to the deposit section and add funds. Deposits on CryptoX are free — no fee is charged."],
        },
        {
          heading: "Step 3. Choose a cryptocurrency",
          body: ["Open the Market section: it lists coins with prices and charts. Review the price history before buying. Beginners often find major coins easier to follow — for example Bitcoin (BTC) or Ethereum (ETH)."],
        },
        {
          heading: "Step 4. Make your first trade",
          body: ["Pick a coin, enter an amount and confirm the purchase. A 1% fee applies to trading operations. The asset you bought appears in your profile."],
        },
        {
          heading: "Step 5. Track your portfolio and secure your account",
          body: ["Your profile shows your assets, balance and operation history. Enable two-factor authentication (2FA) in settings right away — it protects your account and removes the $1000 daily withdrawal limit."],
        },
      ],
      takeaways: [
        "A confirmed e-mail is required for login and recovery.",
        "Deposits are free; the trading fee is 1%.",
        "Start with small amounts and well-known coins.",
        "Turn on 2FA right after registration.",
      ],
      ctaText: "Ready to begin? Open the market and explore the available coins.",
      ctaButton: "Go to market",
      ctaHref: "/market",
    },
    kk: {
      intro: "Криптовалюта күрделі болып көрінуі мүмкін, бірақ сауда бастау ойлағаннан оңай. Бұл нұсқаулық сізді CryptoX-тегі алғашқы қадамдармен — аккаунт құрудан бастап алғашқы сатып алуға дейін — алып жүреді.",
      sections: [
        {
          heading: "1-қадам. Аккаунт құрып, e-mail растаңыз",
          body: ["Атыңызды, e-mail мен сенімді құпиясөзді көрсетіп тіркеліңіз. Тіркелуден кейін поштаға растау коды келеді — аккаунтты белсендіру үшін оны енгізіңіз. Расталған e-mail кіру мен қол жеткізуді қалпына келтіру үшін қажет."],
        },
        {
          heading: "2-қадам. Балансты толтырыңыз",
          body: ["Толықтыру бөліміне өтіп, қаражат енгізіңіз. CryptoX-те балансты толтыру тегін — комиссия алынбайды."],
        },
        {
          heading: "3-қадам. Криптовалютаны таңдаңыз",
          body: ["«Нарық» бөлімін ашыңыз: онда бағалары мен графиктері бар монеталар тізімі бар. Сатып алмас бұрын баға динамикасын қараңыз. Жаңадан бастаушыларға ірі монеталар — мысалы Bitcoin (BTC) немесе Ethereum (ETH) — түсініктірек."],
        },
        {
          heading: "4-қадам. Алғашқы мәмілені жасаңыз",
          body: ["Монетаны таңдап, соманы көрсетіп, сатып алуды растаңыз. Сауда операциясы үшін 1% комиссия алынады. Сатып алынған актив профиліңізде көрінеді."],
        },
        {
          heading: "5-қадам. Портфельді бақылап, аккаунтты қорғаңыз",
          body: ["Профильде активтеріңіз, балансыңыз және операциялар тарихы көрінеді. Бірден баптаулардан екі факторлы аутентификацияны (2FA) қосыңыз — бұл аккаунтты қорғайды әрі тәуліктік $1000 шығару лимитін алып тастайды."],
        },
      ],
      takeaways: [
        "Расталған e-mail кіру мен қалпына келтіру үшін міндетті.",
        "Толықтыру тегін, сауда комиссиясы — 1%.",
        "Шағын сомалардан және түсінікті монеталардан бастаңыз.",
        "Тіркелгеннен кейін бірден 2FA қосыңыз.",
      ],
      ctaText: "Бастауға дайынсыз ба? Нарықты ашып, қолжетімді монеталарды қараңыз.",
      ctaButton: "Нарыққа өту",
      ctaHref: "/market",
    },
  },

  // 2 — Как обезопасить свой криптокошелёк
  2: {
    ru: {
      intro: "Безопасность аккаунта — это в первую очередь ваши привычки. Несколько простых правил защитят ваши средства от большинства угроз.",
      sections: [
        {
          heading: "Надёжный пароль",
          body: ["Используйте уникальный пароль минимум из 8 символов с буквами разного регистра, цифрами и спецсимволом. Не используйте один и тот же пароль на разных сайтах."],
        },
        {
          heading: "Включите двухфакторную аутентификацию (2FA)",
          body: ["2FA добавляет второй фактор входа — одноразовый код из приложения Google Authenticator. Включить её можно в настройках аккаунта. С активной 2FA снимается дневной лимит вывода $1000."],
        },
        {
          heading: "Подтверждённый e-mail",
          body: ["E-mail подтверждается кодом при регистрации и используется для сброса пароля. Не теряйте доступ к почте и по возможности защитите её собственной 2FA."],
        },
        {
          heading: "Остерегайтесь фишинга",
          body: ["CryptoX никогда не попросит ваш пароль или 2FA-код. Открывайте сайт только из доверенных закладок и проверяйте адрес в браузере."],
          bullets: [
            "Не переходите по ссылкам из подозрительных писем и SMS",
            "Остерегайтесь поддельных сайтов-двойников и приложений",
            "При любых сомнениях пишите в официальную поддержку",
          ],
        },
        {
          heading: "Контролируйте активность",
          body: ["Регулярно проверяйте историю операций в профиле и выходите из аккаунта на чужих устройствах. О любой подозрительной активности сразу сообщайте в поддержку."],
        },
      ],
      takeaways: [
        "Уникальный сложный пароль — основа защиты.",
        "2FA обязательна: и безопаснее, и снимает лимит вывода.",
        "CryptoX никогда не спрашивает пароль или код 2FA.",
        "Проверяйте историю операций и выходите на чужих устройствах.",
      ],
      ctaText: "Защитите аккаунт прямо сейчас — включите 2FA в настройках.",
      ctaButton: "Открыть настройки",
      ctaHref: "/settings",
    },
    en: {
      intro: "Account security comes down mostly to your habits. A few simple rules protect your funds from the majority of threats.",
      sections: [
        {
          heading: "A strong password",
          body: ["Use a unique password of at least 8 characters with mixed-case letters, digits and a special character. Never reuse the same password across different sites."],
        },
        {
          heading: "Enable two-factor authentication (2FA)",
          body: ["2FA adds a second login factor — a one-time code from the Google Authenticator app. You can turn it on in your account settings. With 2FA active, the $1000 daily withdrawal limit is removed."],
        },
        {
          heading: "A confirmed e-mail",
          body: ["Your e-mail is confirmed with a code at registration and is used for password resets. Keep access to your inbox and, if possible, protect it with its own 2FA."],
        },
        {
          heading: "Beware of phishing",
          body: ["CryptoX will never ask for your password or 2FA code. Open the site only from trusted bookmarks and check the address in your browser."],
          bullets: [
            "Don't follow links from suspicious e-mails or SMS",
            "Watch out for fake look-alike sites and apps",
            "When in doubt, contact official support",
          ],
        },
        {
          heading: "Monitor your activity",
          body: ["Regularly review your operation history in the profile and log out on shared devices. Report any suspicious activity to support immediately."],
        },
      ],
      takeaways: [
        "A unique, strong password is the foundation of security.",
        "2FA is a must: safer, and it removes the withdrawal limit.",
        "CryptoX never asks for your password or 2FA code.",
        "Check your operation history and log out on other devices.",
      ],
      ctaText: "Secure your account now — enable 2FA in settings.",
      ctaButton: "Open settings",
      ctaHref: "/settings",
    },
    kk: {
      intro: "Аккаунт қауіпсіздігі ең алдымен сіздің әдеттеріңізге байланысты. Бірнеше қарапайым ереже қаражатыңызды қауіптердің көпшілігінен қорғайды.",
      sections: [
        {
          heading: "Сенімді құпиясөз",
          body: ["Кемінде 8 таңбадан тұратын, әртүрлі регистрдегі әріптері, сандары мен арнайы таңбасы бар бірегей құпиясөз қолданыңыз. Бір құпиясөзді әртүрлі сайттарда пайдаланбаңыз."],
        },
        {
          heading: "Екі факторлы аутентификацияны (2FA) қосыңыз",
          body: ["2FA кіруге екінші фактор қосады — Google Authenticator қосымшасынан алынатын бір реттік код. Оны аккаунт баптауларынан қосуға болады. 2FA белсенді болса, тәуліктік $1000 шығару лимиті алынып тасталады."],
        },
        {
          heading: "Расталған e-mail",
          body: ["E-mail тіркелу кезінде кодпен расталады және құпиясөзді қалпына келтіру үшін қолданылады. Поштаға қол жеткізуді жоғалтпаңыз және мүмкіндігінше оны жеке 2FA-мен қорғаңыз."],
        },
        {
          heading: "Фишингтен сақ болыңыз",
          body: ["CryptoX ешқашан құпиясөзіңізді немесе 2FA кодын сұрамайды. Сайтты тек сенімді бетбелгілерден ашып, браузердегі мекенжайды тексеріңіз."],
          bullets: [
            "Күдікті хаттар мен SMS-тегі сілтемелерге өтпеңіз",
            "Жалған ұқсас сайттар мен қосымшалардан сақ болыңыз",
            "Күмән туса, ресми қолдау қызметіне жазыңыз",
          ],
        },
        {
          heading: "Белсенділікті бақылаңыз",
          body: ["Профильдегі операциялар тарихын үнемі тексеріп, бөгде құрылғыларда аккаунттан шығыңыз. Кез келген күдікті әрекет туралы қолдау қызметіне бірден хабарлаңыз."],
        },
      ],
      takeaways: [
        "Бірегей әрі күрделі құпиясөз — қорғаныстың негізі.",
        "2FA міндетті: әрі қауіпсіз, әрі шығару лимитін алып тастайды.",
        "CryptoX ешқашан құпиясөз бен 2FA кодын сұрамайды.",
        "Операциялар тарихын тексеріп, бөгде құрылғыларда шығыңыз.",
      ],
      ctaText: "Аккаунтты дәл қазір қорғаңыз — баптаулардан 2FA қосыңыз.",
      ctaButton: "Баптауларды ашу",
      ctaHref: "/settings",
    },
  },

  // 3 — Понимание технического анализа
  3: {
    ru: {
      intro: "Технический анализ (ТА) — это изучение графиков цен для поиска закономерностей. Он не гарантирует результат, но помогает принимать более обоснованные решения.",
      sections: [
        {
          heading: "Свечной график",
          body: ["Каждая свеча показывает цену открытия, закрытия, максимум и минимум за период. Зелёные свечи — рост, красные — падение. Свечи складываются в паттерны, по которым трейдеры оценивают настроение рынка."],
        },
        {
          heading: "Поддержка и сопротивление",
          body: ["Поддержка — уровень, где цену часто «подхватывают» покупатели; сопротивление — где её сдерживают продавцы. Эти уровни помогают планировать точки входа и выхода."],
        },
        {
          heading: "Тренд и объём",
          body: ["Тренд — общее направление движения цены (вверх, вниз или вбок). Объём показывает силу движения: рост на большом объёме надёжнее, чем на малом."],
        },
        {
          heading: "Основные индикаторы",
          body: ["Индикаторы — вспомогательные расчёты поверх цены:"],
          bullets: [
            "Скользящие средние (MA) сглаживают цену и показывают тренд",
            "RSI измеряет перекупленность и перепроданность",
            "MACD помогает увидеть смену импульса",
          ],
        },
        {
          heading: "Ограничения технического анализа",
          body: ["Никакой анализ не предсказывает будущее на 100%. Крипторынок очень волатилен, и новости могут резко менять цену. Используйте ТА вместе с управлением рисками, а не вместо него. На CryptoX график цены доступен на странице каждой монеты в разделе «Рынок»."],
        },
      ],
      takeaways: [
        "Свечи, уровни и тренд — база технического анализа.",
        "Объём подтверждает силу движения цены.",
        "Индикаторы (MA, RSI, MACD) — вспомогательные, а не точные сигналы.",
        "ТА не гарантирует результат; сочетайте его с управлением рисками.",
      ],
      ctaText: "Посмотрите графики цен на странице любой монеты.",
      ctaButton: "Открыть рынок",
      ctaHref: "/market",
    },
    en: {
      intro: "Technical analysis (TA) is the study of price charts to spot patterns. It doesn't guarantee outcomes, but it helps you make more informed decisions.",
      sections: [
        {
          heading: "The candlestick chart",
          body: ["Each candle shows the open, close, high and low price for a period. Green candles mean a rise, red candles a fall. Candles form patterns that traders use to gauge market sentiment."],
        },
        {
          heading: "Support and resistance",
          body: ["Support is a level where buyers tend to step in; resistance is where sellers hold the price back. These levels help you plan entry and exit points."],
        },
        {
          heading: "Trend and volume",
          body: ["A trend is the overall direction of price movement (up, down or sideways). Volume shows the strength of a move: a rise on high volume is more reliable than one on low volume."],
        },
        {
          heading: "Key indicators",
          body: ["Indicators are helper calculations layered on top of price:"],
          bullets: [
            "Moving averages (MA) smooth the price and reveal the trend",
            "RSI measures overbought and oversold conditions",
            "MACD helps you see shifts in momentum",
          ],
        },
        {
          heading: "The limits of technical analysis",
          body: ["No analysis predicts the future with certainty. The crypto market is highly volatile, and news can move prices sharply. Use TA alongside risk management, not instead of it. On CryptoX, a price chart is available on each coin's page in the Market section."],
        },
      ],
      takeaways: [
        "Candles, levels and trend are the basics of technical analysis.",
        "Volume confirms the strength of a price move.",
        "Indicators (MA, RSI, MACD) are aids, not exact signals.",
        "TA guarantees nothing; pair it with risk management.",
      ],
      ctaText: "Check the price charts on any coin's page.",
      ctaButton: "Open market",
      ctaHref: "/market",
    },
    kk: {
      intro: "Техникалық талдау (ТТ) — заңдылықтарды табу үшін баға графиктерін зерттеу. Ол нәтижеге кепілдік бермейді, бірақ негізделгенірек шешім қабылдауға көмектеседі.",
      sections: [
        {
          heading: "Шам графигі",
          body: ["Әр шам кезең ішіндегі ашылу, жабылу бағасын, ең жоғары және ең төмен деңгейді көрсетеді. Жасыл шамдар — өсу, қызыл шамдар — төмендеу. Шамдар трейдерлер нарық көңіл күйін бағалайтын паттерндерге құралады."],
        },
        {
          heading: "Қолдау мен кедергі",
          body: ["Қолдау — бағаны сатып алушылар жиі «көтеретін» деңгей; кедергі — оны сатушылар ұстап тұратын деңгей. Бұл деңгейлер кіру мен шығу нүктелерін жоспарлауға көмектеседі."],
        },
        {
          heading: "Тренд пен көлем",
          body: ["Тренд — баға қозғалысының жалпы бағыты (жоғары, төмен немесе бүйірлік). Көлем қозғалыс күшін көрсетеді: жоғары көлемдегі өсу аз көлемдегіге қарағанда сенімдірек."],
        },
        {
          heading: "Негізгі индикаторлар",
          body: ["Индикаторлар — баға үстіне салынатын қосалқы есептеулер:"],
          bullets: [
            "Жылжымалы орташалар (MA) бағаны тегістеп, трендті көрсетеді",
            "RSI шамадан тыс сатып алу мен сатуды өлшейді",
            "MACD импульстің өзгеруін көруге көмектеседі",
          ],
        },
        {
          heading: "Техникалық талдаудың шектеулері",
          body: ["Ешқандай талдау болашақты 100% болжай алмайды. Криптонарық өте құбылмалы, жаңалықтар бағаны күрт өзгертуі мүмкін. ТТ-ны тәуекелді басқарумен бірге қолданыңыз, оның орнына емес. CryptoX-те баға графигі әр монета бетінде «Нарық» бөлімінде қолжетімді."],
        },
      ],
      takeaways: [
        "Шамдар, деңгейлер мен тренд — техникалық талдаудың негізі.",
        "Көлем баға қозғалысының күшін растайды.",
        "Индикаторлар (MA, RSI, MACD) — дәл сигнал емес, көмекші құрал.",
        "ТТ нәтижеге кепілдік бермейді; оны тәуекелді басқарумен ұштастырыңыз.",
      ],
      ctaText: "Кез келген монета бетіндегі баға графиктерін қараңыз.",
      ctaButton: "Нарықты ашу",
      ctaHref: "/market",
    },
  },

  // 4 — Что такое стейкинг криптовалюты
  4: {
    ru: {
      intro: "Стейкинг — это способ получать пассивный доход, удерживая криптовалюту. Разберём, как он работает и что важно учитывать.",
      sections: [
        {
          heading: "Что такое стейкинг",
          body: ["Многие блокчейны работают на алгоритме Proof of Stake: участники «замораживают» монеты, помогая сети обрабатывать транзакции, и получают за это вознаграждение. Стейкинг похож на проценты по вкладу, но с криптовалютными рисками."],
        },
        {
          heading: "Как начисляется доход",
          body: ["Доход зависит от монеты, суммы и срока. Вознаграждение обычно выражается в годовой ставке и начисляется в той же монете, которую вы застейкали."],
        },
        {
          heading: "Сроки и блокировка",
          body: ["Часть программ предполагает блокировку средств на фиксированный срок — в это время вывести монеты нельзя. Внимательно читайте условия перед началом."],
        },
        {
          heading: "Риски",
          body: ["Стейкинг не убирает рыночный риск: пока монеты заблокированы, их цена может упасть."],
          bullets: [
            "Цена монеты может снизиться за время блокировки",
            "Ставка вознаграждения может измениться",
            "Замороженные средства недоступны до конца срока",
          ],
        },
        {
          heading: "Как застейкать на CryptoX",
          body: ["Перейдите в раздел «Стейкинг», выберите подходящий план и сумму, ознакомьтесь с условиями и подтвердите. Активные позиции и начисления будут видны там же."],
        },
      ],
      takeaways: [
        "Стейкинг — пассивный доход за удержание монет в сети PoS.",
        "Доход начисляется в той же монете и не гарантирован.",
        "Учитывайте срок блокировки и рыночный риск.",
        "Стейкинг доступен в разделе «Стейкинг» на CryptoX.",
      ],
      ctaText: "Изучите доступные планы стейкинга.",
      ctaButton: "Перейти к стейкингу",
      ctaHref: "/staking",
    },
    en: {
      intro: "Staking is a way to earn passive income by holding cryptocurrency. Let's break down how it works and what to keep in mind.",
      sections: [
        {
          heading: "What staking is",
          body: ["Many blockchains run on the Proof of Stake algorithm: participants lock up coins to help the network process transactions and receive a reward for it. Staking is similar to interest on a deposit, but with crypto risks."],
        },
        {
          heading: "How rewards accrue",
          body: ["Returns depend on the coin, the amount and the term. The reward is usually expressed as an annual rate and is paid in the same coin you staked."],
        },
        {
          heading: "Terms and lock-up",
          body: ["Some programs lock your funds for a fixed term — during which you cannot withdraw the coins. Read the terms carefully before you start."],
        },
        {
          heading: "Risks",
          body: ["Staking does not remove market risk: while your coins are locked, their price can fall."],
          bullets: [
            "The coin's price may drop during the lock-up period",
            "The reward rate may change",
            "Locked funds are unavailable until the term ends",
          ],
        },
        {
          heading: "How to stake on CryptoX",
          body: ["Go to the Staking section, choose a suitable plan and amount, review the terms and confirm. Your active positions and rewards are shown in the same place."],
        },
      ],
      takeaways: [
        "Staking is passive income for holding coins in a PoS network.",
        "Rewards are paid in the same coin and are not guaranteed.",
        "Account for the lock-up term and market risk.",
        "Staking is available in the Staking section on CryptoX.",
      ],
      ctaText: "Explore the available staking plans.",
      ctaButton: "Go to staking",
      ctaHref: "/staking",
    },
    kk: {
      intro: "Стейкинг — криптовалютаны ұстау арқылы пассивті табыс табу тәсілі. Оның қалай жұмыс істейтінін және нені ескеру керектігін қарастырайық.",
      sections: [
        {
          heading: "Стейкинг дегеніміз не",
          body: ["Көптеген блокчейндер Proof of Stake алгоритмімен жұмыс істейді: қатысушылар монеталарды «бұғаттап», желіге транзакцияларды өңдеуге көмектеседі және ол үшін сыйақы алады. Стейкинг салым пайызына ұқсас, бірақ крипто тәуекелдерімен."],
        },
        {
          heading: "Табыс қалай есептеледі",
          body: ["Табыс монетаға, сомаға және мерзімге байланысты. Сыйақы әдетте жылдық мөлшерлемемен көрсетіледі және сіз стейкингке салған сол монетамен есептеледі."],
        },
        {
          heading: "Мерзімдер мен бұғаттау",
          body: ["Кейбір бағдарламалар қаражатты белгіленген мерзімге бұғаттауды көздейді — бұл уақытта монеталарды шығаруға болмайды. Бастамас бұрын шарттарды мұқият оқыңыз."],
        },
        {
          heading: "Тәуекелдер",
          body: ["Стейкинг нарықтық тәуекелді жоймайды: монеталар бұғатталып тұрғанда олардың бағасы түсуі мүмкін."],
          bullets: [
            "Монета бағасы бұғаттау кезінде төмендеуі мүмкін",
            "Сыйақы мөлшерлемесі өзгеруі мүмкін",
            "Бұғатталған қаражат мерзім аяқталғанша қолжетімсіз",
          ],
        },
        {
          heading: "CryptoX-те қалай стейкинг жасау керек",
          body: ["«Стейкинг» бөліміне өтіп, қолайлы жоспар мен соманы таңдап, шарттармен танысып, растаңыз. Белсенді позициялар мен есептеулер сол жерде көрінеді."],
        },
      ],
      takeaways: [
        "Стейкинг — PoS желісінде монеталарды ұстағаны үшін пассивті табыс.",
        "Табыс сол монетамен есептеледі және кепілдендірілмеген.",
        "Бұғаттау мерзімі мен нарықтық тәуекелді ескеріңіз.",
        "Стейкинг CryptoX-те «Стейкинг» бөлімінде қолжетімді.",
      ],
      ctaText: "Қолжетімді стейкинг жоспарларын қараңыз.",
      ctaButton: "Стейкингке өту",
      ctaHref: "/staking",
    },
  },

  // 5 — P2P торговля: полное руководство
  5: {
    ru: {
      intro: "P2P (peer-to-peer) — это торговля криптовалютой напрямую между пользователями. Разберём, как она устроена и как торговать безопасно.",
      sections: [
        {
          heading: "Что такое P2P",
          body: ["В P2P покупатель и продавец договариваются друг с другом, а платформа сводит их и помогает провести сделку. Это удобный способ прямого обмена между пользователями."],
        },
        {
          heading: "Как это работает на CryptoX",
          body: ["В разделе P2P можно просматривать предложения других пользователей или создавать свои — с указанием суммы и условий. Вы выбираете подходящее предложение и проводите сделку с контрагентом."],
        },
        {
          heading: "Безопасная торговля",
          body: ["Внимательно проверяйте условия сделки и репутацию контрагента."],
          bullets: [
            "Не уходите за пределы платформы для договорённостей",
            "Проверяйте суммы и детали перед подтверждением",
            "Не спешите: «слишком выгодные» предложения опасны",
          ],
        },
        {
          heading: "Частые ошибки новичков",
          body: ["Спешка, невнимательность к условиям и доверие незнакомцам вне платформы — главные причины проблем. Действуйте спокойно и по правилам."],
        },
      ],
      takeaways: [
        "P2P — прямой обмен криптовалютой между пользователями.",
        "На CryptoX можно смотреть и создавать предложения в разделе P2P.",
        "Проверяйте условия и контрагента, не выходите за пределы платформы.",
        "Не доверяйте «слишком выгодным» предложениям.",
      ],
      ctaText: "Посмотрите доступные P2P-предложения.",
      ctaButton: "Перейти к P2P",
      ctaHref: "/p2p",
    },
    en: {
      intro: "P2P (peer-to-peer) is trading cryptocurrency directly between users. Let's look at how it works and how to trade safely.",
      sections: [
        {
          heading: "What P2P is",
          body: ["In P2P, the buyer and seller agree with each other, while the platform brings them together and helps carry out the deal. It's a convenient way to exchange directly between users."],
        },
        {
          heading: "How it works on CryptoX",
          body: ["In the P2P section you can browse offers from other users or create your own — specifying the amount and terms. You pick a suitable offer and complete the deal with your counterparty."],
        },
        {
          heading: "Trading safely",
          body: ["Check the deal terms and the counterparty's reputation carefully."],
          bullets: [
            "Don't move off the platform to make arrangements",
            "Verify amounts and details before confirming",
            "Don't rush: offers that look too good are risky",
          ],
        },
        {
          heading: "Common beginner mistakes",
          body: ["Rushing, ignoring the terms, and trusting strangers outside the platform are the main causes of trouble. Act calmly and by the rules."],
        },
      ],
      takeaways: [
        "P2P is a direct crypto exchange between users.",
        "On CryptoX you can view and create offers in the P2P section.",
        "Check the terms and counterparty; stay on the platform.",
        "Don't trust offers that look too good to be true.",
      ],
      ctaText: "Browse the available P2P offers.",
      ctaButton: "Go to P2P",
      ctaHref: "/p2p",
    },
    kk: {
      intro: "P2P (peer-to-peer) — криптовалютаны пайдаланушылар арасында тікелей сату. Оның қалай ұйымдастырылғанын және қауіпсіз сауда жасауды қарастырайық.",
      sections: [
        {
          heading: "P2P дегеніміз не",
          body: ["P2P-де сатып алушы мен сатушы бір-бірімен келіседі, ал платформа оларды біріктіріп, мәмілені жүргізуге көмектеседі. Бұл пайдаланушылар арасында тікелей айырбастаудың ыңғайлы тәсілі."],
        },
        {
          heading: "CryptoX-те қалай жұмыс істейді",
          body: ["P2P бөлімінде басқа пайдаланушылардың ұсыныстарын қарап немесе соманы және шарттарды көрсетіп өз ұсынысыңызды құруға болады. Сіз қолайлы ұсынысты таңдап, контрагентпен мәміле жасайсыз."],
        },
        {
          heading: "Қауіпсіз сауда",
          body: ["Мәміле шарттары мен контрагенттің беделін мұқият тексеріңіз."],
          bullets: [
            "Келісім үшін платформадан тыс шықпаңыз",
            "Растамас бұрын сомалар мен мәліметтерді тексеріңіз",
            "Асықпаңыз: «тым тиімді» ұсыныстар қауіпті",
          ],
        },
        {
          heading: "Жаңадан бастаушылардың жиі қателіктері",
          body: ["Асығыстық, шарттарға мұқият болмау және платформадан тыс бейтаныс адамдарға сену — басты мәселелердің себебі. Сабырмен әрі ережелер бойынша әрекет етіңіз."],
        },
      ],
      takeaways: [
        "P2P — пайдаланушылар арасындағы тікелей крипто айырбас.",
        "CryptoX-те ұсыныстарды P2P бөлімінде қарап әрі құруға болады.",
        "Шарттар мен контрагентті тексеріңіз, платформадан тыс шықпаңыз.",
        "«Тым тиімді» ұсыныстарға сенбеңіз.",
      ],
      ctaText: "Қолжетімді P2P ұсыныстарын қараңыз.",
      ctaButton: "P2P-ге өту",
      ctaHref: "/p2p",
    },
  },

  // 6 — Управление рисками в крипто
  6: {
    ru: {
      intro: "Управление рисками важнее умения «угадывать» рынок. Цель — сохранить капитал в условиях высокой волатильности крипторынка.",
      sections: [
        {
          heading: "Главное правило",
          body: ["Инвестируйте только те деньги, потерю которых вы можете себе позволить. Крипторынок очень волатилен, и цена может резко упасть."],
        },
        {
          heading: "Размер позиции",
          body: ["Не вкладывайте весь капитал в одну сделку. Разумный подход — рисковать лишь небольшой долей средств в каждой позиции, чтобы одна неудача не обнулила счёт."],
        },
        {
          heading: "Диверсификация",
          body: ["Распределяйте средства между несколькими активами вместо ставки на одну монету. Это снижает зависимость от судьбы одного актива."],
        },
        {
          heading: "Дисциплина и эмоции",
          body: ["Заранее определите правила входа и выхода и придерживайтесь их. Страх и жадность — частые причины убытков; не принимайте решений на эмоциях."],
          bullets: [
            "Не «отыгрывайтесь» после убытка",
            "Не гонитесь за резко выросшей ценой (FOMO)",
            "Фиксируйте план до сделки, а не во время неё",
          ],
        },
        {
          heading: "Остерегайтесь чрезмерных обещаний",
          body: ["Гарантированной доходности в крипте не бывает. Будьте осторожны со схемами, обещающими быстрый и «безрисковый» доход."],
        },
      ],
      takeaways: [
        "Вкладывайте только то, что готовы потерять.",
        "Ограничивайте размер каждой позиции и диверсифицируйте.",
        "Действуйте по плану, а не на эмоциях.",
        "Гарантированной доходности не существует.",
      ],
      ctaText: "Применяйте управление рисками на практике.",
      ctaButton: "Перейти к рынку",
      ctaHref: "/market",
    },
    en: {
      intro: "Risk management matters more than the ability to 'guess' the market. The goal is to preserve your capital amid the crypto market's high volatility.",
      sections: [
        {
          heading: "The golden rule",
          body: ["Invest only money you can afford to lose. The crypto market is highly volatile, and prices can fall sharply."],
        },
        {
          heading: "Position size",
          body: ["Don't put all your capital into a single trade. A sensible approach is to risk only a small share of your funds on each position, so one loss doesn't wipe out your account."],
        },
        {
          heading: "Diversification",
          body: ["Spread your funds across several assets instead of betting on a single coin. This reduces your dependence on the fate of any one asset."],
        },
        {
          heading: "Discipline and emotions",
          body: ["Decide your entry and exit rules in advance and stick to them. Fear and greed are common causes of losses; don't make decisions on emotion."],
          bullets: [
            "Don't try to win it back after a loss",
            "Don't chase a sharply risen price (FOMO)",
            "Set your plan before the trade, not during it",
          ],
        },
        {
          heading: "Beware of excessive promises",
          body: ["There is no guaranteed return in crypto. Be wary of schemes promising fast, 'risk-free' profit."],
        },
      ],
      takeaways: [
        "Invest only what you are ready to lose.",
        "Limit the size of each position and diversify.",
        "Act on a plan, not on emotion.",
        "Guaranteed returns do not exist.",
      ],
      ctaText: "Put risk management into practice.",
      ctaButton: "Go to market",
      ctaHref: "/market",
    },
    kk: {
      intro: "Тәуекелді басқару нарықты «болжай білуден» маңыздырақ. Мақсат — криптонарықтың жоғары құбылмалылығы жағдайында капиталды сақтау.",
      sections: [
        {
          heading: "Басты ереже",
          body: ["Тек жоғалтуға шамаңыз келетін ақшаны салыңыз. Криптонарық өте құбылмалы, баға күрт түсуі мүмкін."],
        },
        {
          heading: "Позиция мөлшері",
          body: ["Бүкіл капиталды бір мәмілеге салмаңыз. Дұрыс тәсіл — әр позицияда қаражаттың аз ғана бөлігін тәуекелге қою, сонда бір сәтсіздік шотты нөлге түсірмейді."],
        },
        {
          heading: "Әртараптандыру",
          body: ["Бір монетаға бәс тігудің орнына қаражатты бірнеше активке бөліңіз. Бұл бір активтің тағдырына тәуелділікті азайтады."],
        },
        {
          heading: "Тәртіп пен эмоциялар",
          body: ["Кіру мен шығу ережелерін алдын ала белгілеп, оларды ұстаныңыз. Қорқыныш пен ашкөздік — шығынның жиі себебі; шешімдерді эмоцияға беріліп қабылдамаңыз."],
          bullets: [
            "Шығыннан кейін «қайтарып алуға» тырыспаңыз",
            "Күрт өскен бағаның соңынан қумаңыз (FOMO)",
            "Жоспарды мәмілеге дейін белгілеңіз, кезінде емес",
          ],
        },
        {
          heading: "Шектен тыс уәделерден сақ болыңыз",
          body: ["Криптода кепілдендірілген табыс болмайды. Жылдам әрі «тәуекелсіз» табыс уәде ететін сұлбалардан сақ болыңыз."],
        },
      ],
      takeaways: [
        "Тек жоғалтуға дайын қаражатты салыңыз.",
        "Әр позиция мөлшерін шектеп, әртараптандырыңыз.",
        "Эмоцияға емес, жоспарға сүйеніп әрекет етіңіз.",
        "Кепілдендірілген табыс болмайды.",
      ],
      ctaText: "Тәуекелді басқаруды іс жүзінде қолданыңыз.",
      ctaButton: "Нарыққа өту",
      ctaHref: "/market",
    },
  },
};
