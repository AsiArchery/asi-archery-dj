
export class RSSIMonitor {
  private rssiCallback: ((rssi: number) => void) | null = null;
  private rssiInterval: NodeJS.Timeout | null = null;
  private rssiHistory: number[] = [];
  private lastSignificantChange: number = 0;

  startMonitoring(connectedDevice: any): void {
    console.log('Starting RSSI monitoring...');
    
    this.rssiInterval = setInterval(async () => {
      try {
        let currentRssi: number;
        
        if (connectedDevice) {
          // Simulated RSSI for testing - in real implementation would read from device
          currentRssi = -50 + Math.sin(Date.now() / 5000) * 20 + Math.random() * 5;
        } else {
          currentRssi = -50 + Math.sin(Date.now() / 5000) * 20 + Math.random() * 5;
        }
        
        this.rssiHistory.push(currentRssi);
        if (this.rssiHistory.length > 5) {
          this.rssiHistory.shift();
        }
        
        const smoothedRssi = this.rssiHistory.reduce((sum, val) => sum + val, 0) / this.rssiHistory.length;
        
        if (Math.abs(smoothedRssi - this.lastSignificantChange) > 3) {
          this.lastSignificantChange = smoothedRssi;
          
          if (this.rssiCallback) {
            this.rssiCallback(smoothedRssi);
          }
        }
      } catch (error) {
        console.error('Failed to read RSSI:', error);
      }
    }, 2000);
  }

  stopMonitoring(): void {
    if (this.rssiInterval) {
      clearInterval(this.rssiInterval);
      this.rssiInterval = null;
      console.log('RSSI monitoring stopped');
    }
  }

  setCallback(callback: (rssi: number) => void): void {
    this.rssiCallback = callback;
  }

  reset(): void {
    this.rssiHistory = [];
    this.lastSignificantChange = 0;
  }
}
