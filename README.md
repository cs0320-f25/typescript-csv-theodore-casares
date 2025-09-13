# Sprint 1: TypeScript CSV

### Task C: Proposing Enhancement

- #### Step 1: Brainstorm on your own.
    Just by taking a quick look at the current parser and the parser docs, I think that our parser is going to run into a lot of issues with more complex cells and specified usage. I wouldn't really even consider these edge cases becauae I think that anyone seriously using this parser will run into these issues. 
    This includes things like:
        - Commas in quotes or parenthesis or similar
        - Determining what types to return
        - Deciding what to do with headers
        - Empty rows
        - Empty Columns
        - Line breaks


- #### Step 2: Use an LLM to help expand your perspective.
**My Query**
I'm working on a CSV parser in TypeScript that currently accepts a filename
  as input and converts rows into strings or objects. What are some missing
  features or edge cases that I should consider? What improvements would make
  it easier for other developers to use in different kinds of apps?
**ChatGPT 5 (reasoning,)** REALLY LONG ANSWER

        Here’s a tight checklist. Add what’s relevant and ignore the rest.

    # Edge cases you must handle

    * Delimiters: auto-detect `, ; \t |` with override. Mixed delimiters rejected with clear error.
    * Quotes/escapes: `"` as quote, `""` as escaped quote, quotes inside fields, escaped delimiters, leading/trailing spaces outside quotes.
    * Newlines: `\n`, `\r\n`, lone `\r`, and mixed line endings. Final line without newline.
    * Multiline fields: newlines inside quoted fields.
    * BOM/encodings: UTF-8 BOM stripping; optional iconv for ISO-8859-1/Shift-JIS, with decode errors surfaced.
    * Headers: missing header row, duplicate names, empty header cells, whitespace in headers, header normalization and collision handling.
    * Column count: ragged rows (short/long). Policy options: pad, truncate, or error with row/col index.
    * Empty fields vs missing fields: distinguish `""` from omitted column.
    * Comments/skip rows: support `#` or custom prefix; `skipRows` and `skipEmptyLines`.
    * Numbers/dates/nulls: `"NaN"`, `"null"`, `""`, `"0001-01-01"`; locale decimal commas; big integers; leading zeros.
    * Very long fields: configurable max field length and row size with safe errors.
    * Huge files: chunked parsing, backpressure, constant memory.
    * TSV/PSV: treat as CSV variant via `delimiter`.
    * Partial/invalid input: EOF mid-quote, stray quotes, invalid escape sequences. Offer strict vs tolerant modes.

    # Features that add real utility

    * Streaming API: `AsyncIterable<Row>` and Node/Web stream adapters. Works with files, `Blob`, `ReadableStream`, `ArrayBuffer`, URLs.
    * Type-safe rows: generic `<T>` with schema mapping. Optional adapters for Zod/Yup to coerce and validate.
    * Flexible output: arrays, objects (via headers or provided keys), or row callback. Pluggable transformers per cell/row.
    * Dialects: preset configs (RFC4180, Excel, TSV). Dialect sniffing on first N KB.
    * Error reporting: row/col, byte offset, snippet, dialect used, and recovery status. Collect non-fatal issues.
    * Performance toggles: chunk size, string reuse, pooling, projection of selected columns, SIMD/WASM guardrails if added later.
    * Progress and limits: bytes processed, rows parsed, `rowLimit`, `byteLimit`, early stop when predicate true.
    * Date/number coercion: opt-in converters with locale controls and safe BigInt path.
    * Header services: rename, dedupe, map, select, reorder, require set.
    * Quote/escape customization: `quote: '"' | null`, `escape: '"' | '\\'`, `relaxQuotes`.
    * Virtual columns: computed fields during parse.
    * Row grouping: windowed batches for downstream writes.

    # API design that makes it easy to use

    * Core pure parser + thin I/O wrappers. No hidden fs/network in core.
    * Single entry with overloads:

    ```ts
    parse(input: string|Uint8Array|Readable|ReadableStream, opts): AsyncIterable<Row>
    parseAll(input, opts): Promise<Row[]>
    ```
    * First-class types:

    ```ts
    type Cell = string;
    type Row = string[] | Record<string, string>;
    interface Options {
        delimiter?: string; quote?: string|null; escape?: string;
        headers?: boolean | string[] | ((firstRow: string[]) => string[]);
        encoding?: string; comment?: string; skipEmptyLines?: boolean;
        relaxColumnCount?: 'error'|'pad'|'truncate';
        output?: 'objects'|'arrays';
        transformCell?: (cell, ctx) => any;
        transformRow?: (row, ctx) => any;
        schema?: ZodSchema<any>; // optional
        onError?: (err, ctx) => 'throw'|'skipRow'|'skipCell';
    }
    ```
    * Browser + Node support. ESM first. Deno/Bun typings. Zero Node-only deps in core.
    * Backpressure aware: Node `Readable` and WHATWG `ReadableStream` adapters with proper `await`.
    * Cancellation: `AbortSignal` support.
    * Deterministic defaults: RFC4180, UTF-8, headers inferred if row1 looks like headers.

    # Developer-experience improvements

    * Clear docs with “90-second start,” streaming example, large-file example, browser `File` example, schema example.
    * Tiny, tree-shakable core. Optional add-ons for encodings and schema.
    * Helpful errors: include row/col, surrounding text, and how to fix.
    * Dialect examples: “Excel export gotchas,” “Postgres COPY,” “TSV logs.”
    * Type tests: generics infer correct object shape from provided headers/schema.
    * CLI shim: `csv-parse file.csv --json --delimiter ';'` for quick checks.
    * Stable semver and RFC notes. Changelog with migration steps.

    # Performance and reliability

    * Chunked state machine parser. Tests for boundary cases that split tokens across chunks.
    * Fuzz/property tests (e.g., fast-check). Differential tests vs a reference parser on random inputs.
    * Benchmarks with real datasets. Avoid per-char regex where possible.
    * Memory guards and timeouts for untrusted input.

    # Security considerations

    * Don’t eval anything. Treat formulas as strings. Option to sanitize leading `= + - @` if you ever add CSV writer.
    * Enforce max field/row sizes to prevent DoS.
    * If you keep “accept a filename,” validate path or prefer stream input to avoid path traversal in server apps.

    # Small but high-leverage wins

    * `peek()` utility to inspect first N rows for schema/dialect before full parse.
    * Column projection: `columns: ['id','price']` for faster pipelines.
    * Nullable policy: map `''` to `null` per column.
    * Duplicate header policy: `dedupe: 'suffix'|'error'|'index'`.
    * Metrics hook: rows/sec, bytes/sec for progress bars.

    If you want, I can sketch the minimal state machine and an `AsyncIterable` wrapper that respects backpressure and `AbortSignal`.

