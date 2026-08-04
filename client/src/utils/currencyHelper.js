export const COUNTRY_CURRENCIES = {
  'India': { code: 'INR', symbol: '₹', rateToINR: 1, name: 'Indian Rupee' },
  'UAE': { code: 'AED', symbol: 'AED ', rateToINR: 22.5, name: 'UAE Dirham' },
  'USA': { code: 'USD', symbol: '$', rateToINR: 83.5, name: 'US Dollar' },
  'Japan': { code: 'JPY', symbol: '¥', rateToINR: 0.55, name: 'Japanese Yen' },
  'Italy': { code: 'EUR', symbol: '€', rateToINR: 90.2, name: 'Euro' },
  'Switzerland': { code: 'CHF', symbol: 'CHF ', rateToINR: 94.5, name: 'Swiss Franc' },
  'France': { code: 'EUR', symbol: '€', rateToINR: 90.2, name: 'Euro' },
  'UK': { code: 'GBP', symbol: '£', rateToINR: 106.0, name: 'British Pound' },
  'Australia': { code: 'AUD', symbol: 'A$', rateToINR: 54.2, name: 'Australian Dollar' },
  'Singapore': { code: 'SGD', symbol: 'S$', rateToINR: 62.0, name: 'Singapore Dollar' },
  'Indonesia': { code: 'IDR', symbol: 'Rp ', rateToINR: 0.0053, name: 'Indonesian Rupiah' },
  'Greece': { code: 'EUR', symbol: '€', rateToINR: 90.2, name: 'Euro' },
  'Spain': { code: 'EUR', symbol: '€', rateToINR: 90.2, name: 'Euro' },
  'Monaco': { code: 'EUR', symbol: '€', rateToINR: 90.2, name: 'Euro' },
  'Thailand': { code: 'THB', symbol: '฿', rateToINR: 2.35, name: 'Thai Baht' },
  'South Africa': { code: 'ZAR', symbol: 'R ', rateToINR: 4.5, name: 'South African Rand' },
  'Mexico': { code: 'MXN', symbol: 'MX$', rateToINR: 4.8, name: 'Mexican Peso' }
};

export const formatPropertyPrice = (priceInINR, country = 'India', purpose = 'Buy', rentPriceInINR = null) => {
  const currency = COUNTRY_CURRENCIES[country] || COUNTRY_CURRENCIES['India'];
  
  if (purpose === 'Rent') {
    const rentAmount = rentPriceInINR ? rentPriceInINR : Math.round(priceInINR * 0.004);
    const convertedRent = rentAmount / currency.rateToINR;
    
    if (currency.code === 'INR') {
      if (convertedRent >= 100000) return `₹${(convertedRent / 100000).toFixed(2)} Lakh / mo`;
      return `₹${Math.round(convertedRent).toLocaleString('en-IN')} / mo`;
    }
    return `${currency.symbol}${Math.round(convertedRent).toLocaleString()} / mo`;
  }

  // Purpose === 'Buy'
  const convertedPrice = priceInINR / currency.rateToINR;

  if (currency.code === 'INR') {
    if (convertedPrice >= 10000000) return `₹${(convertedPrice / 10000000).toFixed(2)} Cr`;
    if (convertedPrice >= 100000) return `₹${(convertedPrice / 100000).toFixed(2)} Lakh`;
    return `₹${Math.round(convertedPrice).toLocaleString('en-IN')}`;
  }

  if (convertedPrice >= 1000000) return `${currency.symbol}${(convertedPrice / 1000000).toFixed(2)}M`;
  if (convertedPrice >= 1000) return `${currency.symbol}${(convertedPrice / 1000).toFixed(0)}k`;
  return `${currency.symbol}${Math.round(convertedPrice).toLocaleString()}`;
};
