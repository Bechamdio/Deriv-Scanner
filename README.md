# Deriv Scanner

A real-time market analysis tool for Deriv volatility indices with WebSocket integration and automated trading signal generation.

## 🎯 Features

### Version 1 (Current)
- ✅ **Real-time WebSocket Connection** - Live connection to Deriv market data
- ✅ **Volatility Index Support** - Analyze Volatility 10, 15, 25, 75, 100 indices
- ✅ **Live Price Tracking** - Real-time price updates with tick collection
- ✅ **Technical Indicators** - SMA, EMA, RSI, MACD, Volatility, Standard Deviation
- ✅ **Signal Generation** - Automated BUY/SELL/WAIT signals
- ✅ **Signal Strength** - 0-100% confidence metric
- ✅ **Analysis Dashboard** - Comprehensive real-time analytics display
- ✅ **Event Logging** - Detailed operation logs
- ✅ **Demo Mode Only** - Safe analysis without trading

### Version 2 (Planned)
- 📊 Price chart visualization
- 📈 Additional technical indicators
- 📉 Historical data analysis
- 🎯 Signal filtering options
- 📓 Trade journal tracking
- 📊 Results analytics

### Version 3 (Planned)
- 🔐 Deriv user login/authentication
- 💼 Account connection
- 🎮 Demo account trading
- 🔄 Automatic reconnection
- ⚠️ Optional live trading (after extensive testing)

## 🚀 Quick Start

1. **Open the Scanner**
   - Simply open `index.html` in a modern web browser

2. **Select an Index**
   - Choose from Volatility 10, 15, 25, 75, or 100 using the dropdown

3. **Connect**
   - Click "Connect WebSocket" button
   - Wait for green "Connected" status

4. **Monitor**
   - Watch real-time price updates
   - Follow signal generation
   - Review analysis metrics

## 📊 Supported Volatility Indices

| Index | Volatility | Best For | Expiry |
|-------|-----------|----------|--------|
| Volatility 10 | Lowest | Scalping | 1 min |
| Volatility 15 | Low | Short-term | Variable |
| Volatility 25 | Moderate | Balanced | Variable |
| Volatility 75 | High | Aggressive | Variable |
| Volatility 100 | Highest | Maximum movement | 1 min |

## 🔧 Technical Indicators

### Price Analysis
- **SMA (Simple Moving Average)** - 20-period trend indicator
- **EMA (Exponential Moving Average)** - Recent price-weighted average
- **High/Low** - Recent price extremes
- **Standard Deviation** - Price volatility measurement

### Momentum Analysis
- **RSI (Relative Strength Index)** - Momentum 0-100 scale
  - < 30 = Oversold (potential BUY)
  - > 70 = Overbought (potential SELL)
  - 30-70 = Neutral

### Trend Analysis
- **MACD** - Moving average convergence/divergence
  - Positive = Uptrend
  - Negative = Downtrend

### Market Analysis
- **Volatility %** - Price deviation from average
- **Movement (pips)** - Recent price range

## 📈 Signal Generation

Signals are generated using a scoring algorithm:

```
Score Calculation:
- Base: 50
- RSI < 30: +15
- RSI > 70: -15
- Volatility > 5%: +10
- Movement > 100 pips: +5
- MACD Positive: +10
- MACD Negative: -10

Result:
- Score > 65: BUY
- Score < 35: SELL
- 35-65: WAIT
```

**Signal Strength** = Score (0-100%)

## 🏗️ Project Structure

```
Deriv-Scanner/
├── index.html          # Main scanner interface
├── styles.css          # UI styling (dark theme)
├── websocket.js        # Deriv API WebSocket handler
├── analysis.js         # Technical analysis engine
├── ui.js              # UI controller & event handlers
├── docs.html          # Documentation & guide
├── README.md          # This file
└── LICENSE            # MIT License
```

## 💻 JavaScript API

### Connection Management
```javascript
deriv.connect()        // Establish WebSocket connection
deriv.disconnect()     // Close connection
deriv.subscribe(id)    // Subscribe to volatility index
```

### Data Access
```javascript
deriv.getTicks()       // Get all collected price ticks
deriv.getTickCount()   // Get number of ticks collected
deriv.resetTicks()     // Clear tick buffer
```

### Analysis
```javascript
analyzer.analyze()              // Full analysis object
analyzer.calculateSMA(20)       // Simple moving average
analyzer.calculateEMA(20)       // Exponential moving average
analyzer.calculateRSI(14)       // Relative strength index
analyzer.calculateVolatility()  // Volatility %
analyzer.calculateMovement()    // Movement in pips
```

### Signal Generation
```javascript
signalGenerator.generateSignal() // Get BUY/SELL/WAIT signal
signalGenerator.setThreshold(60) // Set custom threshold
```

### Event System
```javascript
deriv.on('connected', callback)    // Connection established
deriv.on('disconnected', callback) // Connection closed
deriv.on('subscribed', callback)   // Subscribed to index
deriv.on('tick', callback)         // New tick received
deriv.on('error', callback)        // Error occurred
```

## ⚠️ Important Notes

- **Version 1 is for analysis only** - No trades are executed
- **Requires internet connection** - For WebSocket to Deriv servers
- **Modern browser required** - Chrome, Firefox, Safari, or Edge recommended
- **Demo mode active** - All signals are educational
- **Not financial advice** - This is a technical analysis tool only

## 🔒 Security

- No authentication required for V1 (uses public Deriv WebSocket)
- All processing is client-side (browser)
- No data is stored or sent to external servers
- No trading credentials are handled in V1

## 📖 Documentation

Full documentation available in `docs.html` including:
- Detailed getting started guide
- Technical indicator explanations
- Signal generation algorithm details
- API reference
- Troubleshooting guide

## 🛠️ Development

### Requirements
- Modern web browser with WebSocket support
- No backend server needed
- No external dependencies

### Browser Compatibility
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## 📝 License

MIT License - See LICENSE file for details

## 🎓 Learning Resources

- Deriv Official API Docs: https://api.deriv.com
- Technical Analysis Guide: https://www.investopedia.com/terms/t/technicalanalysis.asp
- WebSocket Documentation: https://developer.mozilla.org/en-US/docs/Web/API/WebSocket

## 🤝 Contributing

Contributions welcome! Areas for improvement:
- Additional technical indicators
- Chart visualization
- Performance optimization
- UI/UX enhancements
- Documentation improvements

## 📞 Support

For issues or questions:
1. Check `docs.html` troubleshooting section
2. Review browser console for error messages
3. Verify internet connection
4. Ensure Deriv API is accessible

## 🗺️ Roadmap

- **Q1**: V1 Release (current)
- **Q2**: V2 - Charts, indicators, historical analysis
- **Q3**: V3 - User authentication, demo trading
- **Q4**: Extended testing, optional live trading consideration

---

**⚠️ DISCLAIMER**: This is a demo/analysis tool for educational purposes only. It is not financial advice. Do not use for live trading without extensive testing and understanding of the risks involved.

**Status**: Version 1.0 - Stable (Analysis Mode)
