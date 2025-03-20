import React, { useState, useEffect } from 'react';
import './App.css';

// Mock data component instead of fetching from APIs
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

  const fetchPrices = () => {
    setLoading(true);
    
    // Simulate network delay
    setTimeout(() => {
      const prices = mockExchangeData();
      setBtcPrices(prices);
      
      // Find best exchange (lowest price)
      const best = Object.keys(prices).reduce((a, b) => 
        prices[a] < prices[b] ? a : b
      );
      setBestExchange(best);
      
      // Update timestamp
      const now = new Date();
      setLastUpdated(now.toLocaleTimeString());
      
      setLoading(false);
    }, 500);
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
            Last updated: {lastUpdated} (using simulated data)
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