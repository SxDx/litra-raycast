# Litra Control

A Raycast extension for controlling your Logitech Litra Glow light directly from macOS.

## Features

- **Toggle Light** - Quickly turn your Litra Glow on or off with a single command
- **Set Brightness** - Choose from 10 brightness levels (10% to 100%)
- **Set Temperature** - Select from 41 color temperature presets (2700K warm to 6500K cool)

All commands provide instant feedback via toast notifications.

## Prerequisites

This extension requires [Litra CLI](https://github.com/timrogers/litra-rs) to be installed on your system.

The extension expects the CLI at `/opt/homebrew/bin/litra` by default. If your installation path differs, you can configure it in the extension preferences.

## Usage

1. Open Raycast
2. Search for one of the commands:
   - "Toggle Light" - Turns the light on or off
   - "Set Brightness" - Opens a list to select brightness percentage
   - "Set Temperature" - Opens a list to select color temperature in Kelvin

## Configuration

Open Raycast preferences to configure:

- **Litra CLI Path** - Path to the litra executable (default: `/opt/homebrew/bin/litra`)

## Installation

```bash
# Install dependencies
npm install

# Build the extension
npm run build
```

After building, import the extension into Raycast:
1. Open Raycast
2. Search for "Import Extension"
3. Select the project folder

## Development

```bash
# Start development mode (builds and watches for changes)
npm run dev

# Lint code
npm run lint

# Fix linting issues
npm run fix-lint
```
