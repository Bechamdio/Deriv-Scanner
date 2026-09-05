# Deriv Scanner - Development Guide

## Project Setup & Development

### Getting Started with Development

1. **Clone the Repository**
```bash
git clone https://github.com/Bechamdio/Deriv-Scanner.git
cd Deriv-Scanner
```

2. **Start a Local Server** (Optional but recommended)
```bash
# Using Python 3
python -m http.server 8000

# Using Python 2
python -m SimpleHTTPServer 8000

# Using Node.js (if installed)
npx http-server
```

Then open: `http://localhost:8000`

3. **Open Directly**
Simply double-click `index.html` or drag it to your browser

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────────┐
│                   UI Layer (ui.js)                       │
│           Handles user interaction & display             │
└────────────────────┬────────────────────────────────────┘
                     │
┌────────────────────┴────────────────────────────────────┐
│            Analysis Layer (analysis.js)                  │
│       Technical Indicators & Signal Generation           │
└────────────────────┬────────────────────────────────────┘
                     │
┌────────────────────┴────────────────────────────────────┐
│         WebSocket Layer (websocket.js)                   │
│          Deriv API Connection & Data Stream              │
└─────────────────────────────────────────────────────────┘
```

---

## Code Structure

### websocket.js
**Purpose**: Manages WebSocket connection to Deriv API

**Key Classes**:
- `DerivWebSocket` - Connection manager
  - Methods: `connect()`, `disconnect()`, `subscribe()`, `getTicks()`
  - Events: `connected`, `disconnected`, `subscribed`, `tick`, `error`

**Symbol Mapping**:
- Maps Volatility Index numbers (1-5) to Deriv symbols
- Currently uses '1s_BOP' placeholder (update with actual symbols)

### analysis.js
**Purpose**: Technical analysis calculations

**Key Classes**:
- `TechnicalAnalyzer` - Price analysis engine
  - Methods: SMA, EMA, RSI, MACD, Volatility, Movement calculations
  - Window: Last 100 ticks stored, uses 20-tick analysis periods

- `SignalGenerator` - Trading signal creation
  - Scoring algorithm (0-100 scale)
  - Signal types: BUY, SELL, WAIT
  - Confidence level in signal strength

### ui.js
**Purpose**: User interface management

**Key Classes**:
- `UIController` - Manages all UI updates and event listeners
  - Methods: Connect/disconnect handlers, display updates, logging
  - Event system: Tied to WebSocket and analysis events

### styles.css
**Features**:
- Dark theme with blue primary color
- Responsive grid layouts
- CSS custom properties for theming
- Mobile-friendly media queries

### index.html
**Structure**:
- Header with branding
- Control panel (dropdown, buttons)
- Status indicators
- Price display cards
- Signal display card
- Analysis details grid
- Event log container

---

## Extending the Scanner

### Adding a New Technical Indicator

1. **Add to TechnicalAnalyzer class** (analysis.js):

```javascript
// Example: Add AVERAGE DIRECTIONAL INDEX (ADX)
calculateADX(period = 14) {
    if (this.prices.length < period) return null;
    
    // Implementation here
    const adx = /* calculation */;
    return adx;
}
```

2. **Update analyze() method**:

```javascript
analyze(period = 20) {
    return {
        // ... existing indicators
        adx: this.calculateADX(14)  // Add new indicator
    };
}
```

3. **Update SignalGenerator** if it affects signals:

```javascript
generateSignal() {
    // ... existing code
    
    const adx = analysis.adx || 0;
    if (adx > 25) {
        score += 5;
        signals.push('Strong trend (ADX)');
    }
    
    // ... rest of method
}
```

4. **Update UI** (ui.js):

```javascript
updateAnalysis() {
    const analysis = analyzer.analyze();
    
    // Add display element
    if (analysis.adx !== null) {
        this.elements.adx = document.getElementById('adx');
        this.elements.adx.textContent = analysis.adx.toFixed(2);
    }
}
```

5. **Add HTML element** (index.html):

```html
<div class="analysis-item">
    <span class="label">ADX:</span>
    <span id="adx" class="value">--</span>
</div>
```

### Adding a New Volatility Index

1. **Update symbol mapping** (websocket.js):

```javascript
static VOLATILITY_SYMBOLS = {
    '1': '1s_BOP',  // Volatility 10
    // ... existing
    '6': 'NEW_SYMBOL'  // Volatility 110 (example)
};

static VOLATILITY_NAMES = {
    '1': 'Volatility 10',
    // ... existing
    '6': 'Volatility 110'
};
```

2. **Add option to dropdown** (index.html):

```html
<select id="volatility-select">
    <!-- ... existing options -->
    <option value="6">Volatility 110</option>
</select>
```

### Modifying Signal Algorithm

Edit `SignalGenerator.generateSignal()` in analysis.js:

```javascript
generateSignal() {
    const analysis = this.analyzer.analyze();
    
    let score = 50; // Base score
    let signals = [];
    
    // Modify thresholds and weights here
    if (rsi < 25) {  // Change from 30 to 25
        score += 20;  // Increase weight from 15 to 20
        signals.push('Strong oversold');
    }
    
    // ... rest
}
```

---

## Testing Guide

### Manual Testing Checklist

- [ ] **Connection**
  - Select index and click Connect
  - Verify "Connected" status appears
  - Check event log shows subscription

- [ ] **Data Collection**
  - Watch tick counter increment
  - Verify prices update in real-time
  - Check price changes show correctly

- [ ] **Analysis**
  - After 20 ticks, verify indicators appear
  - Check volatility % displays
  - Verify high/low prices update

- [ ] **Signals**
  - After sufficient analysis data, signal should appear
  - Verify signal strength updates
  - Check event log shows signal reasons

- [ ] **UI Responsiveness**
  - Test on mobile (resize browser)
  - Check all elements are visible
  - Verify buttons are clickable

### Browser Console Testing

Open browser DevTools (F12) and check:

```javascript
// Check WebSocket connection
console.log(deriv.connected);

