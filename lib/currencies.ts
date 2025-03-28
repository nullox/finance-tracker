export const currencies = [
  { value: "USD", label: "$ Dollar", locale: "en-US" },
  { value: "EUR", label: "€ Euro", locale: "de-DE" },
  { value: "RUB", label: "₽ Ruble", locale: "ru-RU" },
  { value: "BYN", label: "Br Belarussian Ruble", locale: "ru-BY" },
  { value: "JPY", label: "¥ Yen", locale: "ja-JP" },
  { value: "GBP", label: "£ Pound", locale: "en-GB" },
  { value: "INR", label: "₹ Rupee", locale: "hi-IN" },
  { value: "KRW", label: "₩ Won", locale: "ko-KR" },
  { value: "TRY", label: "₺ Lira", locale: "tr-TR" },
];

export const FALLBACK_CURRENCY = currencies[0];

export type Currency = (typeof currencies)[0];
