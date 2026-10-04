# Changelog

## [1.1.0] - 2026-10-04

### Added
- `maxDecimals` option to limit decimal places (#9).
- `submitRaw` option: a hidden input with the field's `name` submits the raw number (#7, #10).
- `disallowPaste` / `disallowDrop` options (opt-in, off by default), based on #12.
- `easyNumberSeparator()` now returns `{ refresh() }` to re-format values set from code (#13).
- Test suite using Node's built-in test runner (`node --test test/`), no dependencies.
- New demo page with small live examples.

### Changed
- Pasted or dropped text is cleaned of invalid characters and reformatted.
- Inputs added to the page later are detected with `MutationObserver` (replaces the removed `DOMNodeInserted` event) (#6, #11).
- README rewritten to be shorter and clearer.

### Fixed
- Using `.` (or another regex special character) as separator allowed non-numeric input (#8).
- Multiple inputs on one page: no leaked global variables, no duplicate listeners (#11).

## [1.0.0] - 2022-12-11
- Initial release.

[1.1.0]: https://github.com/amiryxe/easy-number-separator/compare/1.0...v1.1.0
[1.0.0]: https://github.com/amiryxe/easy-number-separator/releases/tag/1.0
