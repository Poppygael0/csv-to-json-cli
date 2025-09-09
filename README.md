# CSV to JSON CLI

A simple, fast command-line tool to convert CSV files to JSON format.

## Features

- ✅ Convert CSV files to JSON
- ✅ Support for custom delimiters
- ✅ Pretty-print JSON output
- ✅ Output to file or stdout
- ✅ Handle quoted values and escaped quotes
- ✅ Cross-platform compatibility
- ✅ No external dependencies

## Installation

### Global Installation
```bash
npm install -g csv-to-json-cli
```

### Local Installation
```bash
npm install csv-to-json-cli
```

### From Source
```bash
git clone https://github.com/yourusername/csv-to-json-cli.git
cd csv-to-json-cli
npm link
```

## Usage

```bash
csv2json [options] <input-file>
```

### Options

| Option | Short | Description |
|--------|--------|-------------|
| `--out <file>` | `-o` | Output JSON file path (defaults to stdout) |
| `--delimiter <char>` | `-d` | CSV delimiter (default: `,`) |
| `--pretty` | `-p` | Pretty-print JSON output |
| `--help` | `-h` | Show help message |

### Examples

#### Basic conversion
```bash
csv2json data.csv
```

#### Pretty-print to file
```bash
csv2json -p -o output.json data.csv
```

#### Custom delimiter
```bash
csv2json -d ";" data.csv
```

#### Tab-separated values
```bash
csv2json -d $'\t' data.tsv
```

## Sample Files

The `examples/` directory contains sample CSV files for testing:

### employees.csv
```csv
name,age,department,salary
John Doe,30,Engineering,75000
Jane Smith,28,Marketing,65000
Bob Johnson,35,Sales,70000
```

### products.csv (with quoted values)
```csv
product_id,name,description,price
1,"Laptop Computer","High-performance laptop with 16GB RAM",1299.99
2,"Wireless Mouse","Ergonomic wireless mouse with ""long battery life""",49.99
```

## API

You can also use this tool programmatically:

```javascript
const { parseCSV } = require('csv-to-json-cli/src/index.js');

const csvContent = 'name,age\nJohn,30\nJane,25';
const jsonData = parseCSV(csvContent);
console.log(jsonData);
// Output: [{"name":"John","age":"30"},{"name":"Jane","age":"25"}]
```

## CSV Format Support

- RFC 4180 compliant
- Quoted values with commas and newlines
- Escaped quotes (`""` becomes `"`)
- Custom delimiters
- UTF-8 with optional BOM
- Windows (`\r\n`), Unix (`\n`), and Mac (`\r`) line endings

## Requirements

- Node.js 12.0.0 or higher

## License

MIT License - see the [LICENSE](LICENSE) file for details.

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Issues

Please report any issues or feature requests on the [GitHub Issues](https://github.com/yourusername/csv-to-json-cli/issues) page.
