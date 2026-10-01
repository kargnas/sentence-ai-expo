# Offline analysis regression tests

Run `npm test` with Node.js 22.6 or newer (verified with Node.js 24). The suite uses
Node's built-in TypeScript stripping and test runner, with no test dependencies.
It does not contact the production API or an AI provider.

The tests exercise the same guard invoked by the analysis screen, including
empty/whitespace rejection before its request/loading/persistence callback,
trimmed valid input, retries, and safe localized error selection. They do not
replace native iOS/Android interaction testing.
