/**
 * Component documentation models and interfaces
 */

/**
 * Property information for a PrimeNG component
 */
export interface ComponentProperty {
  name: string;
  type: string;
  default?: string;
  description: string;
}

/**
 * Event information for a PrimeNG component
 */
export interface ComponentEvent {
  name: string;
  parameters: string;
  description: string;
}

/**
 * Method information for a PrimeNG component
 */
export interface ComponentMethod {
  name: string;
  parameters: string;
  description: string;
}

/**
 * Complete documentation for a PrimeNG component
 */
export interface ComponentDoc {
  name: string;
  description: string;
  importStatement: string;
  moduleImport: string;
  basicUsage: string;
  properties?: ComponentProperty[];
  events?: ComponentEvent[];
  methods?: ComponentMethod[];
}

/**
 * Cache metadata for tracking freshness and versions
 */
export interface CacheMetadata {
  version: string;
  lastUpdate: number;
  componentCount: number;
}

/**
 * Cache entry with TTL
 */
export interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number;
}

/**
 * Section within a guide document
 */
export interface GuideSection {
  heading: string;
  content: string;
  codeBlocks?: string[];
}

/**
 * Guide documentation (for setup/configuration pages)
 */
export interface GuideDoc {
  name: string;
  title: string;
  description: string;
  sections: GuideSection[];
  url: string;
}

/**
 * Configuration options for the server
 */
export interface ServerConfig {
  cache: {
    enabled: boolean;
    ttl: number;
    location: string;
  };
  scraping: {
    timeout: number;
    retries: number;
    rateLimit: number;
  };
  logging: {
    level: 'debug' | 'info' | 'warn' | 'error';
    file?: string;
  };
}
