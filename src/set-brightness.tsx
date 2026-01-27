import { ActionPanel, Action, List, showToast, Toast, getPreferenceValues } from "@raycast/api";
import { execSync } from "child_process";

interface Preferences {
  litraPath: string;
}

interface BrightnessOption {
  value: number;
  label: string;
}

const brightnessOptions: BrightnessOption[] = [
  { value: 10, label: "10% - Very Dim" },
  { value: 20, label: "20% - Dim" },
  { value: 30, label: "30% - Low" },
  { value: 40, label: "40% - Medium Low" },
  { value: 50, label: "50% - Medium" },
  { value: 60, label: "60% - Medium High" },
  { value: 70, label: "70% - Bright" },
  { value: 80, label: "80% - Very Bright" },
  { value: 90, label: "90% - Near Maximum" },
  { value: 100, label: "100% - Maximum" },
];

export default function Command() {
  const { litraPath } = getPreferenceValues<Preferences>();

  async function setBrightness(value: number) {
    try {
      execSync(`"${litraPath}" brightness --device-type glow --percentage ${value}`);
      await showToast({
        style: Toast.Style.Success,
        title: "Brightness set",
        message: `${value}%`,
      });
    } catch (error) {
      await showToast({
        style: Toast.Style.Failure,
        title: "Failed to set brightness",
        message: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }

  return (
    <List searchBarPlaceholder="Search brightness...">
      {brightnessOptions.map((option) => (
        <List.Item
          key={option.value}
          title={option.label}
          actions={
            <ActionPanel>
              <Action title="Set Brightness" onAction={() => setBrightness(option.value)} />
            </ActionPanel>
          }
        />
      ))}
    </List>
  );
}
