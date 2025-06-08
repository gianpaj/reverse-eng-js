// Core interfaces for the JavaScript reverse engineering tool

export interface AnalysisOptions {
  file: string;
  output?: string;
  provider?: LLMProvider;
  focus?: AnalysisFocus;
  format?: OutputFormat;
  verbose?: boolean;
  maxTokens?: number;
  filterLibraries?: boolean;
  configFile?: string;
}

export interface FileMetrics {
  size: number;
  lines: number;
  functions: number;
  estimatedTokens: number;
  complexity?: number;
  minified?: boolean;
}

export interface SecurityPattern {
  pattern: RegExp;
  name: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  category: SecurityCategory;
}

export interface AnalysisResult {
  file: string;
  metrics: FileMetrics;
  securityFindings: SecurityFinding[];
  librariesDetected: DetectedLibrary[];
  chunks: CodeChunk[];
  summary: AnalysisSummary;
  timestamp: Date;
}

export interface SecurityFinding {
  pattern: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  location: CodeLocation;
  category: SecurityCategory;
  confidence: number;
  recommendation?: string;
}

export interface DetectedLibrary {
  name: string;
  version?: string;
  confidence: number;
  patterns: string[];
  location: CodeLocation;
  bundled?: boolean;
}

export interface CodeChunk {
  id: string;
  content: string;
  startLine: number;
  endLine: number;
  tokenCount: number;
  importance: number;
  type: ChunkType;
  dependencies: string[];
}

export interface CodeLocation {
  line: number;
  column?: number;
  startOffset: number;
  endOffset: number;
  context?: string;
}

export interface AnalysisSummary {
  totalSecurityIssues: number;
  criticalIssues: number;
  highIssues: number;
  mediumIssues: number;
  lowIssues: number;
  librariesCount: number;
  codeReduction: number; // percentage of original code analyzed
  processingTime: number; // milliseconds
  tokensUsed: number;
}

export interface LLMResponse {
  analysis: string;
  confidence: number;
  findings: SecurityFinding[];
  suggestions: string[];
  metadata: {
    model: string;
    tokensUsed: number;
    processingTime: number;
  };
}

export interface ChunkingStrategy {
  maxTokens: number;
  overlapTokens: number;
  preserveFunctions: boolean;
  preserveScopes: boolean;
  prioritizeImportant: boolean;
}

export interface LibrarySignature {
  name: string;
  patterns: RegExp[];
  version?: RegExp;
  confidence: number;
  category: LibraryCategory;
  shouldFilter: boolean;
}

export interface ProgressCallback {
  (phase: string, progress: number, message?: string): void;
}

// Enums and type unions
export type LLMProvider = 'claude' | 'openai' | 'local' | 'custom';

export type AnalysisFocus = 'security' | 'general' | 'performance' | 'privacy';

export type OutputFormat = 'markdown' | 'json' | 'html' | 'pdf' | 'console';

export type SecurityCategory =
  | 'xss'
  | 'injection'
  | 'csrf'
  | 'data-exposure'
  | 'eval-usage'
  | 'dom-manipulation'
  | 'network-security'
  | 'privacy'
  | 'crypto'
  | 'authentication'
  | 'authorization'
  | 'general';

export type ChunkType =
  | 'function'
  | 'class'
  | 'module'
  | 'global'
  | 'event-handler'
  | 'library'
  | 'utility'
  | 'security-relevant'
  | 'unknown';

export type LibraryCategory =
  | 'framework'
  | 'utility'
  | 'polyfill'
  | 'bundler'
  | 'analytics'
  | 'ui'
  | 'testing'
  | 'build-tool'
  | 'security'
  | 'unknown';

// Configuration interfaces
export interface ToolConfig {
  llm: LLMConfig;
  analysis: AnalysisConfig;
  output: OutputConfig;
  security: SecurityConfig;
  chunking: ChunkingStrategy;
}

export interface LLMConfig {
  provider: LLMProvider;
  apiKey?: string;
  baseUrl?: string;
  model?: string;
  temperature?: number;
  maxTokens?: number;
  timeout?: number;
  retries?: number;
}

export interface AnalysisConfig {
  focus: AnalysisFocus[];
  includeLibraries: boolean;
  minConfidence: number;
  maxFileSize: number; // bytes
  enableCaching: boolean;
  parallelProcessing: boolean;
}

export interface OutputConfig {
  format: OutputFormat;
  includeMetrics: boolean;
  includeCode: boolean;
  verboseLogging: boolean;
  outputDir?: string;
  templatePath?: string;
}

export interface SecurityConfig {
  enabledCategories: SecurityCategory[];
  minSeverity: 'low' | 'medium' | 'high' | 'critical';
  customPatterns: SecurityPattern[];
  falsePositiveFilters: RegExp[];
}

// Error types
export class AnalysisError extends Error {
  constructor(
    message: string,
    public code: string,
    public details?: any
  ) {
    super(message);
    this.name = 'AnalysisError';
  }
}

export class LLMError extends Error {
  constructor(
    message: string,
    public provider: LLMProvider,
    public statusCode?: number,
    public details?: any
  ) {
    super(message);
    this.name = 'LLMError';
  }
}

export class ChunkingError extends Error {
  constructor(
    message: string,
    public chunkId?: string,
    public details?: any
  ) {
    super(message);
    this.name = 'ChunkingError';
  }
}

// Utility types
export type Awaitable<T> = T | Promise<T>;

export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

export interface EventEmitter {
  on(event: string, listener: (...args: any[]) => void): this;
  emit(event: string, ...args: any[]): boolean;
  removeListener(event: string, listener: (...args: any[]) => void): this;
}

// Plugin system types
export interface Plugin {
  name: string;
  version: string;
  description: string;
  initialize(config: ToolConfig): Promise<void>;
  analyze?(chunk: CodeChunk): Promise<Partial<AnalysisResult>>;
  postProcess?(result: AnalysisResult): Promise<AnalysisResult>;
}

export interface PluginManager {
  loadPlugin(plugin: Plugin): void;
  unloadPlugin(name: string): void;
  getPlugins(): Plugin[];
  executeHook(hookName: string, ...args: any[]): Promise<any[]>;
}
