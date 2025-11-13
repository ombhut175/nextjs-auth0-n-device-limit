/**
 * Custom Logger for Hackathon Development
 * Simple, effective logging compatible with Next.js
 * Replaces nexlog with a custom implementation
 */

// Logger configuration based on environment
const isDevelopment = process.env.NODE_ENV === 'development';
const logLevel = process.env.NEXT_PUBLIC_LOG_LEVEL || (isDevelopment ? 'debug' : 'info');

// Log levels
const LOG_LEVELS = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3,
} as const;

type LogLevel = keyof typeof LOG_LEVELS;

// Base logger function
const log = (level: LogLevel, message: string, data?: any) => {
  if (LOG_LEVELS[level] < LOG_LEVELS[logLevel as LogLevel]) {
    return; // Skip if log level is too low
  }

  const timestamp = new Date().toISOString();

  if (isDevelopment) {
    // Development: Use console with colors and formatting
    const levelEmoji = {
      debug: '🛠️',
      info: 'ℹ️',
      warn: '⚠️',
      error: '❌',
    };
    
    // Pass objects directly to console for better inspection
    if (data !== undefined) {
      console.log(`${levelEmoji[level]} [${level.toUpperCase()}] ${message}`, data);
    } else {
      console.log(`${levelEmoji[level]} [${level.toUpperCase()}] ${message}`);
    }
  } else {
    // Production: Structured JSON logging
    const logData = {
      timestamp,
      level,
      message,
      ...(data && { data }),
    };
    console.log(JSON.stringify(logData));
  }
};

/**
 * Hackathon-specific logger methods
 * Use these for consistent logging across the project
 */
