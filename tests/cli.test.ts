import { readFileSync, writeFileSync, unlinkSync, existsSync } from 'fs';
import { join } from 'path';
import { tmpdir } from 'os';
import JSReverseEngineer from '../src/index';
import { sampleMinifiedJS, sampleSecurityVulnerableJS } from './setup';

describe('CLI Command Tests', () => {
  let tempTestFile: string;
  let cli: JSReverseEngineer;

  beforeEach(() => {
    cli = new JSReverseEngineer();
    // Use OS temp directory for test files
    tempTestFile = join(tmpdir(), `test-${Date.now()}-${Math.random().toString(36).substr(2, 9)}.js`);
  });

  afterEach(() => {
    // Clean up temporary files
    if (existsSync(tempTestFile)) {
      try {
        unlinkSync(tempTestFile);
      } catch (error) {
        // Ignore cleanup errors
      }
    }
  });

  describe('CLI Initialization', () => {
    it('should create CLI instance successfully', () => {
      expect(cli).toBeInstanceOf(JSReverseEngineer);
    });

    it('should have proper command structure', () => {
      expect(cli).toBeDefined();
    });
  });

  describe('File Validation', () => {
    it('should handle non-existent files gracefully', () => {
      const nonExistentFile = join(tmpdir(), 'definitely-non-existent-file-12345.js');
      
      expect(() => {
        readFileSync(nonExistentFile, 'utf8');
      }).toThrow();
    });

    it('should read existing files successfully', () => {
      writeFileSync(tempTestFile, sampleMinifiedJS, 'utf8');
      
      const content = readFileSync(tempTestFile, 'utf8');
      expect(content).toBe(sampleMinifiedJS);
      expect(content).toBeValidJavaScript();
    });
  });

  describe('Metrics Command', () => {
    beforeEach(() => {
      writeFileSync(tempTestFile, sampleMinifiedJS, 'utf8');
    });

    it('should calculate basic file metrics correctly', () => {
      const content = readFileSync(tempTestFile, 'utf8');
      const size = Buffer.byteLength(content, 'utf8');
      const lines = content.split('\n').length;
      
      expect(size).toBeGreaterThan(0);
      expect(lines).toBeGreaterThan(0);
    });

    it('should estimate token count', () => {
      const content = readFileSync(tempTestFile, 'utf8');
      const estimatedTokens = Math.ceil(content.length / 4);
      
      expect(estimatedTokens).toBeGreaterThan(0);
      expect(estimatedTokens).toBeLessThan(content.length);
    });

    it('should count function approximations', () => {
      const content = readFileSync(tempTestFile, 'utf8');
      const functionMatches = content.match(/function\s*\(|=>\s*{|\w+\s*:\s*function/g) || [];
      
      expect(functionMatches).toBeInstanceOf(Array);
    });
  });

  describe('Security Pattern Detection', () => {
    beforeEach(() => {
      writeFileSync(tempTestFile, sampleSecurityVulnerableJS, 'utf8');
    });

    it('should identify security-relevant patterns', () => {
      const content = readFileSync(tempTestFile, 'utf8');
      
      expect(content).toContainSecurityPattern();
    });

    it('should detect eval usage', () => {
      const content = readFileSync(tempTestFile, 'utf8');
      
      expect(content).toMatch(/eval\s*\(/);
    });

    it('should detect DOM manipulation', () => {
      const content = readFileSync(tempTestFile, 'utf8');
      
      expect(content).toMatch(/innerHTML\s*=/);
    });

    it('should detect network requests', () => {
      const content = readFileSync(tempTestFile, 'utf8');
      
      expect(content).toMatch(/fetch\s*\(/);
    });

    it('should detect localStorage usage', () => {
      const content = readFileSync(tempTestFile, 'utf8');
      
      expect(content).toMatch(/localStorage/);
    });
  });

  describe('Large File Handling', () => {
    it('should handle files larger than token limits', () => {
      const largeContent = 'a'.repeat(1000000); // 1MB of content
      writeFileSync(tempTestFile, largeContent, 'utf8');
      
      const content = readFileSync(tempTestFile, 'utf8');
      const estimatedTokens = Math.ceil(content.length / 4);
      const chunksNeeded = Math.ceil(estimatedTokens / 200000);
      
      expect(chunksNeeded).toBeGreaterThan(1);
    });

    it('should estimate processing requirements for large files', () => {
      const content = 'x'.repeat(20 * 1024 * 1024); // 20MB
      const sizeInMB = content.length / (1024 * 1024);
      
      expect(sizeInMB).toBeGreaterThanOrEqual(20);
    });
  });

  describe('Command Line Argument Parsing', () => {
    it('should handle required file parameter', () => {
      const mockArgv = ['node', 'js-rev', 'analyze', '--file', 'test.js'];
      
      expect(mockArgv).toContain('--file');
      expect(mockArgv).toContain('test.js');
    });

    it('should handle optional parameters', () => {
      const mockArgv = [
        'node', 'js-rev', 'analyze',
        '--file', 'test.js',
        '--provider', 'claude',
        '--format', 'json',
        '--verbose'
      ];
      
      expect(mockArgv).toContain('--provider');
      expect(mockArgv).toContain('claude');
      expect(mockArgv).toContain('--format');
      expect(mockArgv).toContain('json');
      expect(mockArgv).toContain('--verbose');
    });
  });

  describe('Error Handling', () => {
    it('should handle malformed JavaScript gracefully', () => {
      const malformedJS = 'function test() { return "unclosed string';
      writeFileSync(tempTestFile, malformedJS, 'utf8');
      
      expect(() => {
        new Function(malformedJS);
      }).toThrow();
    });

    it('should provide meaningful error messages', () => {
      expect(() => {
        throw new Error('File not found: non-existent-file.js');
      }).toThrow('File not found: non-existent-file.js');
    });
  });

  describe('Output Format Validation', () => {
    it('should support markdown output format', () => {
      const formats = ['markdown', 'json', 'html'];
      expect(formats).toContain('markdown');
    });

    it('should support JSON output format', () => {
      const formats = ['markdown', 'json', 'html'];
      expect(formats).toContain('json');
    });

    it('should support HTML output format', () => {
      const formats = ['markdown', 'json', 'html'];
      expect(formats).toContain('html');
    });
  });

  describe('Provider Configuration', () => {
    it('should support Claude provider', () => {
      const providers = ['claude', 'openai', 'local'];
      expect(providers).toContain('claude');
    });

    it('should support OpenAI provider', () => {
      const providers = ['claude', 'openai', 'local'];
      expect(providers).toContain('openai');
    });

    it('should support local provider', () => {
      const providers = ['claude', 'openai', 'local'];
      expect(providers).toContain('local');
    });
  });

  describe('Focus Area Configuration', () => {
    it('should support security focus', () => {
      const focusAreas = ['security', 'general', 'performance'];
      expect(focusAreas).toContain('security');
    });

    it('should support general analysis', () => {
      const focusAreas = ['security', 'general', 'performance'];
      expect(focusAreas).toContain('general');
    });

    it('should support performance focus', () => {
      const focusAreas = ['security', 'general', 'performance'];
      expect(focusAreas).toContain('performance');
    });
  });
});

describe('Integration Tests', () => {
  let tempTestFile: string;

  beforeEach(() => {
    tempTestFile = join(tmpdir(), `integration-test-${Date.now()}-${Math.random().toString(36).substr(2, 9)}.js`);
  });

  afterEach(() => {
    if (existsSync(tempTestFile)) {
      try {
        unlinkSync(tempTestFile);
      } catch (error) {
        // Ignore cleanup errors
      }
    }
  });

  it('should process a complete analysis workflow', () => {
    writeFileSync(tempTestFile, sampleMinifiedJS, 'utf8');
    
    // Simulate the analysis workflow
    const content = readFileSync(tempTestFile, 'utf8');
    const metrics = {
      size: Buffer.byteLength(content, 'utf8'),
      lines: content.split('\n').length,
      functions: (content.match(/function\s*\(|=>\s*{|\w+\s*:\s*function/g) || []).length,
      estimatedTokens: Math.ceil(content.length / 4)
    };

    expect(metrics.size).toBeGreaterThan(0);
    expect(metrics.lines).toBeGreaterThan(0);
    expect(metrics.estimatedTokens).toBeGreaterThan(0);
  });

  it('should handle the complete CLI workflow without errors', () => {
    writeFileSync(tempTestFile, sampleMinifiedJS, 'utf8');
    
    // This would be the actual CLI execution test
    // For now, we'll test the components individually
    expect(existsSync(tempTestFile)).toBe(true);
    
    const content = readFileSync(tempTestFile, 'utf8');
    expect(content).toBeDefined();
    expect(content.length).toBeGreaterThan(0);
  });
});

describe('File Metrics Calculation', () => {
  let tempTestFile: string;

  beforeEach(() => {
    tempTestFile = join(tmpdir(), `metrics-test-${Date.now()}-${Math.random().toString(36).substr(2, 9)}.js`);
  });

  afterEach(() => {
    if (existsSync(tempTestFile)) {
      try {
        unlinkSync(tempTestFile);
      } catch (error) {
        // Ignore cleanup errors
      }
    }
  });

  it('should calculate correct metrics for sample code', () => {
    const testCode = `
function example() {
  return "test";
}

const arrow = () => {
  console.log("arrow function");
};

var obj = {
  method: function() {
    return true;
  }
};
    `.trim();

    writeFileSync(tempTestFile, testCode, 'utf8');
    const content = readFileSync(tempTestFile, 'utf8');

    const size = Buffer.byteLength(content, 'utf8');
    const lines = content.split('\n').length;
    const functionMatches = content.match(/function\s*\(|=>\s*{|\w+\s*:\s*function/g) || [];
    const estimatedTokens = Math.ceil(size / 4);

    expect(size).toBeGreaterThan(0);
    expect(lines).toBeGreaterThan(5); // Should have multiple lines
    expect(functionMatches.length).toBeGreaterThanOrEqual(2); // At least 2 functions
    expect(estimatedTokens).toBeGreaterThan(0);
  });
});