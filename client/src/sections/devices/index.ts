import { Device, DeviceType } from "../../shared/device.interface";


export const DeviceTypeLabels: Record<DeviceType, string> = {
  adapter: "🔌 adapter",
  laptop: "💻 laptop",
  monitor: "🖥️ monitor",
  network: "🌐 network",
  other: "☎️ other",
  printer: "🖨️ printer",
  tv: "📺 tv"

}

export const renderDeviceName = (device: Device) => {
  return device.name;
};
