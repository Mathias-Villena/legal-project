
/**
 * Simple Spanish number to words converter for currency descriptions
 */
export const numberToWordsSpanish = (numStr: string): string => {
  const num = parseInt(numStr);
  if (isNaN(num)) return '[Importe en Letras]';
  if (num === 0) return 'cero';
  
  const units = ['', 'un', 'dos', 'tres', 'cuatro', 'cinco', 'seis', 'siete', 'ocho', 'nueve'];
  const teens = ['diez', 'once', 'doce', 'trece', 'catorce', 'quince', 'dieciséis', 'diecisiete', 'dieciocho', 'diecinueve'];
  const tens = ['', '', 'veinte', 'treinta', 'cuarenta', 'cincuenta', 'sesenta', 'setenta', 'ochenta', 'noventa'];
  const hundreds = ['', 'ciento', 'doscientos', 'trescientos', 'cuatrocientos', 'quinientos', 'seiscientos', 'setecientos', 'ochocientos', 'novecientos'];

  const convertThreeDigits = (n: number): string => {
    let output = '';
    if (n >= 100) {
      if (n === 100) return 'cien';
      output += hundreds[Math.floor(n / 100)] + ' ';
      n %= 100;
    }
    if (n >= 20) {
      if (n === 20) {
        output += 'veinte';
      } else if (n < 30) {
        output += 'veinti' + units[n - 20];
      } else {
        output += tens[Math.floor(n / 10)];
        if (n % 10 > 0) output += ' y ' + units[n % 10];
      }
    } else if (n >= 10) {
      output += teens[n - 10];
    } else if (n > 0) {
      output += units[n];
    }
    return output.trim();
  };

  if (num < 1000) return convertThreeDigits(num);
  
  // Basic handling for thousands for this demo
  if (num >= 1000 && num < 1000000) {
    const thousands = Math.floor(num / 1000);
    const remainder = num % 1000;
    const thousandsStr = thousands === 1 ? 'mil' : convertThreeDigits(thousands) + ' mil';
    return (thousandsStr + ' ' + convertThreeDigits(remainder)).trim();
  }

  return numStr; // Fallback for very large numbers
};
