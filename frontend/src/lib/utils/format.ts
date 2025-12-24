/**
 * Converts English digits to Persian digits
 */
export const toPersianDigits = (n: number | string): string => {
  return n.toString().replace(/\d/g, d => '۰۱۲۳۴۵۶۷۸۹'[parseInt(d)]);
};

/**
 * Format project metrics
 */
export const formatMetric = (value: string): string => {
  return value.replace(/\d+/g, m => toPersianDigits(m)).replace(/%/g, '٪');
};
