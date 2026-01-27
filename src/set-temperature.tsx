import { ActionPanel, Action, List, showToast, Toast, getPreferenceValues } from "@raycast/api";
import { execSync } from "child_process";

interface Preferences {
  litraPath: string;
}

interface TemperatureOption {
  value: number;
  label: string;
}

const temperatureOptions: TemperatureOption[] = [
  { value: 2700, label: "2700K - Warm Candlelight" },
  { value: 2800, label: "2800K - Warm" },
  { value: 2900, label: "2900K - Warm" },
  { value: 3000, label: "3000K - Warm White" },
  { value: 3100, label: "3100K - Warm White" },
  { value: 3200, label: "3200K - Studio Warm" },
  { value: 3300, label: "3300K - Studio Warm" },
  { value: 3400, label: "3400K - Neutral Warm" },
  { value: 3500, label: "3500K - Neutral Warm" },
  { value: 3600, label: "3600K - Neutral" },
  { value: 3700, label: "3700K - Neutral" },
  { value: 3800, label: "3800K - Neutral" },
  { value: 3900, label: "3900K - Neutral" },
  { value: 4000, label: "4000K - Cool White" },
  { value: 4100, label: "4100K - Cool White" },
  { value: 4200, label: "4200K - Cool White" },
  { value: 4300, label: "4300K - Cool White" },
  { value: 4400, label: "4400K - Cool White" },
  { value: 4500, label: "4500K - Daylight" },
  { value: 4600, label: "4600K - Daylight" },
  { value: 4700, label: "4700K - Daylight" },
  { value: 4800, label: "4800K - Daylight" },
  { value: 4900, label: "4900K - Daylight" },
  { value: 5000, label: "5000K - Bright Daylight" },
  { value: 5100, label: "5100K - Bright Daylight" },
  { value: 5200, label: "5200K - Bright Daylight" },
  { value: 5300, label: "5300K - Bright Daylight" },
  { value: 5400, label: "5400K - Bright Daylight" },
  { value: 5500, label: "5500K - Mid-Day Sun" },
  { value: 5600, label: "5600K - Mid-Day Sun" },
  { value: 5700, label: "5700K - Mid-Day Sun" },
  { value: 5800, label: "5800K - Mid-Day Sun" },
  { value: 5900, label: "5900K - Mid-Day Sun" },
  { value: 6000, label: "6000K - Cool Daylight" },
  { value: 6100, label: "6100K - Cool Daylight" },
  { value: 6200, label: "6200K - Cool Daylight" },
  { value: 6300, label: "6300K - Cool Daylight" },
  { value: 6400, label: "6400K - Cool Daylight" },
  { value: 6500, label: "6500K - Overcast Sky" },
];

export default function Command() {
  const { litraPath } = getPreferenceValues<Preferences>();

  async function setTemperature(value: number) {
    try {
      execSync(`"${litraPath}" temperature --device-type glow --value ${value}`);
      await showToast({
        style: Toast.Style.Success,
        title: "Temperature set",
        message: `${value}K`,
      });
    } catch (error) {
      await showToast({
        style: Toast.Style.Failure,
        title: "Failed to set temperature",
        message: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }

  return (
    <List searchBarPlaceholder="Search temperature...">
      {temperatureOptions.map((option) => (
        <List.Item
          key={option.value}
          title={option.label}
          actions={
            <ActionPanel>
              <Action title="Set Temperature" onAction={() => setTemperature(option.value)} />
            </ActionPanel>
          }
        />
      ))}
    </List>
  );
}
