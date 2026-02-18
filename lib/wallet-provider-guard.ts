/**
 * Wallet Provider Guard
 * 
 * This utility handles conflicts between multiple wallet extensions
 * trying to set the global ethereum provider.
 */

declare global {
  interface Window {
    ethereum?: any;
  }
}

export class WalletProviderGuard {
  private static initialized = false;
  private static originalEthereum: any = null;

  /**
   * Initialize the wallet provider guard
   * This should be called once when the app starts
   */
  static initialize(): void {
    if (this.initialized) return;
    
    // Store the original ethereum provider if it exists
    if (window.ethereum) {
      this.originalEthereum = window.ethereum;
    }

    // Set up a proxy to handle provider conflicts
    this.setupProviderProxy();
    
    this.initialized = true;
  }

  /**
   * Set up a proxy to handle multiple wallet providers
   */
  private static setupProviderProxy(): void {
    let provider = this.originalEthereum;

    // Define the ethereum property with a getter/setter that handles conflicts
    try {
      Object.defineProperty(window, 'ethereum', {
        get() {
          return provider;
        },
        set(value) {
          if (!provider) {
            provider = value;
            console.log('Wallet provider set successfully');
          } else {
            console.warn('Multiple wallet providers detected (MetaMask, evmAsk, etc.). Keeping existing provider to prevent conflicts.');
          }
        },
        configurable: true
      });
    } catch (error) {
      // If property is already defined, handle it gracefully
      console.warn('Ethereum property already defined, handling conflicts gracefully:', error);
      
      // Try to override with configurable property
      try {
        const existingDescriptor = Object.getOwnPropertyDescriptor(window, 'ethereum');
        if (existingDescriptor && !existingDescriptor.configurable) {
          console.warn('Ethereum property is not configurable, provider conflicts may occur');
          return;
        }
        
        Object.defineProperty(window, 'ethereum', {
          get() {
            return provider;
          },
          set(value) {
            if (!provider) {
              provider = value;
              console.log('Wallet provider set successfully');
            } else {
              console.warn('Multiple wallet providers detected (MetaMask, evmAsk, etc.). Keeping existing provider to prevent conflicts.');
            }
          },
          configurable: true
        });
      } catch (overrideError) {
        console.error('Could not override ethereum property:', overrideError);
      }
    }

    // Listen for provider conflicts and handle them
    setTimeout(() => {
      if (window.ethereum && window.ethereum !== provider) {
        console.warn('Provider conflict detected after initialization. This may cause wallet connection issues.');
      }
    }, 1000);
  }

  /**
   * Get the available wallet provider
   */
  static getProvider(): any | null {
    return this.originalEthereum || window.ethereum;
  }

  /**
   * Check if a wallet provider is available
   */
  static isProviderAvailable(): boolean {
    return !!(this.originalEthereum || window.ethereum);
  }
}

// Auto-initialize immediately when the module is imported
if (typeof window !== 'undefined') {
  // Initialize as early as possible to catch conflicts
  WalletProviderGuard.initialize();
}