**My Query**
 I'm building a TypeScript CSV parser. what error casesand edge cases should a CSV parser be able to handle? 

**ChatGpt 5 (no reasoning)**
    Here’s the production checklist. Treat each as a test case.

    # 1) Input & encoding

    * UTF-8 with/without BOM; strip BOM correctly.
    * Invalid UTF-8 sequences, overlong encodings, lone surrogates → fail or replace.
    * Mixed encodings (file says ISO-8859-1 but bytes are UTF-8) → explicit `encoding` option and decode errors surfaced.
    * Zero bytes `\x00`, non-printing control chars, Unicode bidi marks, zero-width spaces.
    * Unicode normalization (NFC/NFD) differences in headers and values.

    # 2) Line endings & file shapes

    * `\n`, `\r\n`, lone `\r`, and mixed endings in one file.
    * Final line missing newline.
    * Empty file; file of only whitespace; file of only headers.

    # 3) Delimiters & dialect

    * Auto-detect `, ; \t |` on sample; allow override.
    * Delimiter appears inside quoted fields.
    * Inconsistent delimiter across rows → strict error vs tolerant mode.
    * Comment prefix lines (e.g., `#`); skip empty lines.

    # 4) Quotes & escapes

    * RFC4180: quote = `"`; escaped quote `""`.
    * Unescaped quote in unquoted field.
    * EOF inside an open quoted field.
    * Escapes other than quotes (e.g., backslash mode) when enabled.
    * Quote character set to `null` (no quotes) and fields containing delimiter/newline.

    # 5) Multiline fields

    * Newlines inside quoted fields.
    * Very long multiline cells; enforce max cell length and max row length.

    # 6) Row shape & columns

    * Ragged rows: fewer or more columns than header count.

    * Policies: `error | pad | truncate`.
    * Distinguish empty cell `""` vs missing column.
    * Duplicate rows detection (optional).
    * Row projection (selected columns only) and effect on shape validation.

    # 7) Headers

    * No header row; user-supplied keys.
    * Duplicate header names; empty header names.

    * Policies: `error | suffix _1 _2 | use index`.
    * Header whitespace and case normalization.
    * Unicode look-alikes (“O” vs “Ο” Greek Omicron).

    # 8) Whitespace rules

    * Leading/trailing spaces around unquoted fields.
    * Spaces before/after delimiter and before closing quote.
    * NBSP vs space; tabs.

    # 9) Numbers, dates, nulls

    * Safe integer range: values > 2^53-1 → BigInt or string.
    * Leading zeros (`00123`), ID-like fields that must stay strings.
    * Locale decimal commas (`"1,23"` vs `"1,234"` thousands).
    * `NaN`, `Infinity`, `-0`, empty string → typed null handling.
    * ISO dates vs ambiguous `MM/DD/YYYY`/`DD/MM/YYYY`; time zones; leap days.
    * Epoch milliseconds that overflow JS `Date`.

    # 10) Validation (schema & business rules)

    * Required columns present.
    * Column type coercion with per-column policy: `string | number | bigint | boolean | date | custom`.
    * Range checks, regex checks, enumerations.
    * Cross-field rules (e.g., `start <= end`, `qty * price === total` within tolerance).
    * Row-level custom validator returning errors with locations.
    * Uniqueness constraints (primary key), composite keys.
    * Referential checks against a provided set (e.g., known SKUs).
    * Nullable policy per column (`''` → `null` vs `''`).

    # 11) Streaming & I/O robustness

    * Chunk boundaries splitting tokens (quote, delimiter, CRLF).
    * Backpressure aware streams (Node and browser).
    * AbortSignal cancellation mid-file.
    * Partial reads, truncated files, network timeouts.
    * Retry strategy for remote sources (optional wrapper, not core).

    # 12) Security

    * CSV injection: cells starting with `= + - @` for spreadsheet consumers → optional sanitization or prefixing.
    * Denial-of-service guards: max bytes, max rows, max cell length, max errors.
    * No eval in transformers; sandbox user transforms if you expose them.
    * Path handling if you accept filenames in server code (no traversal).

    # 13) Error reporting model

    * Typed errors with codes: `ENCODING_ERROR`, `INVALID_QUOTE`, `RAGGED_ROW`, `OVERLONG_CELL`, `SCHEMA_VIOLATION`, `CSV_INJECTION`, etc.
    * Include row index, column index, byte offset, snippet (±N chars), and dialect used.
    * Severity: `fatal` vs `recoverable`.
    * Recovery policy: `throw | skipRow | skipCell | replaceWithNull`.
    * Error aggregation with cap; emit summary.

    # 14) Configuration surface (make behavior explicit)

    * `delimiter`, `quote`, `escape`, `comment`, `skipEmptyLines`.
    * `headers: boolean | string[] | (firstRow)=>string[]`.
    * `relaxColumnCount: 'error'|'pad'|'truncate'`.
    * `trim`, `ltrim`, `rtrim`, `whitespace: 'preserve'|'collapse'`.
    * `encoding`, `normalize: 'NFC'|'NFD'|false`.
    * `limit: { rows?, bytes?, cellBytes? }`.
    * `types: Record<col, coercer>` and `nullish: Record<col, (v)=>boolean>`.
    * `schema` adapter (Zod/Yup) with per-error mapping.
    * `onError(err, ctx)`, `onRow(row, ctx)` hooks.
    * `output: 'arrays'|'objects'`.
    * `dialect: 'rfc4180'|'excel'|'tsv'|custom`.

    # 15) Testing you should add

    * Property/fuzz tests generating random quoted/unquoted data.
    * Differential tests against a known parser on corpora.
    * Boundary tests at chunk size ±1 and CRLF split across chunks.
    * Large file test (GB-scale) for memory ceiling.
    * Encoding corpus with BOMs, invalid sequences, and mixed normalization.

    # 16) Docs for other developers

    * Clear strict vs tolerant mode table.
    * Matrix of defaults per dialect.
    * Recipes: huge files (streaming), browser `File`, schema validation, Excel-safe exports.

    If useful, I can provide a minimal state machine and an error type union with codes and context fields.

