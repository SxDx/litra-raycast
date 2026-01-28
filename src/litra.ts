import { getPreferenceValues, showToast, Toast } from "@raycast/api";
import { execFile } from "child_process";
import { promisify } from "util";
import { access, constants } from "fs/promises";

const execFileAsync = promisify(execFile);

export interface Preferences {
  litraPath: string;
}

export interface DeviceInfo {
  name: string;
  serial: string | undefined;
  isOn: boolean;
  brightness: number | undefined;
  temperature: number | undefined;
}

export interface LitraCommandResult {
  success: boolean;
  stdout: string;
  stderr: string;
}

/**
 * Validates that the Litra CLI exists and is executable
 */
export async function validateCliPath(litraPath: string): Promise<void> {
  try {
    await access(litraPath, constants.X_OK);
  } catch {
    throw new Error(`Litra CLI not found or not executable at: ${litraPath}`);
  }
}

/**
 * Executes a Litra CLI command safely using execFile (no shell injection risk)
 */
export async function executeLitraCommand(args: string[]): Promise<LitraCommandResult> {
  const { litraPath } = getPreferenceValues<Preferences>();

  await validateCliPath(litraPath);

  try {
    const { stdout, stderr } = await execFileAsync(litraPath, args);
    return { success: true, stdout, stderr };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";

    if (message.includes("No devices found") || message.includes("no devices")) {
      throw new Error("No Litra device found. Make sure it's connected via USB.");
    }

    throw error;
  }
}

/**
 * Executes a Litra command and shows appropriate toast notifications
 */
export async function executeLitraCommandWithToast(
  args: string[],
  successTitle: string,
  successMessage?: string,
): Promise<boolean> {
  try {
    await executeLitraCommand(args);
    const toastOptions: Toast.Options = {
      style: Toast.Style.Success,
      title: successTitle,
    };
    if (successMessage !== undefined) {
      toastOptions.message = successMessage;
    }
    await showToast(toastOptions);
    return true;
  } catch (error) {
    await showToast({
      style: Toast.Style.Failure,
      title: "Command failed",
      message: error instanceof Error ? error.message : "Unknown error",
    });
    return false;
  }
}

/**
 * Calculates brightness percentage from lumen value
 */
function calculateBrightnessPercentage(lumen: number, min: number, max: number): number {
  // Map lumen value to 10-100% range (matching our UI options)
  const percentage = Math.round(((lumen - min) / (max - min)) * 90 + 10);
  // Round to nearest 10 to match our predefined options
  return Math.round(percentage / 10) * 10;
}

/**
 * Gets the current device status including brightness and temperature
 */
export async function getDeviceStatus(): Promise<DeviceInfo | null> {
  try {
    const { stdout } = await executeLitraCommand(["devices", "--json"]);
    const devices: unknown = JSON.parse(stdout);

    if (!Array.isArray(devices) || devices.length === 0) {
      return null;
    }

    const device = devices[0] as Record<string, unknown>;

    // Calculate brightness percentage from lumen values
    let brightnessPercentage: number | undefined;
    const brightnessLumen = device["brightness_in_lumen"];
    const minLumen = device["minimum_brightness_in_lumen"];
    const maxLumen = device["maximum_brightness_in_lumen"];

    if (typeof brightnessLumen === "number" && typeof minLumen === "number" && typeof maxLumen === "number") {
      brightnessPercentage = calculateBrightnessPercentage(brightnessLumen, minLumen, maxLumen);
    }

    const name = device["device_type_display"];
    const serial = device["serial_number"];
    const isOn = device["is_on"];
    const temperature = device["temperature_in_kelvin"];

    return {
      name: typeof name === "string" ? name : "Litra Glow",
      serial: typeof serial === "string" ? serial : undefined,
      isOn: typeof isOn === "boolean" ? isOn : false,
      brightness: brightnessPercentage,
      temperature: typeof temperature === "number" ? temperature : undefined,
    };
  } catch {
    return null;
  }
}

/**
 * Checks if a Litra device is connected
 */
export async function isDeviceConnected(): Promise<boolean> {
  const status = await getDeviceStatus();
  return status !== null;
}

/**
 * Toggles the light on/off
 */
export async function toggleLight(): Promise<boolean> {
  return executeLitraCommandWithToast(["toggle", "--device-type", "glow"], "Light toggled");
}

/**
 * Sets the brightness percentage
 */
export async function setBrightness(percentage: number): Promise<boolean> {
  return executeLitraCommandWithToast(
    ["brightness", "--device-type", "glow", "--percentage", String(percentage)],
    "Brightness set",
    `${percentage}%`,
  );
}

/**
 * Sets the color temperature in Kelvin
 */
export async function setTemperature(kelvin: number): Promise<boolean> {
  return executeLitraCommandWithToast(
    ["temperature", "--device-type", "glow", "--value", String(kelvin)],
    "Temperature set",
    `${kelvin}K`,
  );
}
