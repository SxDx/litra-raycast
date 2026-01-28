# Litra Changelog

## [1.1.0]

### Added
- New "Device Status" command to view current device state (on/off, brightness, temperature)
- Current brightness/temperature indicators in list views with checkmarks
- Auto-scroll to currently selected value when opening brightness/temperature lists
- Shared utility module (`litra.ts`) for consistent CLI interactions
- CLI path validation - checks if executable exists before running commands
- Device detection with helpful error messages when device is not connected

### Changed
- Converted from synchronous to asynchronous CLI execution for better UI responsiveness
- Improved error messages with specific guidance (CLI not found vs device not connected)

### Security
- Fixed potential command injection vulnerability by using `execFile` instead of `execSync` with string interpolation

### Developer Experience
- Enabled stricter TypeScript compiler options (`noUncheckedIndexedAccess`, `noImplicitReturns`, `noFallthroughCasesInSwitch`, `exactOptionalPropertyTypes`, `noPropertyAccessFromIndexSignature`)
- Reduced code duplication across commands

## [1.0.0]

### Added
- Toggle Light command - Turn Litra Glow on or off
- Set Brightness command - Choose from 10 brightness levels (10% to 100%)
- Set Temperature command - Select from 41 color temperature presets (2700K to 6500K)
- Configurable CLI path in extension preferences
