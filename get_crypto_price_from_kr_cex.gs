function testFunc(){
  ret = getCoinonePrice("btc");
  ret = formatNumber(ret);
  console.log("getCoinonePrice: btc,", ret, "원");

  ret = getUpbitPrice("eth");
  ret = formatNumber(ret);
  console.log("getUpbitPrice: eth,", ret, "원");

  ret = getBithumbPrice("sol");
  ret = formatNumber(ret);
  console.log("getBithumbPrice: sol,", ret, "원");

  ret = getKorbitPrice("link");
  ret = formatNumber(ret);
  console.log("getKorbitPrice: link,", ret, "원");

  ret = getCoingeckoPrice("argo");
  console.log(ret)
  ret = formatNumber(ret);
  console.log("coingecko: argo,", ret, "USD");
}

function formatNumber(num) {
  // Convert to float first to ensure we're working with a number
  num = parseFloat(num);
  
  // Check if it's a valid number
  if (isNaN(num)) {
    return num;
  }
  
  // Format with comma for thousands and 2 decimal places
  return num.toLocaleString('en-US', {
    minimumFractionDigits: 2, 
    maximumFractionDigits: 2
  });
}

/** 코인원의 경우
https://api.coinone.co.kr/ticker/?currency=btc
response:
{
  "result": "success",
  "errorCode": "0",
  "timestamp": "1738091264",
  "currency": "btc",
  "first": "153400000.0",
  "low": "152970000.0",
  "high": "156580000.0",
  "last": "155480000.0",
  "volume": "95.50332653",
  "yesterday_first": "157600000.0",
  "yesterday_low": "151410000.0",
  "yesterday_high": "158000000.0",
  "yesterday_last": "153400000.0",
  "yesterday_volume": "312.05734059"
}
*/
function getCoinonePrice(coin) {
  if (coin.toLowerCase() == 'krw') 
    return 1;

  try {
    var url = 'https://api.coinone.co.kr/ticker/?currency=' + coin;
    var response = UrlFetchApp.fetch(url);
    var json = JSON.parse(response.getContentText());
    if (json.errorCode === "0") {
      return json.last;
    } else {
      return `Error: API returned errorCode ${json.errorCode}`;
    }
  } catch (error) {
    return `Error: ${error.message}`;
  }
}


/**
https://api.bithumb.com/public/ticker/BTC_KRW
response:
{
  "status": "0000",
  "data": {
    "opening_price": "155246000",
    "closing_price": "155444000",
    "min_price": "154704000",
    "max_price": "156428000",
    "units_traded": "85.6424264",
    "acc_trade_value": "13325963487.48222",
    "prev_closing_price": "155289000",
    "units_traded_24H": "613.53791955",
    "acc_trade_value_24H": "95358428170.07528",
    "fluctate_24H": "1912000",
    "fluctate_rate_24H": "1.25",
    "date": "1738091114547"
  }
}
*/
// Bithumb Price Fetcher
function getBithumbPrice(coin) {
  try {
    var url = 'https://api.bithumb.com/public/ticker/' + coin + '_KRW';
    var response = UrlFetchApp.fetch(url);
    var json = JSON.parse(response.getContentText());
    if (json.status === "0000") {
      return json.data.closing_price;
    } else {
      return `Error: Bithumb API returned status ${json.status}`;
    }
  } catch (error) {
    return `Error: ${error.message}`;
  }
}


/**
https://api.upbit.com/v1/ticker?markets=KRW-BTC
response:
[
  {
    "market": "KRW-BTC",
    "trade_date": "20250128",
    "trade_time": "190644",
    "trade_date_kst": "20250129",
    "trade_time_kst": "040644",
    "trade_timestamp": 1738091204704,
    "opening_price": 154919000,
    "high_price": 156658000,
    "low_price": 153782000,
    "trade_price": 155415000,
    "prev_closing_price": 154919000,
    "change": "RISE",
    "change_price": 496000,
    "change_rate": 0.0032016731,
    "signed_change_price": 496000,
    "signed_change_rate": 0.0032016731,
    "trade_volume": 0.00366273,
    "acc_trade_price": 241003073847.032,
    "acc_trade_price_24h": 287344075335.09,
    "acc_trade_volume": 1549.56908375,
    "acc_trade_volume_24h": 1849.58473905,
    "highest_52_week_price": 163325000,
    "highest_52_week_date": "2025-01-20",
    "lowest_52_week_price": 57804000,
    "lowest_52_week_date": "2024-02-01",
    "timestamp": 1738091204759
  }
]
*/
// Upbit Price Fetcher
function getUpbitPrice(coin) {
  try {
    var url = 'https://api.upbit.com/v1/ticker?markets=KRW-' + coin.toUpperCase();
    var response = UrlFetchApp.fetch(url);
    var json = JSON.parse(response.getContentText());
    if (json && json.length > 0) {
      // console.log(json)
      return json[0].trade_price;
    } else {
      return `Error: Upbit API returned an empty response`;
    }
  } catch (error) {
    return `Error: ${error.message}`;
  }
}

function getKorbitPrice(coin) {
  if (coin.toLowerCase() == 'krw') 
    return 1;

  try {
    var url = 'https://api.korbit.co.kr/v1/ticker?currency_pair=' + coin.toLowerCase() + '_krw';
    var response = UrlFetchApp.fetch(url);
    var json = JSON.parse(response.getContentText());
    
    return json.last;
  } catch (error) {
    return `Error: ${error.message}`;
  }
}

/** 
https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=btc
response:
{
  "bitcoin":{"usd":102768}
}
*/
function getCoingeckoPrice(ticker, currency = "usd") {
  if (ticker.toLowerCase() == 'krw') 
    return 1;
    
  try {
    // Convert inputs to lowercase
    ticker = ticker.toLowerCase();
    currency = currency.toLowerCase();
    
    // Create CoinGecko API URL
    const url = `https://api.coingecko.com/api/v3/simple/price?ids=${getTokenId(ticker)}&vs_currencies=${currency}`;
    //console.log(url);

    // Make API request
    const response = UrlFetchApp.fetch(url);
    const data = JSON.parse(response.getContentText());
    
    // Get price from response
    const tokenId = getTokenId(ticker);
    if (data[tokenId] && data[tokenId][currency]) {
      // console.log(data)
      return data[tokenId][currency];
    } else {
      throw new Error(`Unable to get price for ${ticker}`);
    }
    
  } catch (error) {
    return `Error: ${error.message}`;
  }
}


function getTokenId(ticker) {
  const tickerMap = {
    "btc": "bitcoin",
    "eth": "ethereum",
    "sol": "solana",
    "xrp": "ripple",
    "ada": "cardano",
    "doge": "dogecoin",
    "link": "chainlink",
    "uni": "uniswap",
    "ai16z": "ai16z",
    "virtual": "virtual-protocol",
    "sui": "sui",
    "fet": "fetch-ai",
    "usdc": "usd-coin",
    "usdt": "tether",
    "argo": "argo-3",
    // Add more mappings as needed
  };
  
  if (tickerMap[ticker]) {
    return tickerMap[ticker];
  }
  
  // If no mapping found, return the ticker as-is
  return ticker;
}






//end of script
