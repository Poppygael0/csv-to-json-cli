# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Project Overview

This is a Node.js CLI tool that converts CSV files to JSON format. The tool is designed to be lightweight with zero external dependencies and follows RFC 4180 CSV parsing standards.

## Architecture

### Core Components

- **`src/index.js`**: Main module containing the entire application logic
  - `parseCSV()`: Core CSV parsing function that handles RFC 4180 compliance
  - `splitCSVLine()`: Low-level CSV line parsing with quote handling
  - `main()`: CLI argument parsing and orchestration
  - `showHelp()`: Help text display

- **`bin/csv2json`**: Executable wrapper that requires the main index.js file

### Key Design Principles

- **Zero dependencies**: The tool uses only Node.js built-in modules (`fs`, `path`)
- **RFC 4180 compliance**: Handles quoted values, escaped quotes (`""` becomes `"`), and various line endings
- **Cross-platform**: Supports Windows (`\r\n`), Unix (`\n`), and Mac (`\r`) line endings
- **BOM handling**: Automatically strips UTF-8 BOM if present
- **Flexible delimiters**: Supports custom delimiter characters beyond commas

## Development Commands

### Setup
```bash
npm link                    # Link for local development (global install)
```

### Testing
```bash
npm test                    # Run tests (note: test file doesn't exist yet)
node src/index.js --help    # Test help functionality
```

### Testing with Examples
```bash
# Test basic conversion
node src/index.js examples/employees.csv

# Test pretty-print output
node src/index.js -p examples/products.csv

# Test custom delimiter (if you have TSV files)
node src/index.js -d $'\t' your-file.tsv

# Test output to file
node src/index.js -o output.json -p examples/employees.csv
```

### Programmatic Usage Testing
```bash
node -e "const {parseCSV} = require('./src/index.js'); console.log(parseCSV('name,age\\nJohn,30'));"
```

## Code Structure Notes

### CSV Parsing Logic
The `parseCSV` function implements a state machine approach:
1. Splits content by various line endings into individual lines
2. Uses `splitCSVLine()` for proper quote-aware field separation
3. First line becomes headers, subsequent lines become data objects
4. Handles edge cases like empty lines and missing fields (set to `null`)

### Quote Handling
The `splitCSVLine()` function uses an `inQuotes` boolean state to track whether the parser is inside quoted content, properly handling:
- Embedded delimiters within quotes
- Escaped quotes (`""` sequences)
- Mixed quoted and unquoted fields

### CLI Argument Parsing
Manual argument parsing without external dependencies:
- Supports both short (`-o`) and long (`--out`) option formats
- Validates required arguments and file existence
- Provides helpful error messages

## Testing Strategy

When creating tests, focus on:
- **Edge cases**: Empty files, single column, single row, malformed CSV
- **Quote handling**: Various combinations of quotes, escapes, and delimiters
- **Line endings**: Windows, Unix, and Mac style line breaks
- **BOM handling**: Files with and without UTF-8 BOM
- **CLI options**: All command-line argument combinations
- **Error conditions**: Missing files, invalid options, malformed input

Example test data scenarios:
- Basic CSV (like `examples/employees.csv`)
- Quoted fields with commas (like `examples/products.csv`)
- Fields with embedded quotes and newlines
- Custom delimiters (semicolons, tabs, pipes)
- Empty fields and trailing commas

## File Organization

```
csv-to-json-cli/
├── src/index.js          # Main application logic
├── bin/csv2json          # Executable wrapper
├── examples/             # Sample CSV files for testing
│   ├── employees.csv     # Basic CSV example
│   └── products.csv      # Complex CSV with quotes
└── package.json          # Node.js package configuration
```

## Development Notes

- The codebase is intentionally minimal and self-contained
- No build process required - direct Node.js execution
- Consider the `engines.node` requirement (>=12.0.0) when using Node.js features
- The tool exports `parseCSV` and `splitCSVLine` for programmatic use
- Error handling focuses on clear, actionable messages for CLI users

