import React, { useState, useEffect } from 'react';
import './App.css';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';



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
  // Object to store our results
  const prices = {};
  let fetchSuccess = false;
  
  // We'll use a more reliable approach: fetch from multiple sources
  // and consider it a success if at least 2 exchanges return valid data
  
  // Helper function to fetch from a single API with timeout
  const fetchWithTimeout = async (url, options = {}, timeout = 5000) => {
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), timeout);
    
    try {
      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
        mode: 'cors',
      });
      clearTimeout(id);
      return response;
    } catch (error) {
      clearTimeout(id);
      throw error;
    }
  };
  
  // Function to safely fetch from each exchange
  const fetchExchange = async (name, fetchFunction) => {
    try {
      const price = await fetchFunction();
      if (price && price > 0) {
        prices[name] = price;
        return true;
      }
      return false;
    } catch (error) {
      console.warn(`Failed to fetch from ${name}:`, error);
      return false;
    }
  };
  
  // Using public API endpoints that are more CORS-friendly
  const exchanges = [
    {
      name: 'Binance',
      fetch: async () => {
        // Using a CORS-friendly public API
        const response = await fetchWithTimeout('https://api.binance.com/api/v3/ticker/price?symbol=BTCUSDT');
        const data = await response.json();
        return parseFloat(data.price);
      }
    },
    {
      name: 'Coinbase',
      fetch: async () => {
        // Using Coinbase API through a CORS proxy if needed
        // For demo, we're using the direct URL, but you might need a proxy
        const response = await fetchWithTimeout('https://api.coinbase.com/v2/prices/BTC-USD/spot');
        const data = await response.json();
        return parseFloat(data.data.amount);
      }
    },
    {
      name: 'CoinGecko',
      fetch: async () => {
        // CoinGecko has a very reliable and CORS-friendly API
        const response = await fetchWithTimeout('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd');
        const data = await response.json();
        return parseFloat(data.bitcoin.usd);
      }
    },
    {
      name: 'CryptoCompare',
      fetch: async () => {
        // Another reliable public API
        const response = await fetchWithTimeout('https://min-api.cryptocompare.com/data/price?fsym=BTC&tsyms=USD');
        const data = await response.json();
        return parseFloat(data.USD);
      }
    },
    {
      name: 'Bitstamp',
      fetch: async () => {
        const response = await fetchWithTimeout('https://www.bitstamp.net/api/v2/ticker/btcusd/');
        const data = await response.json();
        return parseFloat(data.last);
      }
    }
  ];
  
  // Try to fetch from all exchanges in parallel
  const results = await Promise.all(
    exchanges.map(exchange => 
      fetchExchange(exchange.name, exchange.fetch)
    )
  );
  
  // Count how many successful fetches we had
  const successCount = results.filter(success => success).length;
  
  // If we have at least 2 successful fetches, consider it a success
  if (successCount >= 2) {
    fetchSuccess = true;
  }
  
  return fetchSuccess ? prices : null;
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

