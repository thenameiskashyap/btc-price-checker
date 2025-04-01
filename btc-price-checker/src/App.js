import React, { useState, useEffect, useCallback } from 'react';
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
  const prices = {};
  let fetchSuccess = false;

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

  const exchanges = [
    {
      name: 'Binance',
      fetch: async () => {
        const response = await fetchWithTimeout('https://api.binance.com/api/v3/ticker/price?symbol=BTCUSDT');
        const data = await response.json();
        return parseFloat(data.price);
      }
    },
    {
      name: 'Coinbase',
      fetch: async () => {
        const response = await fetchWithTimeout('https://api.coinbase.com/v2/prices/BTC-USD/spot');
        const data = await response.json();
        return parseFloat(data.data.amount);
      }
    },
    {
      name: 'CoinGecko',
      fetch: async () => {
        const response = await fetchWithTimeout('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd');
        const data = await response.json();
        return parseFloat(data.bitcoin.usd);
      }
    },
    {
      name: 'CryptoCompare',
      fetch: async () => {
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

  const results = await Promise.all(
    exchanges.map(exchange => 
      fetchExchange(exchange.name, exchange.fetch)
    )
  );

  const successCount = results.filter(success => success).length;

  if (successCount >= 2) {
    fetchSuccess = true;
  }

  return fetchSuccess ? prices : null;
};

function App() {
  const [amount, setAmount] = useState(100);
  const [btcPrices, setBtcPrices] = useState({});
  const [loading, setLoading] = useState(true);
  const [priceHistory, setPriceHistory] = useState([]);
  const MAX_HISTORY_POINTS = 20;

  const fetchPrices = useCallback(async () => {
    setLoading(true);

    try {
      const realPrices = await fetchRealExchangeData();
      const prices = realPrices || mockExchangeData();
      
      setBtcPrices(prices);
      const timestamp = Date.now();
      setPriceHistory(prev => {
        const newPoint = { timestamp, ...prices };
        return [...prev, newPoint].slice(-MAX_HISTORY_POINTS);
      });
    } catch (error) {
      console.error("Error in fetchPrices:", error);
      const mockPrices = mockExchangeData();
      setBtcPrices(mockPrices);
      setPriceHistory(prev => {
        const newPoint = { timestamp: Date.now(), ...mockPrices };
        return [...prev, newPoint].slice(-MAX_HISTORY_POINTS);
      });
    } finally {
      setTimeout(() => setLoading(false), 500);
    }
  }, []); // Empty dependency array

  useEffect(() => {
    fetchPrices(); // Initial fetch
    
    const intervalId = setInterval(() => {
      fetchPrices();
    }, 30000);

    return () => clearInterval(intervalId); // Cleanup
  }, [fetchPrices]);

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

  const exchangeUrls = {
    Binance: 'https://www.binance.com',
    Coinbase: 'https://www.coinbase.com',
    CryptoCompare: 'https://www.cryptocompare.com',
    CoinGecko: 'https://www.coingecko.com',
    Kraken: 'https://www.kraken.com',
    Bitstamp: 'https://www.bitstamp.net',
    Gemini: 'https://www.gemini.com'
  };

  const handleExchangeClick = (url) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="App">
      <nav className="navbar">
        <div className="nav-content">
          <div className="nav-logo">
            <img src="/images/bitcoin-logo.png" alt="Bitcoin" />
            <span>Bitcoin Price Tracker</span>
          </div>
          <div className="nav-links">
            <a href="#about">About</a>
            <a href="#exchanges">Exchanges</a>
            <a href="#resources">Resources</a>
          </div>
        </div>
      </nav>

      <section className="hero">
        <h1>Bitcoin Price Tracker</h1>
        <p>Compare real-time Bitcoin prices across top exchanges and grab the best deal instantly. Stay ahead with live updates and smarter trading!</p>
      </section>

      <div className="price-card">
        <div className="card-header">
          <h2>Compare Exchange Prices</h2>
          <div className="last-updated">
            Last updated: {new Date().toLocaleTimeString()}
          </div>
        </div>

        <div className="amount-input">
          <label>Enter USD Amount</label>
          <input
            type="number"
            value={amount}
            onChange={handleAmountChange}
            placeholder="Enter USD amount"
          />
        </div>

        <button 
          onClick={fetchPrices} 
          className="refresh-button"
          disabled={loading}
        >
          {loading ? (
            <>
              <span className="spinner"></span>
              Refreshing...
            </>
          ) : (
            <>
              <i className="fas fa-sync-alt"></i>
              Refresh Prices
            </>
          )}
        </button>

        {loading ? (
          <div className="loading-skeleton">
            <div className="skeleton-row"></div>
            <div className="skeleton-row"></div>
            <div className="skeleton-row"></div>
          </div>
        ) : (
          <div className="exchange-list">
            {Object.entries(btcPrices).map(([exchange, price]) => (
              <div 
                key={exchange}
                className="exchange-link"
                onClick={() => handleExchangeClick(exchangeUrls[exchange])}
              >
                <img src={`/images/${exchange.toLowerCase()}.png`} alt={exchange} />
                <div className="exchange-info">
                  <span className="exchange-name">{exchange}</span>
                  <div className="price-info">
                    <span className="exchange-price">{formatPrice(price)}</span>
                  </div>
                  <span className="btc-equivalent">You can buy ≈ {calculateBtcAmount(amount, price)} BTC</span>
                </div>
                <i className="fas fa-external-link-alt"></i>
              </div>
            ))}
          </div>
        )}

        {priceHistory.length > 0 && (
          <div className="chart-container">
            <h2>Bitcoin Price History</h2>
            <ResponsiveContainer width="100%" height={400}>
              <LineChart data={priceHistory}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.1)" />
                <XAxis 
                  dataKey="timestamp" 
                  stroke="#fff"
                  tickFormatter={(timestamp) => new Date(timestamp).toLocaleTimeString()}
                />
                <YAxis 
                  stroke="#fff"
                  domain={['auto', 'auto']}
                  tickFormatter={(value) => `$${(value/1000).toFixed(1)}k`}
                />
                <Tooltip 
                  contentStyle={{
                    background: 'rgba(13, 17, 28, 0.9)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '8px'
                  }}
                  formatter={(value) => [`$${value.toLocaleString()}`, 'Price']}
                  labelFormatter={(timestamp) => new Date(timestamp).toLocaleTimeString()}
                />
                <Legend />
                {Object.keys(btcPrices).map((exchange, index) => (
                  <Line
                    key={exchange}
                    type="monotone"
                    dataKey={exchange}
                    stroke={[
                      '#f7931a', // Bitcoin Orange
                      '#0052ff', // Coinbase Blue
                      '#8dc647', // Green
                      '#f0b90b', // Binance Yellow
                      '#5741d9'  // Purple
                    ][index]}
                    strokeWidth={2}
                    dot={false}
                    activeDot={{ r: 8 }}
                  />
                ))}
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      <footer className="footer">
        <div className="footer-content">
          <div className="footer-section">
            <div className="footer-logo">
              <img src="/images/bitcoin-logo.png" alt="Bitcoin" />
              <h3>Bitcoin Price Tracker</h3>
            </div>
            <p>Your trusted source for real-time cryptocurrency price tracking</p>
          </div>
          
          <div className="footer-section">
            <h4>Quick Links</h4>
            <ul className="footer-links">
              <li><a href="#home">Home</a></li>
              <li><a href="#about">About</a></li>
              <li><a href="#exchanges">Exchanges</a></li>
            </ul>
          </div>
          
          <div className="footer-section">
            <h4>Resources</h4>
            <ul className="footer-links">
              <li><a href="#learn">Learn Bitcoin</a></li>
              <li><a href="#faq">FAQ</a></li>
              <li><a href="#support">Support</a></li>
            </ul>
          </div>
          
          <div className="footer-section">
            <h4>Connect</h4>
            <div className="social-links">
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
                <i className="fab fa-twitter"></i>
              </a>
              <a href="https://github.com" target="_blank" rel="noopener noreferrer">
                <i className="fab fa-github"></i>
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer">
                <i className="fab fa-linkedin"></i>
              </a>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; 2024 Bitcoin Price Tracker. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

export default App;