import React, { useState, useEffect } from 'react';
import './App.css';

// Mock data function as fallback
const mockExchangeData = () => {
  const basePrice = 60000 + Math.random() * 5000;
  return {
    Binance: basePrice * (1 - Math.random() * 0.02),
    Coinbase: basePrice * (1 + Math.random() * 0.03),
    Kraken: basePrice * (1 + Math.random() * 0.01),
    Gemini: basePrice * (1 + Math.random() * 0.015),
    Bitstamp: basePrice * (1 - Math.random() * 0.01)
  };
};

// Function to fetch real data from various exchanges
const fetchRealExchangeData = async () => {
  try {
    // Object to store our results
    const prices = {};
    
    // Fetch Binance price
    const binanceResponse = await fetch('https://api.binance.com/api/v3/ticker/price?symbol=BTCUSDT');
    const binanceData = await binanceResponse.json();
    prices.Binance = parseFloat(binanceData.price);
    
    // Fetch Coinbase price
    const coinbaseResponse = await fetch('https://api.coinbase.com/v2/prices/BTC-USD/spot');
    const coinbaseData = await coinbaseResponse.json();
    prices.Coinbase = parseFloat(coinbaseData.data.amount);
    
    // Fetch Kraken price
    const krakenResponse = await fetch('https://api.kraken.com/0/public/Ticker?pair=XBTUSD');
    const krakenData = await krakenResponse.json();
    prices.Kraken = parseFloat(krakenData.result.XXBTZUSD.c[0]);
    
    // Note: For Gemini and Bitstamp, we'll use their public APIs
    // Fetch Bitstamp price
    const bitstampResponse = await fetch('https://www.bitstamp.net/api/v2/ticker/btcusd/');
    const bitstampData = await bitstampResponse.json();
    prices.Bitstamp = parseFloat(bitstampData.last);
    
    // Fetch Gemini price
    const geminiResponse = await fetch('https://api.gemini.com/v1/pubticker/btcusd');
    const geminiData = await geminiResponse.json();
    prices.Gemini = parseFloat(geminiData.last);
    
    return prices;
  } catch (error) {
    console.error("Error fetching real exchange data:", error);
    // Return null to indicate failure, will trigger fallback
    return null;
  }
};

// Simple AmountInput component
const AmountInput = ({ value, onChange }) => {
  return (
    <div className="amount-input">
      <label htmlFor="usd-amount">USD Amount:</label>
      <input
        id="usd-amount"
        type="number"
        value={value}
        onChange={onChange}
        min="0"
        step="100"
      />
    </div>
  );
};

// Simple LoadingSkeleton component
const LoadingSkeleton = () => {
  return (
    <div className="loading-skeleton">
      <div className="skeleton-row"></div>
      <div className="skeleton-row"></div>
      <div className="skeleton-row"></div>
    </div>
  );
};

// Simple ResultRow component
const ResultRow = ({ label, value, highlight }) => {
  return (
    <div className={`result-row ${highlight ? 'highlight' : ''}`}>
      <div className="result-label">{label}</div>
      <div className="result-value">{value}</div>
    </div>
  );
};

function App() {
  const [amount, setAmount] = useState(100);
  const [btcPrices, setBtcPrices] = useState({});
  const [loading, setLoading] = useState(true);
  const [bestExchange, setBestExchange] = useState(null);
  const [lastUpdated, setLastUpdated] = useState('');
  const [usingRealData, setUsingRealData] = useState(true);

  const fetchPrices = async () => {
    setLoading(true);
    
    try {
      // First try to get real data
      const realPrices = await fetchRealExchangeData();
      
      if (realPrices) {
        // We got real data
        setBtcPrices(realPrices);
        setUsingRealData(true);
      } else {
        // Real data failed, use mock data
        const mockPrices = mockExchangeData();
        setBtcPrices(mockPrices);
        setUsingRealData(false);
      }
      
      // Find best exchange (lowest price)
      const prices = realPrices || mockExchangeData();
      const best = Object.keys(prices).reduce((a, b) => 
        prices[a] < prices[b] ? a : b
      );
      setBestExchange(best);
      
      // Update timestamp
      const now = new Date();
      setLastUpdated(now.toLocaleTimeString());
    } catch (error) {
      console.error("Error in fetchPrices:", error);
      // Use mock data as fallback
      const mockPrices = mockExchangeData();
      setBtcPrices(mockPrices);
      setUsingRealData(false);
      
      // Still need to find best exchange
      const best = Object.keys(mockPrices).reduce((a, b) => 
        mockPrices[a] < mockPrices[b] ? a : b
      );
      setBestExchange(best);
      
      // Update timestamp
      const now = new Date();
      setLastUpdated(now.toLocaleTimeString());
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchPrices();
    
    // Refresh every 30 seconds
    const interval = setInterval(fetchPrices, 30000);
    return () => clearInterval(interval);
  }, []);
  
  const handleAmountChange = (e) => {
    const newAmount = parseFloat(e.target.value) || 0;
    setAmount(newAmount);
  };
  
  const calculateBtcAmount = (usdAmount, price) => {
    if (!price || price <= 0 || !usdAmount || usdAmount <= 0) return 'N/A';
    return (usdAmount / price).toFixed(8);
  };
  
  const formatPrice = (price) => {
    if (!price && price !== 0) return 'N/A';
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(price);
  };
  
  return (
    <div className="App">
      <header className="App-header">
        <h1>BTC Price Checker</h1>
        <p>Enter USD amount to see how much BTC you can buy</p>
        
        <AmountInput value={amount} onChange={handleAmountChange} />
        
        <button 
          onClick={fetchPrices} 
          className="refresh-button"
          disabled={loading}
        >
          {loading ? 'Refreshing...' : 'Refresh Prices'}
        </button>
        
        {lastUpdated && (
          <div className="last-updated">
            Last updated: {lastUpdated} 
            {!usingRealData && <span className="data-source"> (using simulated data - API fetch failed)</span>}
            {usingRealData && <span className="data-source"> (using real-time API data)</span>}
          </div>
        )}
        
        {loading ? (
          <LoadingSkeleton />
        ) : (
          <div className="results-container">
            <h2>Current Bitcoin Prices</h2>
            {Object.keys(btcPrices).map(exchange => (
              <ResultRow 
                key={exchange}
                label={exchange} 
                value={formatPrice(btcPrices[exchange])} 
                highlight={bestExchange === exchange} 
              />
            ))}
            
            {bestExchange && (
              <>
                <h2>Best Deal</h2>
                <ResultRow 
                  label={`Best Exchange`} 
                  value={bestExchange} 
                  highlight={true}
                />
                <ResultRow 
                  label={`BTC for ${formatPrice(amount)}`} 
                  value={calculateBtcAmount(amount, btcPrices[bestExchange]) + ' BTC'} 
                  highlight={true}
                />
              </>
            )}
          </div>
        )}
      </header>
    </div>
  );
}

export default App;