import { showToast, Toast, getPreferenceValues } from "@raycast/api";
import { execSync } from "child_process";

interface Preferences {
  litraPath: string;
}

export default async function Command() {
  const { litraPath } = getPreferenceValues<Preferences>();

  try {
    execSync(`"${litraPath}" toggle --device-type glow`);
    await showToast({
      style: Toast.Style.Success,
      title: "Light toggled",
    });
  } catch (error) {
    await showToast({
      style: Toast.Style.Failure,
      title: "Failed to toggle light",
      message: error instanceof Error ? error.message : "Unknown error",
    });
  }
}
