// Jest test setup file
import 'jest';

// Extend Jest matchers if needed
declare global {
  namespace jest {
    interface Matchers<R> {
      toBeValidJavaScript(): R;
      toContainSecurityPattern(): R;
    }
  }
}

// Global test configuration
beforeAll(() => {
  // Set up global test environment
  process.env.NODE_ENV = 'test';
  
  // Suppress console.log during tests unless verbose
  if (!process.env.VERBOSE_TESTS) {
    jest.spyOn(console, 'log').mockImplementation(() => {});
    jest.spyOn(console, 'info').mockImplementation(() => {});
  }
  
  // Mock process.exit to prevent tests from actually exiting
  jest.spyOn(process, 'exit').mockImplementation((code?: number) => {
    throw new Error(`Process.exit called with code: ${code}`);
  });
});

afterAll(() => {
  // Restore all mocks
  jest.restoreAllMocks();
});

beforeEach(() => {
  // Clear all mocks before each test
  jest.clearAllMocks();
});

// Custom matchers
expect.extend({
  toBeValidJavaScript(received: string) {
    try {
      // Try to parse as JavaScript
      new Function(received);
      return {
        message: () => `Expected ${received} not to be valid JavaScript`,
        pass: true,
      };
    } catch (error) {
      return {
        message: () => `Expected ${received} to be valid JavaScript, but got error: ${error}`,
        pass: false,
      };
    }
  },

  toContainSecurityPattern(received: string) {
    const securityPatterns = [
      /eval\s*\(/,
      /Function\s*\(/,
      /document\.write/,
      /innerHTML\s*=/,
      /outerHTML\s*=/,
      /\.src\s*=/,
      /window\.location/,
      /document\.location/,
      /localStorage/,
      /sessionStorage/,
      /document\.cookie/,
      /XMLHttpRequest/,
      /fetch\s*\(/,
      /WebSocket/,
      /postMessage/,
    ];

    const foundPatterns = securityPatterns.filter(pattern => pattern.test(received));
    
    return {
      message: () =>
        foundPatterns.length > 0
          ? `Expected ${received} not to contain security patterns, but found: ${foundPatterns.join(', ')}`
          : `Expected ${received} to contain security patterns, but none were found`,
      pass: foundPatterns.length > 0,
    };
  },
});

// Utility functions for tests
export const createMockJavaScriptFile = (content: string): string => {
  return content;
};

export const createLargeJavaScriptFile = (sizeInMB: number): string => {
  const targetSize = sizeInMB * 1024 * 1024;
  const baseCode = 'function test() { return "hello world"; }';
  const repetitions = Math.ceil(targetSize / baseCode.length);
  return baseCode.repeat(repetitions);
};

// Test data
export const sampleMinifiedJS = `!function(e,t){"object"==typeof exports?module.exports=t():"function"==typeof define?define(t):e.myLib=t()}(this,function(){"use strict";function test(e){return e+1}return{test:test,version:"1.0.0"}});`;

export const sampleSecurityVulnerableJS = `
function unsafeEval(userInput) {
  return eval(userInput);
}

function xssVuln(data) {
  document.getElementById('content').innerHTML = data;
}

function trackUser() {
  localStorage.setItem('userId', Math.random());
  fetch('/api/track', {
    method: 'POST',
    body: JSON.stringify({ user: navigator.userAgent })
  });
}
`;

export const sampleLibraryCode = `
// jQuery-like library code
(function(global, factory) {
  if (typeof module === "object" && typeof module.exports === "object") {
    module.exports = factory(global, true);
  } else {
    factory(global);
  }
})(typeof window !== "undefined" ? window : this, function(window, noGlobal) {
  var $ = function(selector) {
    return new $.fn.init(selector);
  };
  $.fn = $.prototype = {
    jquery: "3.6.0",
    constructor: $,
    length: 0
  };
  return $;
});
`;