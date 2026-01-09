
/**
 * Memory monitoring utility for development
 * Logs memory usage warnings if leaks are detected
 */
export class MemoryMonitor {
  private static interval: NodeJS.Timeout | null = null;
  private static isEnabled = false;
  
  /**
   * Start monitoring memory usage
   * @param thresholdMB - Memory threshold in MB to trigger warnings (default: 100MB)
   * @param checkIntervalMs - How often to check memory (default: 30000ms = 30 seconds)
   */
  static start(thresholdMB = 100, checkIntervalMs = 30000) {
    if (typeof window === 'undefined') return;
    if (this.isEnabled) {
      console.warn('Memory monitor is already running');
      return;
    }
    
    // Check if memory API is available (Chrome/Edge only)
    const memory = (performance as any).memory;
    if (!memory) {
      console.warn('Memory API not available in this browser');
      return;
    }
    
    this.isEnabled = true;
    console.log(`🔍 Memory monitor started (threshold: ${thresholdMB}MB, interval: ${checkIntervalMs}ms)`);
    
    // Use standard setInterval with manual cleanup
    this.interval = setInterval(() => {
      const usedMB = memory.usedJSHeapSize / 1048576;
      const totalMB = memory.totalJSHeapSize / 1048576;
      const limitMB = memory.jsHeapSizeLimit / 1048576;
      
      if (usedMB > thresholdMB) {
        console.warn(
          `⚠️ High memory usage detected: ${usedMB.toFixed(2)}MB / ${totalMB.toFixed(2)}MB ` +
          `(limit: ${limitMB.toFixed(2)}MB)`
        );
      } else if (process.env.NODE_ENV === 'development') {
        // Only log in development to avoid noise in production
        console.log(
          `📊 Memory usage: ${usedMB.toFixed(2)}MB / ${totalMB.toFixed(2)}MB`
        );
      }
    }, checkIntervalMs);
  }
  
  /**
   * Stop monitoring memory usage
   */
  static stop() {
    if (this.interval) {
      clearInterval(this.interval);
      this.interval = null;
      this.isEnabled = false;
      console.log('🔍 Memory monitor stopped');
    }
  }
  
  /**
   * Get current memory usage statistics
   * @returns Memory usage stats or null if API not available
   */
  static getStats() {
    if (typeof window === 'undefined') return null;
    
    const memory = (performance as any).memory;
    if (!memory) return null;
    
    return {
      usedMB: memory.usedJSHeapSize / 1048576,
      totalMB: memory.totalJSHeapSize / 1048576,
      limitMB: memory.jsHeapSizeLimit / 1048576,
      percentage: (memory.usedJSHeapSize / memory.jsHeapSizeLimit) * 100
    };
  }
  
  /**
   * Check if memory usage exceeds threshold
   * @param thresholdMB - Threshold in MB
   * @returns true if usage exceeds threshold
   */
  static checkThreshold(thresholdMB = 100): boolean {
    const stats = this.getStats();
    if (!stats) return false;
    return stats.usedMB > thresholdMB;
  }
}

// Note: Memory monitoring is now initialized via MemoryMonitorInit component
// This ensures proper React lifecycle management and cleanup

