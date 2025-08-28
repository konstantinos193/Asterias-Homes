import Head from 'next/head'

interface PerformanceOptimizerProps {
  preloadImages?: string[]
  preloadFonts?: string[]
  preconnectDomains?: string[]
  dnsPrefetchDomains?: string[]
}

export default function PerformanceOptimizer({
  preloadImages = [],
  preloadFonts = [],
  preconnectDomains = [],
  dnsPrefetchDomains = []
}: PerformanceOptimizerProps) {
  return (
    <Head>
      {/* Preload critical images */}
      {preloadImages.map((image, index) => (
        <link
          key={`preload-image-${index}`}
          rel="preload"
          as="image"
          href={image}
          type="image/png"
        />
      ))}
      
      {/* Preload critical fonts */}
      {preloadFonts.map((font, index) => (
        <link
          key={`preload-font-${index}`}
          rel="preload"
          as="font"
          href={font}
          type="font/woff2"
          crossOrigin="anonymous"
        />
      ))}
      
      {/* Preconnect to external domains */}
      {preconnectDomains.map((domain, index) => (
        <link
          key={`preconnect-${index}`}
          rel="preconnect"
          href={domain}
        />
      ))}
      
      {/* DNS prefetch for performance */}
      {dnsPrefetchDomains.map((domain, index) => (
        <link
          key={`dns-prefetch-${index}`}
          rel="dns-prefetch"
          href={domain}
        />
      ))}
      
      {/* Resource hints for better performance */}
      <link rel="preload" href="/hero-1.png" as="image" />
      <link rel="preload" href="/hero-2.png" as="image" />
      
      {/* Critical CSS inlining would go here if needed */}
      <style dangerouslySetInnerHTML={{
        __html: `
          /* Critical CSS for above-the-fold content */
          .hero-section { 
            display: block; 
            visibility: visible; 
          }
          .font-cormorant { 
            font-family: var(--font-cormorant), serif; 
          }
          .font-alegreya { 
            font-family: var(--font-alegreya), sans-serif; 
          }
        `
      }} />
    </Head>
  )
}
