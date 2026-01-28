import { Detail, showToast, Toast, getPreferenceValues } from "@raycast/api";
import { useEffect, useState } from "react";
import { getDeviceStatus, DeviceInfo, validateCliPath, Preferences } from "./litra";

export default function Command() {
  const [device, setDevice] = useState<DeviceInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchStatus(): Promise<void> {
      try {
        const { litraPath } = getPreferenceValues<Preferences>();
        await validateCliPath(litraPath);
        const status = await getDeviceStatus();
        setDevice(status);
        if (!status) {
          setError("No Litra device found. Make sure it's connected via USB.");
        }
      } catch (err) {
        const message = err instanceof Error ? err.message : "Unknown error";
        setError(message);
        await showToast({
          style: Toast.Style.Failure,
          title: "Failed to get device status",
          message,
        });
      } finally {
        setLoading(false);
      }
    }
    fetchStatus();
  }, []);

  if (loading) {
    return <Detail isLoading={true} markdown="Loading device status..." />;
  }

  if (error || !device) {
    return (
      <Detail
        markdown={`# Device Status\n\n**Error:** ${error || "No device found"}\n\n## Troubleshooting\n\n1. Make sure your Litra Glow is connected via USB\n2. Check that the Litra CLI is installed at the configured path\n3. Try unplugging and reconnecting the device`}
      />
    );
  }

  const markdown = `# ${device.name}

| Property | Value |
|----------|-------|
| **Status** | ${device.isOn ? "On" : "Off"} |
| **Brightness** | ${device.brightness !== undefined ? `${device.brightness}%` : "Unknown"} |
| **Temperature** | ${device.temperature !== undefined ? `${device.temperature}K` : "Unknown"} |
${device.serial ? `| **Serial** | ${device.serial} |` : ""}
`;

  return <Detail markdown={markdown} />;
}
