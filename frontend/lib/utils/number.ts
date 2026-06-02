// frontend/lib/utils/number.ts

// Очищает свободный числовой ввод: оставляет только цифры и один десятичный
// разделитель. Запятая принимается как разделитель и приводится к точке.
// Любые прочие символы (буквы, пробелы, знаки) удаляются — так в поле нельзя
// случайно вписать нечисловой текст, из-за которого parseFloat обрезал бы значение.
export function sanitizeDecimalInput(value: string): string {
  let v = value.replace(/,/g, ".").replace(/[^\d.]/g, "");
  const firstDot = v.indexOf(".");
  if (firstDot !== -1) {
    v = v.slice(0, firstDot + 1) + v.slice(firstDot + 1).replace(/\./g, "");
  }
  return v;
}
