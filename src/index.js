#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

function parseCSV(content, delimiter = ',') {
  const lines = content.replace(/\r\n/g, '\n').replace(/\r/g, '\n').split('\n');
  if (lines.length === 0) return [];

  // Handle optional BOM
  if (lines[0].charCodeAt(0) === 0xFEFF) {
    lines[0] = lines[0].slice(1);
  }

  const headers = splitCSVLine(lines[0], delimiter);
  const rows = [];

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i];
    if (line.trim() === '') continue;
    const values = splitCSVLine(line, delimiter);
    const obj = {};
    for (let j = 0; j < headers.length; j++) {
      obj[headers[j]] = values[j] !== undefined ? values[j] : null;
    }
    rows.push(obj);
  }
  return rows;
}

function splitCSVLine(line, delimiter) {
  const result = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    const next = line[i + 1];

    if (char === '"') {
      if (inQuotes && next === '"') {
        current += '"';
        i++; // skip escaped quote
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === delimiter && !inQuotes) {
      result.push(current);
      current = '';
    } else {
      current += char;
    }
  }
  result.push(current);
  return result;
}

function showHelp() {
  const help = `
Usage: csv2json [options] <input-file>

Options:
  -o, --out <output-file>   Output JSON file path (defaults to stdout)
  -d, --delimiter <char>    CSV delimiter (default: ,)
  -p, --pretty              Pretty-print JSON output
  -h, --help                Show this help message
`;
  process.stdout.write(help);
}

function main() {
  const args = process.argv.slice(2);
  if (args.length === 0 || args.includes('-h') || args.includes('--help')) {
    showHelp();
    process.exit(args.length === 0 ? 1 : 0);
  }

  let input = null;
  let output = null;
  let delimiter = ',';
  let pretty = false;

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    if (arg === '-o' || arg === '--out') {
      output = args[++i];
    } else if (arg === '-d' || arg === '--delimiter') {
      delimiter = args[++i];
    } else if (arg === '-p' || arg === '--pretty') {
      pretty = true;
    } else if (arg.startsWith('-')) {
      process.stderr.write(`Unknown option: ${arg}\n`);
      process.exit(1);
    } else {
      input = arg;
    }
  }

  if (!input) {
    process.stderr.write('Error: input file is required.\n');
    showHelp();
    process.exit(1);
  }

  const inputPath = path.resolve(process.cwd(), input);
  if (!fs.existsSync(inputPath)) {
    process.stderr.write(`Error: file not found: ${input}\n`);
    process.exit(1);
  }

  const content = fs.readFileSync(inputPath, 'utf8');
  const data = parseCSV(content, delimiter);
  const json = pretty ? JSON.stringify(data, null, 2) : JSON.stringify(data);

  if (output) {
    const outputPath = path.resolve(process.cwd(), output);
    fs.writeFileSync(outputPath, json + '\n', 'utf8');
  } else {
    process.stdout.write(json + '\n');
  }
}

if (require.main === module) {
  try {
    main();
  } catch (err) {
    process.stderr.write('Error: ' + err.message + '\n');
    process.exit(1);
  }
}

module.exports = { parseCSV, splitCSVLine };