export const hackLog = {
  // API Request logging
  apiRequest: (method: string, url: string, data?: any) => {
    log('info', `[API] ${method.toUpperCase()} ${url}`, { method, url, data });
  },
  
  apiSuccess: (method: string, url: string, response?: any) => {
    log('info', `[API] ${method.toUpperCase()} ${url} - Success`, { method, url, response });
  },
  
  apiError: (method: string, url: string, error: any) => {
    log('error', `[API] ${method.toUpperCase()} ${url} - Failed`, { method, url, error });
  },

  // Component lifecycle
  componentMount: (componentName: string, props?: any) => {
    log('debug', `[Component] ${componentName} mounted`, { componentName, props });
  },
  
  componentUpdate: (componentName: string, changes?: any) => {
    log('debug', `[Component] ${componentName} updated`, { componentName, changes });
  },

  // Store/State management
  storeAction: (action: string, payload?: any) => {
    log('debug', `[Store] ${action}`, { action, payload });
  },
  
  storeUpdate: (storeName: string, newState?: any) => {
    log('debug', `[Store] ${storeName} state updated`, { storeName, newState });
  },

  // Form handling
  formSubmit: (formName: string, data?: any) => {
    log('info', `[Form] ${formName} submitted`, { formName, data });
  },
  
  formValidation: (formName: string, errors?: any) => {
    log('warn', `[Form] ${formName} validation failed`, { formName, errors });
  },

  // Authentication
  authLogin: (userId?: string) => {
    log('info', `[Auth] User login`, { userId });
  },
  
  authLogout: (userId?: string) => {
    log('info', `[Auth] User logout`, { userId });
  },

  // Navigation/Routing
  routeChange: (from: string, to: string) => {
    log('debug', `[Route] Navigation: ${from} → ${to}`, { from, to });
  },

  // General development logs
  dev: (message: string, data?: any) => {
    log('debug', `[Dev] ${message}`, data);
  },
  
  info: (message: string, data?: any) => {
    log('info', `[Info] ${message}`, data);
  },
  
  warn: (message: string, data?: any) => {
    log('warn', `[Warn] ${message}`, data);
  },
  
  error: (message: string, error?: any) => {
    log('error', `[Error] ${message}`, { error });
  },

  // Performance tracking
  performanceStart: (label: string) => {
    log('debug', `[Perf] ${label} - Started`, { label });
    if (typeof window !== 'undefined' && window.performance) {
      window.performance.mark(`${label}-start`);
    } else if (typeof console !== 'undefined' && console.time) {
      console.time(label);
    }
  },
  
  performanceEnd: (label: string, duration?: number) => {
    let actualDuration = duration;
    
    if (typeof window !== 'undefined' && window.performance) {
      try {
        window.performance.mark(`${label}-end`);
        window.performance.measure(label, `${label}-start`, `${label}-end`);
        const measure = window.performance.getEntriesByName(label)[0];
        actualDuration = measure ? measure.duration : duration;
      } catch (e) {
        // Ignore performance measurement errors
      }
    } else if (typeof console !== 'undefined' && console.timeEnd) {
      console.timeEnd(label);
      // Note: console.timeEnd already logs the duration, so we don't need to log it again
      return;
    }
    
    log('debug', `[Perf] ${label} - Completed`, { 
      label, 
      duration: actualDuration ? `${actualDuration.toFixed(2)}ms` : 'unknown' 
    });
  },

  // Feature flags or experiments
  feature: (featureName: string, enabled: boolean, data?: any) => {
    log('info', `[Feature] ${featureName} ${enabled ? 'enabled' : 'disabled'}`, { featureName, enabled, data });
  },

  // Data processing
  dataProcess: (operation: string, inputCount?: number, outputCount?: number) => {
    log('debug', `[Data] ${operation}`, { operation, input: inputCount, output: outputCount });
  },

  // Cache operations
  cacheHit: (key: string) => {
    log('debug', `[Cache] Hit - ${key}`, { key, type: 'hit' });
  },
  
  cacheMiss: (key: string) => {
    log('debug', `[Cache] Miss - ${key}`, { key, type: 'miss' });
  },

  // WebSocket/Real-time events
  websocketConnect: (url?: string) => {
    log('info', `[WebSocket] Connected`, { url });
  },
  
  websocketMessage: (type: string, data?: any) => {
    log('debug', `[WebSocket] Message: ${type}`, { type, data });
  },

  // Advanced console methods for better debugging
  group: (label: string, data?: any) => {
    if (isDevelopment && typeof console !== 'undefined' && console.group) {
      console.group(`[Group] ${label}`, data);
    } else {
      log('debug', `[Group] ${label}`, data);
    }
  },

  groupEnd: () => {
    if (isDevelopment && typeof console !== 'undefined' && console.groupEnd) {
      console.groupEnd();
    }
  },

  table: (data: any, label?: string) => {
    if (isDevelopment && typeof console !== 'undefined' && console.table) {
      if (label) {
        console.log(`[Table] ${label}`);
      }
      console.table(data);
    } else {
      log('debug', `[Table] ${label || 'Data'}`, data);
    }
  },

  dir: (object: any, label?: string) => {
    if (isDevelopment && typeof console !== 'undefined' && console.dir) {
      if (label) {
        console.log(`[Dir] ${label}`);
      }
      console.dir(object);
    } else {
      log('debug', `[Dir] ${label || 'Object'}`, object);
    }
  },

  trace: (message: string, data?: any) => {
    if (isDevelopment && typeof console !== 'undefined' && console.trace) {
      console.trace(`[Trace] ${message}`, data);
    } else {
      log('debug', `[Trace] ${message}`, data);
    }
  },

  // Direct console method wrappers for debugging
  console: {
    log: (message: string, ...args: any[]) => {
      if (isDevelopment) {
        console.log(`[Console] ${message}`, ...args);
      } else {
        log('info', message, args.length > 0 ? args : undefined);
      }
    },

    warn: (message: string, ...args: any[]) => {
      if (isDevelopment) {
        console.warn(`[Warning] ${message}`, ...args);
      } else {
        log('warn', message, args.length > 0 ? args : undefined);
      }
    },

    error: (message: string, ...args: any[]) => {
      if (isDevelopment) {
        console.error(`[Error] ${message}`, ...args);
      } else {
        log('error', message, args.length > 0 ? args : undefined);
      }
    },

    debug: (message: string, ...args: any[]) => {
      if (isDevelopment) {
        console.debug(`[Debug] ${message}`, ...args);
      } else {
        log('debug', message, args.length > 0 ? args : undefined);
      }
    },

    assert: (condition: boolean, message: string, ...args: any[]) => {
      if (isDevelopment && typeof console !== 'undefined' && console.assert) {
        console.assert(condition, `[Assert] ${message}`, ...args);
      } else if (!condition) {
        log('error', `Assertion failed: ${message}`, args.length > 0 ? args : undefined);
      }
    },

    count: (label: string = 'default') => {
      if (isDevelopment && typeof console !== 'undefined' && console.count) {
        console.count(`[Count] ${label}`);
      }
    },

    countReset: (label: string = 'default') => {
      if (isDevelopment && typeof console !== 'undefined' && console.countReset) {
        console.countReset(label);
      }
    },

    clear: () => {
      if (isDevelopment && typeof console !== 'undefined' && console.clear) {
        console.clear();
      }
    },
  },

  // Network/HTTP debugging
  http: {
    request: (method: string, url: string, headers?: any, body?: any) => {
      log('debug', `[HTTP] ${method} ${url}`, { method, url, headers, body });
    },

    response: (status: number, url: string, data?: any) => {
      const level = status >= 400 ? 'error' : status >= 300 ? 'warn' : 'info';
      log(level, `[HTTP] ${status} ${url}`, { status, url, data });
    },

    timeout: (url: string, duration: number) => {
      log('warn', `[HTTP] Timeout after ${duration}ms - ${url}`, { url, duration });
    },

    retry: (url: string, attempt: number, maxAttempts: number) => {
      log('warn', `[HTTP] Retry ${attempt}/${maxAttempts} - ${url}`, { url, attempt, maxAttempts });
    },
  },

  // Database/Query debugging
  db: {
    query: (sql: string, params?: any) => {
      log('debug', `[DB] Query executed`, { sql, params });
    },

    queryTime: (sql: string, duration: number) => {
      const level = duration > 1000 ? 'warn' : 'debug';
      log(level, `[DB] Query completed in ${duration}ms`, { sql, duration });
    },

    error: (operation: string, error: any) => {
      log('error', `[DB] ${operation} failed`, { operation, error });
    },

    transaction: (action: 'start' | 'commit' | 'rollback') => {
      log('debug', `[DB] Transaction ${action}`, { action });
    },
  },

  // Validation/Schema debugging
  validation: {
    start: (schema: string, data?: any) => {
      log('debug', `[Validation] Starting ${schema}`, { schema, data });
    },

    success: (schema: string) => {
      log('debug', `[Validation] ${schema} passed`, { schema });
    },

    error: (schema: string, errors: any) => {
      log('warn', `[Validation] ${schema} failed`, { schema, errors });
    },
  },

  // Security/Auth debugging
  security: {
    unauthorized: (resource: string, userId?: string) => {
      log('warn', `[Security] Unauthorized access attempt to ${resource}`, { resource, userId });
    },

    forbidden: (resource: string, userId?: string) => {
      log('warn', `[Security] Forbidden access to ${resource}`, { resource, userId });
    },

    tokenExpired: (tokenType: string) => {
      log('warn', `[Security] ${tokenType} token expired`, { tokenType });
    },

    suspicious: (activity: string, details?: any) => {
      log('error', `[Security] Suspicious activity: ${activity}`, { activity, details });
    },
  },

  // Environment/Config debugging
  env: {
    missing: (variable: string) => {
      log('error', `[Env] Missing environment variable: ${variable}`, { variable });
    },

    loaded: (variables: string[]) => {
      log('info', `[Env] Loaded ${variables.length} environment variables`, { count: variables.length });
    },

    mismatch: (variable: string, expected: string, actual: string) => {
      log('warn', `[Env] ${variable} mismatch`, { variable, expected, actual });
    },
  },

  // Memory/Resource debugging
  memory: {
    usage: (label: string) => {
      if (typeof process !== 'undefined' && process.memoryUsage) {
        const usage = process.memoryUsage();
        log('debug', `[Memory] ${label}`, {
          label,
          heapUsed: `${Math.round(usage.heapUsed / 1024 / 1024)}MB`,
          heapTotal: `${Math.round(usage.heapTotal / 1024 / 1024)}MB`,
          rss: `${Math.round(usage.rss / 1024 / 1024)}MB`,
        });
      }
    },

    leak: (object: string, count: number) => {
      log('error', `[Memory] Potential leak detected: ${object}`, { object, count });
    },
  },

  // Async/Promise debugging
  async: {
    pending: (operation: string) => {
      log('debug', `[Async] ${operation} pending`, { operation });
    },

    resolved: (operation: string, result?: any) => {
      log('debug', `[Async] ${operation} resolved`, { operation, result });
    },

    rejected: (operation: string, error: any) => {
      log('error', `[Async] ${operation} rejected`, { operation, error });
    },

    timeout: (operation: string, duration: number) => {
      log('warn', `[Async] ${operation} timed out after ${duration}ms`, { operation, duration });
    },
  },
};

// Export the base logger for advanced usage
export const logger = { log };

// Export default hackLog for easy imports
export default hackLog;
