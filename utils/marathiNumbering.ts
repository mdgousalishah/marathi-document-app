// Convert English numbers to Devanagari Marathi numbers
export function toDevanagariNumber(input: number | string): string {
  const str = String(input);
  const devanagariDigits = ['०', '१', '२', '३', '४', '५', '६', '७', '८', '९'];
  return str.replace(/[0-9]/g, (digit) => devanagariDigits[parseInt(digit, 10)]);
}

// Convert Devanagari Marathi numbers to English numbers
export function toEnglishNumber(input: string): string {
  const devanagariDigitsMap: Record<string, string> = {
    '०': '0', '१': '1', '२': '2', '३': '3', '४': '4',
    '५': '5', '६': '6', '७': '7', '८': '8', '९': '9'
  };
  return input.replace(/[०-९]/g, (char) => devanagariDigitsMap[char] || char);
}

// Format a date string (YYYY-MM-DD or DD-MM-YYYY) into Marathi Devanagari Date format
export function formatMarathiDate(dateStr: string, useDevanagariDigits = true): string {
  if (!dateStr) return '';
  
  // If date format is YYYY-MM-DD
  let day = '';
  let month = '';
  let year = '';

  if (dateStr.includes('-')) {
    const parts = dateStr.split('-');
    if (parts[0].length === 4) {
      // YYYY-MM-DD
      year = parts[0];
      month = parts[1];
      day = parts[2];
    } else {
      // DD-MM-YYYY
      day = parts[0];
      month = parts[1];
      year = parts[2];
    }
  } else if (dateStr.includes('/')) {
    const parts = dateStr.split('/');
    day = parts[0];
    month = parts[1];
    year = parts[2] || '';
  } else {
    return dateStr;
  }

  const formatted = `${day}.${month}.${year}`;
  return useDevanagariDigits ? toDevanagariNumber(formatted) : formatted;
}

// Get today's date formatted in DD-MM-YYYY or YYYY-MM-DD
export function getTodayFormatted(): string {
  const today = new Date();
  const d = String(today.getDate()).padStart(2, '0');
  const m = String(today.getMonth() + 1).padStart(2, '0');
  const y = today.getFullYear();
  return `${d}.${m}.${y}`;
}

// Get Marathi Month Name
export function getMarathiMonthName(monthNumber: number): string {
  const marathiMonths = [
    'जानेवारी', 'फेब्रुवारी', 'मार्च', 'एप्रिल', 'मे', 'जून',
    'जुलै', 'ऑगस्ट', 'सप्टेंबर', 'ऑक्टोबर', 'नोव्हेंबर', 'डिसेंबर'
  ];
  return marathiMonths[monthNumber - 1] || '';
}

// Fuzzy or standard Marathi search helper
export function searchMarathiText(text: string, query: string): boolean {
  if (!query || !query.trim()) return true;
  if (!text) return false;
  
  const cleanText = text.toLowerCase().trim();
  const cleanQuery = query.toLowerCase().trim();

  // Search both exact and normalized
  return cleanText.includes(cleanQuery) || 
         toDevanagariNumber(cleanText).includes(toDevanagariNumber(cleanQuery));
}
