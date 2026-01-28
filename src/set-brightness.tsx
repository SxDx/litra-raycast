import { ActionPanel, Action, List, Icon, Color } from "@raycast/api";
import { useEffect, useState } from "react";
import { setBrightness, getDeviceStatus } from "./litra";

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
  const [currentBrightness, setCurrentBrightness] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchStatus(): Promise<void> {
      const status = await getDeviceStatus();
      if (status?.brightness !== undefined) {
        setCurrentBrightness(status.brightness);
      }
      setIsLoading(false);
    }
    fetchStatus();
  }, []);

  async function handleSetBrightness(value: number): Promise<void> {
    const success = await setBrightness(value);
    if (success) {
      setCurrentBrightness(value);
    }
  }

  const selectedId = currentBrightness !== null ? String(currentBrightness) : null;

  return (
    <List
      searchBarPlaceholder="Search brightness..."
      isLoading={isLoading}
      {...(selectedId && { selectedItemId: selectedId })}
    >
      {brightnessOptions.map((option) => {
        const isCurrent = currentBrightness === option.value;
        return (
          <List.Item
            key={option.value}
            id={String(option.value)}
            title={option.label}
            icon={isCurrent ? { source: Icon.CheckCircle, tintColor: Color.Green } : Icon.Circle}
            accessories={isCurrent ? [{ tag: { value: "Current", color: Color.Green } }] : []}
            actions={
              <ActionPanel>
                <Action title="Set Brightness" onAction={() => handleSetBrightness(option.value)} />
              </ActionPanel>
            }
          />
        );
      })}
    </List>
  );
}