**My Query**
I need to design a developer-friendly API for a TypeScript CSV parserlibrary. What interface options and configuration settings would make itmost flexible for different use cases like web apps, data pipelines, and CLI tools? Don't write any code, just help me think the problem through. 
(last part added because chatgpt just wanted to implement an entire csv parser in the browser)
**ChatGPT 5(reasoning, thought for 28 seconds)**
    Design for three fronts: core, adapters, and UX. Keep the core pure and minimal. Push I/O and extras into adapters and plugins.

    # Core API surface

    * Functions

    * Parse-all: returns an array. Good for small inputs.
    * Streaming parse: returns an async iterable of rows. Good for pipelines and web workers.
    * Peek/sniff: inspects first N KB to detect dialect and headers before full parse.
    * Inputs

    * String, Uint8Array, AsyncIterable<Uint8Array>, web ReadableStream, Node Readable, File/Blob, URL fetch wrapper.
    * Outputs

    * Rows as arrays or objects. Selectable per call.
    * Optional metadata stream: row index, byte offset, dialect, header map.
    * Final summary: row count, error counts, timings, bytes, sample errors.
    * Cancellation and flow

    * AbortSignal. Backpressure aware for Node and web streams.

    # Configuration “surfaces” (grouped, stable names)

    * Dialect

    * delimiter, quote, escape, recordSeparator, comment, skipEmptyLines, allowMixedLineEndings.
    * presets: rfc4180, excel, tsv. Auto-detect with override.
    * Headers

    * hasHeaders, providedHeaders, headerNormalizer, duplicateHeaderPolicy, requiredHeaders, headerSelect/reorder.
    * Row shape

    * columnCountPolicy: error, pad, truncate.
    * missingCellValue, extraCellPolicy, preserveEmpty vs null mapping.
    * Whitespace

    * trim, ltrim, rtrim, whitespaceMode: preserve or collapse, treatNBSPAsSpace.
    * Types and coercion

    * per-column coercers: string, number, bigint, boolean, date, custom.
    * locale options for number parsing. keepLeadingZeros list. thousand and decimal separators.
    * nullish detectors per column.
    * Validation

    * schema integration hook (Zod/Yup) optional. required columns. enum checks. cross-field rules. uniqueness keys.
    * violation policy: throw, skipRow, replaceWithNull.
    * Transform hooks

    * transformCell(cell, ctx). transformRow(row, ctx). computed columns. projection list for speed.
    * Errors

    * typed error codes. severity levels. maxErrors cap. onError callback with suggested fix and context.
    * Limits and safety

    * maxBytes, maxRows, maxCellBytes, maxRowBytes, timeoutMs.
    * csv-injection guard for consumers that export to spreadsheets.
    * Encoding

    * encoding name, BOM handling, invalid-sequence policy: error or replace. optional plugin for legacy encodings.
    * Performance knobs

    * chunkSize, stringReuse, objectReuse, bufferPooling, decoder buffering. selectedColumns for projection.
    * Observability

    * onProgress(bytes, rows, elapsed). onStats periodic. debug flag for token transitions.
    * Determinism

    * strict mode toggles: strictQuotes, strictEscapes, strictDelimiter.

    # Adapters (separate packages or sub-exports)

    * Node adapter

    * fs.createReadStream integration. pipeline helpers. backpressure by default.
    * Web adapter

    * File/Blob, ReadableStream, Service Worker and Web Worker helpers, off-main-thread parser.
    * Fetch adapter

    * HTTP range requests, retries, timeouts, content-type driven defaults.
    * Deno and Bun shims

    * Native streams. Zero Node polyfills in core.

    # Result shapes for different users

    * Data pipelines

    * Async iterable of typed objects. Batch mode that yields arrays of N rows. Early-stop predicate.
    * Web apps

    * Worker-friendly API with transferable buffers. Progress events. Memory ceilings.
    * CLI

    * Options map 1:1 with library config. Input: file, glob, stdin, URL. Output: json, ndjson, csv (rewrite), stats. Exit codes for success, partial, fatal. Quiet and preview modes.

    # Plugin system

    * Transform plugins: common mappings, date parsing by locale, currency parsing.
    * Validation plugins: schema packs, referential integrity against provided sets.
    * Encoding plugins: iconv-lite bridge.
    * WASM/SIMD plugin: opt-in fast path with identical semantics.

    # Error model (make it predictable)

    * Codes: ENCODING\_ERROR, INVALID\_QUOTE, OPEN\_QUOTE\_EOF, RAGGED\_ROW, OVERLONG\_CELL, SCHEMA\_VIOLATION, CSV\_INJECTION, LIMIT\_EXCEEDED.
    * Each error includes row index, column index, byte offset, snippet, dialect snapshot, recoverable flag.
    * Aggregation with a limit and a final report object.

    # Versioning and stability

    * Semantic versioning with a “defaults matrix” documented per version.
    * Dialect autodetect is best effort and never breaking; only defaults change on major versions.
    * Strict mode guarantees RFC behavior. Tolerant mode trades correctness for throughput by documented rules.

    # DX and typing

    * Strong generics: object row shape inferred from headers or schema. Narrow types per column when schema provided.
    * Option presets: “safe defaults,” “tolerant import,” “excel-friendly,” “logs-tsv.”
    * No Node-only dependencies in core. ESM-first, CJS proxy only if needed.
    * Clear docs: quick start, streaming, browser File, worker offload, schema, huge files, error recipes.
    * Deterministic tests for chunk boundaries and CRLF splits. Property tests recommended.

    # Security defaults

    * Reasonable limits on by default. Injection guard off by default but documented. No eval in transforms. Path acceptance only in adapters, not core.

    # Small convenience utilities

    * Dialect sniff result object with confidence scores.
    * Header planner utility to dedupe and normalize with a report.
    * Stats snapshot function for progress bars.
    * Preview function that returns first K valid rows and first K errors.

    Adopt this split: a tiny deterministic parser core, thin environment adapters, and optional plugins. Mirror every config knob in the CLI and document strict vs tolerant behavior with tables.