// Get current ticks
console.log(deriv.getTicks());

// Get analysis
console.log(analyzer.analyze());

// Get signal
console.log(signalGenerator.generateSignal());
```

---

## Common Issues & Solutions

### Issue: WebSocket Connection Fails
**Solution**: 
- Check internet connection
- Verify Deriv API is accessible
- Check browser console for errors
- Try different volatility index

### Issue: No Ticks Received
**Solution**:
- Wait a few seconds after connecting
- Check subscription succeeded in event log
- Verify selected index in console

### Issue: Signals Don't Appear
**Solution**:
- Wait for 20+ ticks to collect
- Check analysis appears after tick 20+
- Verify signal threshold settings

### Issue: Prices Not Updating
**Solution**:
- Check WebSocket is connected
- Verify ticks are being received (counter increases)
- Refresh page and reconnect

---

## Performance Optimization

### Current Limitations
- Max 100 ticks stored (configurable)
- 20-tick analysis window
- Updates on every tick

### Optimization Ideas (V2+)
- Implement throttling (update UI every N ticks)
- Add filtering for signal noise
- Cache calculations for repeated periods
- Optimize array operations with circular buffer

---

## Future Enhancements

### V2 Roadmap
```
Chart Visualization
├── Price chart with candlesticks
├── Indicator overlays
├── Volume visualization
├── Zoom and pan controls
└── Export chart as image

Additional Indicators
├── Bollinger Bands
├── Stochastic Oscillator
├── Williams %R
└── Ichimoku Cloud

Historical Analysis
├── Load previous day data
├── Compare periods
├── Trend analysis over time
└── Pattern recognition

Signal Enhancements
├── Configurable weights
├── Alert notifications
├── Signal history
��── Performance tracking
```

### V3 Roadmap
```
User Authentication
├── Deriv login
├── Session management
├── Account info display
└── Profile settings

Trading Features
├── Demo account connection
├── Demo trading execution
├── Trade history tracking
├── P&L calculation
└── Trade journal

Advanced Features
├── Auto-trading (demo only)
├── Risk management
├── Position sizing
├── Trade notifications
└── Performance analytics
```

---

## Contributing

### Code Style Guidelines

1. **Naming Conventions**
   - Classes: PascalCase (e.g., `DerivWebSocket`)
   - Methods/Functions: camelCase (e.g., `calculateSMA`)
   - Constants: UPPER_CASE (e.g., `MAX_TICKS`)
   - Private properties: _leading underscore (e.g., `_buffer`)

2. **Comments**
   - Class-level: Describe purpose and usage
   - Method-level: Explain parameters and return values
   - Complex logic: Add inline comments

3. **Error Handling**
   - Always validate input parameters
   - Provide meaningful error messages
   - Log errors to console

4. **Performance**
   - Avoid DOM manipulation in loops
   - Cache DOM elements
   - Use efficient algorithms

### Pull Request Process

1. Create feature branch: `git checkout -b feature/feature-name`
2. Make changes with clear commit messages
3. Test thoroughly in browser
4. Update documentation
5. Submit PR with description

---

## Debugging Tips

### Enable Verbose Logging
```javascript
// In ui.js constructor
ui.logInfo('Debug mode enabled');
// All subsequent operations logged
```

### Monitor WebSocket Messages
```javascript
// In browser console
deriv.ws.addEventListener('message', (e) => {
    console.log('WS Message:', JSON.parse(e.data));
});
```

### Profile Performance
```javascript
console.time('analysis');
analyzer.analyze();
console.timeEnd('analysis');
```

### Check Data State
```javascript
// Inspect current analyzer state
console.table(analyzer.getPrices());
console.log('Analysis:', analyzer.analyze());
```

---

## Deployment

### For V1 (Demo Mode)
- Simply host HTML/CSS/JS files on any web server
- No backend required
- No database needed
- Client-side only

### GitHub Pages (Free Hosting)
```bash
# Repository already public
# Enable Pages in settings
# URL: https://Bechamdio.github.io/Deriv-Scanner/
```

### Other Hosting Options
- Netlify (free)
- Vercel (free)
- AWS S3 + CloudFront
- Heroku (for later versions with backend)

---

## Resources

### Learning Resources
- [MDN WebSocket API](https://developer.mozilla.org/en-US/docs/Web/API/WebSocket)
- [Deriv API Docs](https://api.deriv.com)
- [Technical Analysis Guide](https://www.investopedia.com)
- [JavaScript ES6+ Features](https://developer.mozilla.org/en-US/docs/Web/JavaScript)

### Tools
- Chrome DevTools (F12)
- VS Code with extensions
- Git/GitHub
- Postman (for API testing)

---

**Last Updated**: Version 1.0
**Status**: Active Development (V1 Stable)
**Maintainer**: Bechamdio
