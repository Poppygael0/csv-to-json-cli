#!/usr/bin/env node

const assert = require('assert');
const path = require('path');
const fs = require('fs');
const { spawnSync } = require('child_process');
const { parseCSV, splitCSVLine } = require('./index.js');

function run(name, fn) {
  try {
    fn();
    process.stdout.write(`✔ ${name}\n`);
  } catch (err) {
    process.stdout.write(`✖ ${name}\n`);
    throw err;
  }
}

function main() {
  const failures = [];
  const tests = [];

  tests.push([
    'parseCSV: basic two-row CSV',
    () => {
      const input = 'name,age\nJohn,30\nJane,25';
      const out = parseCSV(input);
      assert.deepStrictEqual(out, [
        { name: 'John', age: '30' },
        { name: 'Jane', age: '25' },
      ]);
    },
  ]);

  tests.push([
    'parseCSV: custom semicolon delimiter',
    () => {
      const input = 'a;b;c\n1;2;3';
      const out = parseCSV(input, ';');
      assert.deepStrictEqual(out, [ { a: '1', b: '2', c: '3' } ]);
    },
  ]);

  tests.push([
    'parseCSV: Windows and old-Mac line endings',
    () => {
      const inputCRLF = 'a,b\r\n1,2\r\n';
      const inputCR = 'a,b\r1,2\r';
      assert.deepStrictEqual(parseCSV(inputCRLF), [ { a: '1', b: '2' } ]);
      assert.deepStrictEqual(parseCSV(inputCR), [ { a: '1', b: '2' } ]);
    },
  ]);

  tests.push([
    'parseCSV: BOM handling',
    () => {
      const input = '\uFEFFa,b\n1,2';
      assert.deepStrictEqual(parseCSV(input), [ { a: '1', b: '2' } ]);
    },
  ]);

  tests.push([
    'splitCSVLine: quoted fields with commas and escaped quotes',
    () => {
      const line = '"Hello, world","He said ""hi""",42';
      const parts = splitCSVLine(line, ',');
      assert.deepStrictEqual(parts, ['Hello, world', 'He said "hi"', '42']);
    },
  ]);

  tests.push([
    'parseCSV: missing fields become null',
    () => {
      const input = 'a,b,c\n1,2';
      const out = parseCSV(input);
      assert.deepStrictEqual(out, [ { a: '1', b: '2', c: null } ]);
    },
  ]);

  tests.push([
    'CLI: converts examples/employees.csv to JSON',
    () => {
      const cliPath = path.resolve(__dirname, 'index.js');
      const csvPath = path.resolve(__dirname, '..', 'examples', 'employees.csv');
      const res = spawnSync(process.execPath, [cliPath, csvPath], { encoding: 'utf8' });
      assert.strictEqual(res.status, 0, `CLI exited with code ${res.status}. stderr: ${res.stderr}`);
      const json = JSON.parse(res.stdout);
      assert.ok(Array.isArray(json), 'CLI output should be an array');
      assert.ok(json.length >= 1, 'CLI output should contain rows');
      assert.ok('name' in json[0], 'Output objects should include header keys');
    },
  ]);

  const started = Date.now();
  let passed = 0;
  for (const [name, fn] of tests) {
    try {
      run(name, fn);
      passed++;
    } catch (e) {
      failures.push({ name, error: e });
    }
  }

  const duration = Date.now() - started;
  if (failures.length) {
    process.stdout.write(`\n${passed}/${tests.length} tests passed (${duration}ms).\n`);
    process.stdout.write(`${failures.length} failed:\n`);
    for (const f of failures) {
      process.stdout.write(`- ${f.name}: ${f.error && f.error.stack ? f.error.stack : f.error}\n`);
    }
    process.exit(1);
  } else {
    process.stdout.write(`\nAll ${passed}/${tests.length} tests passed (${duration}ms).\n`);
  }
}

if (require.main === module) {
  main();
}