- #### Step 3: Top 4 Enhancements with User Stories

    **1. Functionality - Proper Quote Handling (Source: Me + LLM)**
    
    User Story: "As a developer using the CSV parser, I want the parser to correctly handle commas and newlines within quoted fields so that I can parse CSV files with complex text data without data corruption."
    
    Acceptance Criteria:
    - Fields wrapped in quotes can contain commas without breaking into new columns
    - Quoted fields can contain newlines without breaking into new rows
    - Double quotes ("") within quoted fields are escaped properly
    
    **2. Functionality - Empty Field Handling (Source: Me)**
    
    User Story: "As a developer parsing CSV data, I want the parser to distinguish between empty strings and missing fields so that I can handle null values appropriately in my application."
    
    Acceptance Criteria:
    - Empty unquoted fields are parsed as empty strings
    - Quoted empty fields ("") are parsed as empty strings
    - Parser maintains consistent column count even with empty fields
    
    **3. Extensibility - Type Coercion via Schema (Source: Me + Class Discussion)**
    
    User Story: "As a developer, I want to provide custom schemas that automatically convert CSV strings to appropriate data types (numbers, dates, booleans) so that I don't have to manually transform every field after parsing."
    
    Acceptance Criteria:
    - Schema can specify number, boolean, date, and custom types per column
    - Invalid values that don't match schema throw clear validation errors
    - Parser remains type-safe with TypeScript inference from schema
    
    **4. Extensibility - Header Row Configuration (Source: LLM)**
    
    User Story: "As a developer, I want to specify whether my CSV has headers and optionally provide custom headers so that I can parse both headerless data files and files with non-standard headers."
    
    Acceptance Criteria:
    - Can specify hasHeaders: true/false
    - Can provide custom headers array when file has no headers
    - Can access data as objects using header names as keys

    **Reflection on LLM Consultation:**
    
    My initial ideas focused on obvious parsing issues like quotes and commas that I found in the CSV spec. The LLM expanded my perspective significantly by suggesting streaming APIs, dialect detection, security concerns (CSV injection), and performance optimizations that I hadn't considered. The different prompts yielded increasingly detailed responses - the first was high-level features, the second focused on error cases, and the third on API design. What resonated most was the LLM's emphasis on developer experience through clear error messages and flexible configuration, while I was initially too focused on just meeting the CSV spec. The security and performance suggestions felt premature for this basic parser. 

### Design Choices

### 1340 Supplement

- #### 1. Correctness

- #### 2. Random, On-Demand Generation

- #### 3. Overall experience, Bugs encountered and resolved
#### Errors/Bugs:
#### Tests:
#### How To…

#### Team members and contributions (include cs logins):

#### Collaborators (cslogins of anyone you worked with on this project and/or generative AI):
Used generative AI for the parts that asked for it. No other collaborators on this project.
#### Total estimated time it took to complete project:

#### Link to GitHub Repo:  
https://github.com/cs0320-f25/typescript-csv-theodore-casares.git
