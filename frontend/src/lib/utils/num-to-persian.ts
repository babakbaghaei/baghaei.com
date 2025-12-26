/**
 * Converts numbers to Persian words
 */

const yekan = ["", "یک", "دو", "سه", "چهار", "پنج", "شش", "هفت", "هشت", "نه"];
const dahgan = ["", "", "بیست", "سی", "چهل", "پنجاه", "شصت", "هفتاد", "هشتاد", "نود"];
const dahat = ["ده", "یازده", "دوازده", "سیزده", "چهارده", "پانزده", "شانزده", "هفده", "هجده", "نوزده"];
const sadgan = ["", "صد", "دویست", "سیصد", "چهارصد", "پانصد", "ششصد", "هفتصد", "هشتصد", "نهصد"];
const levels = ["", "هزار", "میلیون", "میلیارد", "تریلیون"];

export const numToPersian = (num: number | string): string => {
 if (num === 0 || num === "0") return "صفر";
 
 let n = typeof num === "string" ? parseInt(num.replace(/,/g, "")) : num;
 if (isNaN(n)) return "";
 
 const splitNumber = (num: number): number[] => {
  let parts = [];
  while (num > 0) {
   parts.push(num % 1000);
   num = Math.floor(num / 1000);
  }
  return parts;
 };

 const readThree = (num: number): string => {
  let s = "";
  const s1 = Math.floor(num / 100);
  const s2 = Math.floor((num % 100) / 10);
  const s3 = num % 10;

  if (s1 !== 0) s += sadgan[s1] + " و ";
  
  if (s2 === 1) {
   s += dahat[s3];
  } else {
   if (s2 !== 0) s += dahgan[s2] + " و ";
   if (s3 !== 0) s += yekan[s3] + " و ";
  }

  return s.slice(0, -3);
 };

 const parts = splitNumber(n);
 let result = "";

 for (let i = parts.length - 1; i >= 0; i--) {
  if (parts[i] === 0) continue;
  result += readThree(parts[i]) + " " + levels[i] + " و ";
 }

 return result.slice(0, -3).trim();
};
