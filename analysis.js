// Technical Analysis Engine
class TechnicalAnalyzer {
    constructor() {
        this.prices = [];
        this.maxPrices = 100;
    }

    // Add price tick to analysis
    addPrice(price) {
        this.prices.push(price);
        if (this.prices.length > this.maxPrices) {
            this.prices.shift();
        }
    }

    // Get current prices
    getPrices() {
        return [...this.prices];
    }

    // Clear all prices
    clear() {
        this.prices = [];
    }

    // Calculate simple moving average
    calculateSMA(period = 20) {
        if (this.prices.length < period) return null;

        const sum = this.prices.slice(-period).reduce((a, b) => a + b, 0);
        return sum / period;
    }

    // Calculate exponential moving average
    calculateEMA(period = 20) {
        if (this.prices.length < period) return null;

        const k = 2 / (period + 1);
        let ema = this.prices[0];

        for (let i = 1; i < this.prices.length; i++) {
            ema = this.prices[i] * k + ema * (1 - k);
        }

        return ema;
    }

    // Calculate volatility (standard deviation)
    calculateVolatility(period = 20) {
        if (this.prices.length < period) return null;

        const recentPrices = this.prices.slice(-period);
        const mean = recentPrices.reduce((a, b) => a + b, 0) / period;
        const variance = recentPrices.reduce((sum, price) => sum + Math.pow(price - mean, 2), 0) / period;
        const stdDev = Math.sqrt(variance);

        // Calculate as percentage of mean
        return (stdDev / mean) * 100;
    }

    // Calculate recent movement (pips)
    calculateMovement(period = 20) {
        if (this.prices.length < 2) return 0;

        const recent = this.prices.slice(-period);
        if (recent.length === 0) return 0;

        const highest = Math.max(...recent);
        const lowest = Math.min(...recent);
        const movement = highest - lowest;

        // Convert to pips (assuming 5 decimal places for Forex)
        return movement * 10000;
    }

    // Calculate high/low prices
    getHighLow(period = 20) {
        if (this.prices.length < period) return { high: null, low: null };

        const recent = this.prices.slice(-period);
        return {
            high: Math.max(...recent),
            low: Math.min(...recent)
        };
    }

    // Calculate average price
    getAverage(period = 20) {
        if (this.prices.length < period) return null;

        const recent = this.prices.slice(-period);
        return recent.reduce((a, b) => a + b, 0) / recent.length;
    }

    // Calculate standard deviation
    getStdDev(period = 20) {
        if (this.prices.length < period) return null;

        const recent = this.prices.slice(-period);
        const mean = recent.reduce((a, b) => a + b, 0) / recent.length;
        const variance = recent.reduce((sum, price) => sum + Math.pow(price - mean, 2), 0) / recent.length;

        return Math.sqrt(variance);
    }

    // Calculate RSI (Relative Strength Index)
    calculateRSI(period = 14) {
        if (this.prices.length < period + 1) return null;

        const changes = [];
        for (let i = this.prices.length - period - 1; i < this.prices.length; i++) {
            if (i > 0) {
                changes.push(this.prices[i] - this.prices[i - 1]);
            }
        }

        if (changes.length === 0) return null;

        const gains = changes.filter(c => c > 0).reduce((a, b) => a + b, 0) / period;
        const losses = Math.abs(changes.filter(c => c < 0).reduce((a, b) => a + b, 0)) / period;

        if (losses === 0) return 100;

        const rs = gains / losses;
        const rsi = 100 - (100 / (1 + rs));

        return rsi;
    }

    // Calculate MACD (Moving Average Convergence Divergence)
    calculateMACD() {
        const ema12 = this.calculateEMA(12);
        const ema26 = this.calculateEMA(26);

        if (ema12 === null || ema26 === null) return null;

        const macd = ema12 - ema26;
        return { macd, ema12, ema26 };
    }

    // Get complete analysis
    analyze(period = 20) {
        return {
            prices: this.getPrices(),
            count: this.prices.length,
            sma: this.calculateSMA(period),
            ema: this.calculateEMA(period),
            volatility: this.calculateVolatility(period),
            movement: this.calculateMovement(period),
            highLow: this.getHighLow(period),
            average: this.getAverage(period),
            stdDev: this.getStdDev(period),
            rsi: this.calculateRSI(14),
            macd: this.calculateMACD()
        };
    }
}

// Signal Generator - Determines BUY/SELL/WAIT signals
class SignalGenerator {
    constructor(analyzer) {
        this.analyzer = analyzer;
        this.signalThreshold = 60; // Signal strength threshold
    }

    // Generate trading signal
    generateSignal() {
        const analysis = this.analyzer.analyze();

        if (analysis.count < 20) {
            return {
                signal: 'WAIT',
                strength: 0,
                reason: 'Insufficient data for analysis'
            };
        }

        const volatility = analysis.volatility || 0;
        const rsi = analysis.rsi || 50;
        const macd = analysis.macd;
        const movement = analysis.movement || 0;

        let score = 50; // Base score
        let signals = [];

        // RSI Analysis (0-100)
        if (rsi < 30) {
            score += 15;
            signals.push('RSI oversold');
        } else if (rsi > 70) {
            score -= 15;
            signals.push('RSI overbought');
        }

        // Volatility Analysis
        if (volatility > 5) {
            score += 10;
            signals.push('High volatility');
        }

        // Movement Analysis
        if (movement > 100) {
            score += 5;
            signals.push('Strong movement');
        }

        // MACD Analysis
        if (macd && macd.macd > 0) {
            score += 10;
            signals.push('MACD positive');
        } else if (macd && macd.macd < 0) {
            score -= 10;
            signals.push('MACD negative');
        }

        // Determine signal
        let signal = 'WAIT';
        if (score > 65) {
            signal = 'BUY';
        } else if (score < 35) {
            signal = 'SELL';
        }

        // Clamp score between 0 and 100
        score = Math.max(0, Math.min(100, score));

        return {
            signal,
            strength: score,
            reason: signals.join(', ') || 'Neutral market conditions',
            rsi,
            volatility,
            movement,
            analysis
        };
    }

    // Set custom signal threshold
    setThreshold(threshold) {
        this.signalThreshold = threshold;
    }
}

// Export analyzer and signal generator
const analyzer = new TechnicalAnalyzer();
const signalGenerator = new SignalGenerator(analyzer);