// New component for the price history graph
const PriceHistoryGraph = ({ priceHistory }) => {
  // Generate colors for each exchange
  const colors = {
    Binance: '#F0B90B',     // Binance yellow
    Coinbase: '#0052FF',    // Coinbase blue
    CoinGecko: '#8DC647',   // CoinGecko green
    CryptoCompare: '#FF9900', // Orange
    Bitstamp: '#ED0033',    // Bitstamp red
    Kraken: '#5741D9',      // Kraken purple
    Gemini: '#00DCFA'       // Gemini teal
  };

  return (
    <div className="price-graph-container">
      <h2>BTC Price History</h2>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={priceHistory}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey="timestamp" 
            tickFormatter={(timestamp) => {
              const date = new Date(timestamp);
              return `${date.getHours()}:${date.getMinutes().toString().padStart(2, '0')}:${date.getSeconds().toString().padStart(2, '0')}`;
            }}
          />
          <YAxis 
            domain={['auto', 'auto']}
            tickFormatter={(price) => `$${Math.round(price / 1000)}k`}
          />
          <Tooltip 
            formatter={(value) => [`$${value.toFixed(2)}`, 'Price']}
            labelFormatter={(timestamp) => {
              const date = new Date(timestamp);
              return date.toLocaleTimeString();
            }}
          />
          <Legend />
          {Object.keys(colors).map(exchange => (
            priceHistory.some(entry => entry[exchange] !== undefined) && (
              <Line 
                key={exchange}
                type="monotone" 
                dataKey={exchange} 
                stroke={colors[exchange]} 
                dot={false}
                activeDot={{ r: 8 }}
                connectNulls={true}
              />
            )
          ))}
        </LineChart>
      </ResponsiveContainer>
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
  const [fetchAttempts, setFetchAttempts] = useState(0);
  const [fetchSuccesses, setFetchSuccesses] = useState(0);
  // New state for price history
  const [priceHistory, setPriceHistory] = useState([]);
  // Maximum number of points to keep in price history
  const MAX_HISTORY_POINTS = 20;

  const fetchPrices = async () => {
    setLoading(true);
    setFetchAttempts(prev => prev + 1);
    
    try {
      // First try to get real data
      const realPrices = await fetchRealExchangeData();
      
      if (realPrices && Object.keys(realPrices).length > 0) {
        // We got real data
        setBtcPrices(realPrices);
        setUsingRealData(true);
        setFetchSuccesses(prev => prev + 1);
        
        // Find best exchange (lowest price)
        const best = Object.keys(realPrices).reduce((a, b) => 
          realPrices[a] < realPrices[b] ? a : b
        );
        setBestExchange(best);
        
        // Update price history
        updatePriceHistory(realPrices);
      } else {
        // Real data failed, use mock data
        console.warn("API fetch failed, using simulated data");
        const mockPrices = mockExchangeData();
        setBtcPrices(mockPrices);
        setUsingRealData(false);
        
        // Find best exchange in mock data
        const best = Object.keys(mockPrices).reduce((a, b) => 
          mockPrices[a] < mockPrices[b] ? a : b
        );
        setBestExchange(best);
        
        // Update price history with mock data
        updatePriceHistory(mockPrices);
      }
      
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
      
      // Update price history with mock data
      updatePriceHistory(mockPrices);
      
      // Update timestamp
      const now = new Date();
      setLastUpdated(now.toLocaleTimeString());
    } finally {
      setLoading(false);
    }
  };
  
  // Function to update price history
  const updatePriceHistory = (prices) => {
    const timestamp = Date.now();
    
    setPriceHistory(prevHistory => {
      // Create a new data point with the current timestamp
      const newDataPoint = { timestamp };
      
      // Add each exchange's price to the data point
      Object.keys(prices).forEach(exchange => {
        newDataPoint[exchange] = prices[exchange];
      });
      
      // Add new data point to history
      const updatedHistory = [...prevHistory, newDataPoint];
      
      // Limit history length
      if (updatedHistory.length > MAX_HISTORY_POINTS) {
        return updatedHistory.slice(-MAX_HISTORY_POINTS);
      }
      
      return updatedHistory;
    });
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
        <h1><b> Bitcoin Price Tracker</b></h1>
        <p>Looking for the best Bitcoin price in real-time? Our website continuously tracks and compares BTC prices across top exchanges like Binance, Coinbase, CryptoCompare, and CoinGecko, ensuring you always get the most competitive deal. Whether you're a trader or an investor, our platform helps you make informed decisions by providing instant price updates and highlighting the best rates at any moment. Say goodbye to manually checking multiple platforms—stay ahead of the market with accurate, up-to-the-second data all in one place!</p>
        <p><b>Enter USD amount to see how much BTC you can buy</b></p>
        
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
            {!usingRealData && <span className="data-source"> (Using simulated data)</span>}
            
            
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

            {/* New graph component */}
            {priceHistory.length > 1 && (
              <PriceHistoryGraph priceHistory={priceHistory} />
            )}
          </div>
        )}
      </header>
    </div>
  );
}

export default App;