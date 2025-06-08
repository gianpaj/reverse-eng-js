#!/usr/bin/env node

import { Command } from 'commander';
import { readFileSync, existsSync } from 'fs';
import { join } from 'path';

// Types
interface AnalysisOptions {
  file: string;
  output?: string;
  provider?: 'claude' | 'openai' | 'local';
  focus?: 'security' | 'general' | 'performance';
  format?: 'markdown' | 'json' | 'html';
  verbose?: boolean;
  maxTokens?: number;
  filterLibraries?: boolean;
}

interface FileMetrics {
  size: number;
  lines: number;
  functions: number;
  estimatedTokens: number;
}

// Main CLI class
class JSReverseEngineer {
  private program: Command;

  constructor() {
    this.program = new Command();
    this.setupCommands();
  }

  private setupCommands(): void {
    this.program
      .name('js-rev')
      .description('Reverse engineer and analyze large minimized JavaScript files using LLMs')
      .version(this.getVersion());

    // Main analyze command
    this.program
      .command('analyze')
      .description('Analyze a JavaScript file for security and functionality insights')
      .requiredOption('-f, --file <path>', 'Path to the JavaScript file to analyze')
      .option('-o, --output <path>', 'Output file path (default: stdout)')
      .option('-p, --provider <provider>', 'LLM provider to use', 'claude')
      .option('--focus <type>', 'Analysis focus area', 'security')
      .option('--format <format>', 'Output format', 'markdown')
      .option('-v, --verbose', 'Enable verbose logging')
      .option('--max-tokens <number>', 'Maximum tokens per LLM request', '180000')
      .option('--no-filter-libraries', 'Disable library filtering')
      .action(this.handleAnalyze.bind(this));

    // Utility commands
    this.program
      .command('metrics')
      .description('Get basic metrics about a JavaScript file')
      .requiredOption('-f, --file <path>', 'Path to the JavaScript file')
      .action(this.handleMetrics.bind(this));

    this.program
      .command('libraries')
      .description('Detect and list known libraries in a JavaScript file')
      .requiredOption('-f, --file <path>', 'Path to the JavaScript file')
      .action(this.handleLibraries.bind(this));
  }

  private getVersion(): string {
    try {
      const packagePath = join(__dirname, '..', 'package.json');
      if (existsSync(packagePath)) {
        const packageJson = JSON.parse(readFileSync(packagePath, 'utf8'));
        return packageJson.version || '0.1.0';
      }
    } catch (error) {
      // Fallback version
    }
    return '0.1.0';
  }

  private async handleAnalyze(options: AnalysisOptions): Promise<void> {
    try {
      console.log('🔍 Starting JavaScript analysis...');
      
      if (options.verbose) {
        console.log('Options:', JSON.stringify(options, null, 2));
      }

      // Validate input file
      if (!existsSync(options.file)) {
        console.error(`❌ Error: File not found: ${options.file}`);
        process.exit(1);
      }

      const fileContent = readFileSync(options.file, 'utf8');
      const metrics = this.getFileMetrics(fileContent);

      console.log(`📊 File metrics:`);
      console.log(`   Size: ${(metrics.size / 1024 / 1024).toFixed(2)} MB`);
      console.log(`   Lines: ${metrics.lines.toLocaleString()}`);
      console.log(`   Estimated tokens: ${metrics.estimatedTokens.toLocaleString()}`);

      if (metrics.size > 50 * 1024 * 1024) { // 50MB
        console.warn('⚠️  Large file detected. Analysis may take significant time.');
      }

      // TODO: Implement actual analysis logic
      console.log('🚧 Analysis engine not yet implemented. See ROADMAP.md for development progress.');
      console.log('📋 Next steps:');
      console.log('   1. Implement JavaScript parsing');
      console.log('   2. Add library detection');
      console.log('   3. Integrate LLM providers');
      console.log('   4. Build chunking strategy');

    } catch (error) {
      console.error('❌ Analysis failed:', error instanceof Error ? error.message : error);
      process.exit(1);
    }
  }

  private async handleMetrics(options: { file: string }): Promise<void> {
    try {
      if (!existsSync(options.file)) {
        console.error(`❌ Error: File not found: ${options.file}`);
        process.exit(1);
      }

      const fileContent = readFileSync(options.file, 'utf8');
      const metrics = this.getFileMetrics(fileContent);

      console.log('📊 JavaScript File Metrics:');
      console.log('─'.repeat(40));
      console.log(`File size: ${(metrics.size / 1024 / 1024).toFixed(2)} MB`);
      console.log(`Lines: ${metrics.lines.toLocaleString()}`);
      console.log(`Estimated functions: ${metrics.functions.toLocaleString()}`);
      console.log(`Estimated tokens: ${metrics.estimatedTokens.toLocaleString()}`);
      console.log(`Chunks needed (200k tokens): ${Math.ceil(metrics.estimatedTokens / 200000)}`);

    } catch (error) {
      console.error('❌ Metrics calculation failed:', error instanceof Error ? error.message : error);
      process.exit(1);
    }
  }

  private async handleLibraries(options: { file: string }): Promise<void> {
    try {
      if (!existsSync(options.file)) {
        console.error(`❌ Error: File not found: ${options.file}`);
        process.exit(1);
      }

      console.log('📚 Library Detection:');
      console.log('─'.repeat(40));
      console.log('🚧 Library detection not yet implemented.');
      console.log('Planned detection for:');
      console.log('   • React, Vue, Angular');
      console.log('   • jQuery, Lodash, Moment');
      console.log('   • Webpack, Rollup bundlers');
      console.log('   • Common npm packages');

    } catch (error) {
      console.error('❌ Library detection failed:', error instanceof Error ? error.message : error);
      process.exit(1);
    }
  }

  private getFileMetrics(content: string): FileMetrics {
    const size = Buffer.byteLength(content, 'utf8');
    const lines = content.split('\n').length;
    
    // Basic function counting (rough estimate for minified code)
    const functionMatches = content.match(/function\s*\(|=>\s*{|\w+\s*:\s*function/g) || [];
    const functions = functionMatches.length;

    // Rough token estimation (average 4 characters per token)
    const estimatedTokens = Math.ceil(size / 4);

    return {
      size,
      lines,
      functions,
      estimatedTokens
    };
  }

  public run(): void {
    this.program.parse();
  }
}

// Entry point
if (require.main === module) {
  const cli = new JSReverseEngineer();
  cli.run();
}

export default JSReverseEngineer;