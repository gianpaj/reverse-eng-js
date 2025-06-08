# JavaScript Reverse Engineer

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/Node.js-16+-green.svg)](https://nodejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.2+-blue.svg)](https://www.typescriptlang.org/)

A powerful Node.js command-line tool that leverages Large Language Models (LLMs) like Claude and OpenAI to reverse engineer and analyze large, minimized JavaScript files for security assessment and code understanding.

## 🎯 Purpose

This tool is designed to tackle the challenge of analyzing massive minimized JavaScript files (20M+ characters) that are common in modern web applications. It intelligently breaks down these files, filters out mundane library code, and uses AI to focus on security-relevant patterns and core functionality.

## ✨ Features

- **🔍 Smart Analysis**: Automatically detects security vulnerabilities and suspicious patterns
- **🧠 LLM Integration**: Works with Claude, OpenAI, and local models
- **📊 Intelligent Chunking**: Breaks large files into manageable pieces while preserving context
- **🚫 Library Filtering**: Removes common libraries and bundler artifacts to focus on custom code
- **🎨 Multiple Output Formats**: Supports Markdown, JSON, HTML, and console output
- **⚡ Performance Optimized**: Handles files up to 20MB+ efficiently
- **🔒 Security Focused**: Prioritizes security-relevant code patterns

## 🚀 Quick Start

### Installation

```bash
# Install globally via npm (not yet available on npm registry)
pnpm install -g js-reverse-engineer

# Or install locally
pnpm install js-reverse-engineer
```

### Basic Usage

```bash
# Analyze a JavaScript file for security issues
js-rev analyze --file app.min.js --provider claude --focus security

# Get basic metrics about a file
js-rev metrics --file bundle.js

# Detect known libraries
js-rev libraries --file vendor.min.js
```

## 📋 Commands

### `analyze` - Main Analysis Command

Performs comprehensive analysis of JavaScript files with AI assistance.

```bash
js-rev analyze [options]

Options:
  -f, --file <path>          Path to the JavaScript file to analyze
  -o, --output <path>        Output file path (default: stdout)
  -p, --provider <provider>  LLM provider: claude, openai, local (default: claude)
  --focus <type>             Focus area: security, general, performance (default: security)
  --format <format>          Output format: markdown, json, html (default: markdown)
  -v, --verbose              Enable detailed logging
  --max-tokens <number>      Max tokens per LLM request (default: 180000)
  --no-filter-libraries      Disable automatic library filtering
```

**Examples:**

```bash
# Security-focused analysis with Claude
js-rev analyze -f app.min.js --provider claude --focus security

# General analysis with JSON output
js-rev analyze -f bundle.js --format json --output analysis.json

# Verbose analysis with custom token limit
js-rev analyze -f large-app.js --verbose --max-tokens 150000
```

### `metrics` - File Analysis

Get detailed metrics about JavaScript files without AI analysis.

```bash
js-rev metrics --file <path>

# Example output:
📊 JavaScript File Metrics:
────────────────────────────────────────
File size: 2.34 MB
Lines: 1,234
Estimated functions: 45
Estimated tokens: 156,789
Chunks needed (200k tokens): 1
```

### `libraries` - Library Detection

Detect and list known JavaScript libraries and frameworks.

```bash
js-rev libraries --file <path>

# Detects: React, Vue, Angular, jQuery, Lodash, Webpack bundles, etc.
```

## 🔧 Configuration

### Environment Variables

```bash
# API Keys
export ANTHROPIC_API_KEY="your-claude-api-key"
export OPENAI_API_KEY="your-openai-api-key"

# Optional: Custom API endpoints
export ANTHROPIC_BASE_URL="https://api.anthropic.com"
export OPENAI_BASE_URL="https://api.openai.com/v1"
```

### Configuration File

Create a `.js-rev.yaml` file in your project root:

```yaml
llm:
  provider: claude
  model: claude-3-sonnet-20240229
  maxTokens: 180000
  temperature: 0.1

analysis:
  focus: [security, privacy]
  includeLibraries: false
  minConfidence: 0.7

output:
  format: markdown
  includeMetrics: true
  verboseLogging: false
```

## 🔒 Security Patterns Detected

The tool automatically identifies various security vulnerabilities:

- **XSS Vulnerabilities**: `innerHTML`, `outerHTML`, `document.write`
- **Code Injection**: `eval()`, `Function()`, dynamic script execution
- **Data Exposure**: Unsafe data handling, credential leaks
- **Network Security**: Suspicious fetch requests, WebSocket usage
- **Privacy Issues**: User tracking, data collection patterns
- **DOM Manipulation**: Unsafe element creation and modification

## 📊 Example Output

```markdown
# Security Analysis Report

## Summary
- **File**: app.min.js (2.3 MB)
- **Security Issues Found**: 7 (2 Critical, 3 High, 2 Medium)
- **Libraries Filtered**: React 18.2.0, Lodash 4.17.21
- **Analysis Time**: 45 seconds

## Critical Issues

### 1. Code Injection via eval()
**Location**: Line 1247
**Confidence**: 95%
**Description**: User input passed directly to eval() function
**Recommendation**: Use JSON.parse() or implement input validation

### 2. XSS via innerHTML
**Location**: Line 892
**Confidence**: 88%
**Description**: Untrusted data inserted into DOM without sanitization
**Recommendation**: Use textContent or implement HTML sanitization
```

## 🛠 Development

### Prerequisites

- Node.js 16+
- TypeScript 5.2+
- pnpm (recommended) or npm

### Setup

```bash
# Clone the repository
git clone https://github.com/gianpaj/js-reverse-engineer.git
cd js-reverse-engineer

# Install dependencies
pnpm install

# Build the project
pnpm build

# Run tests
pnpm test

# Run linting
pnpm lint
```

### Project Structure

```
reverse-eng-js/
├── src/
│   ├── index.ts           # CLI entry point
│   ├── types/             # TypeScript definitions
│   └── utils/             # Utility functions
├── tests/                 # Jest test files
├── dist/                  # Compiled output
└── docs/                  # Documentation
```

### Running Tests

```bash
# Run all tests
pnpm test

# Run tests in watch mode
pnpm test:watch

# Run with coverage
pnpm test -- --coverage
```

## 🤝 Contributing

Contributions are welcome! Please see [ROADMAP.md](./ROADMAP.md) for development progress and planned features.

### Key Areas for Contribution

- **Library Signatures**: Help build the database of known library patterns
- **Security Patterns**: Add new vulnerability detection patterns
- **LLM Providers**: Add support for additional AI providers
- **Performance**: Optimize chunking and analysis algorithms
- **Documentation**: Improve examples and use cases

## 📈 Roadmap

See [ROADMAP.md](./ROADMAP.md) for detailed development plans and current progress.

**Current Status**: Phase 1.1 Complete ✅ (15% complete)

**Next Milestones**:
- Phase 1.2: JavaScript AST parsing with Babel
- Phase 2.1: Advanced library detection
- Phase 3.1: Full LLM integration

## ⚠️ Limitations

- **Beta Software**: Currently in active development
- **API Costs**: LLM analysis requires API access (paid)
- **Processing Time**: Large files may take several minutes to analyze
- **Token Limits**: Very large files are chunked, which may affect context

## 📄 License

MIT License - see [LICENSE](./LICENSE) file for details.

## 🆘 Support

- **Issues**: [GitHub Issues](https://github.com/gianpaj/js-reverse-engineer/issues)
- **Documentation**: [Wiki](https://github.com/gianpaj/js-reverse-engineer/wiki)
- **Discussions**: [GitHub Discussions](https://github.com/gianpaj/js-reverse-engineer/discussions)

## 🙏 Acknowledgments

- [Babel](https://babeljs.io/) for JavaScript parsing
- [Commander.js](https://github.com/tj/commander.js) for CLI framework
- [Anthropic](https://www.anthropic.com/) and [OpenAI](https://openai.com/) for LLM APIs
- The open-source security community for vulnerability patterns

---

**⚠️ Disclaimer**: This tool is for security research and code analysis purposes. Always ensure you have permission to analyze the JavaScript files you're examining.
