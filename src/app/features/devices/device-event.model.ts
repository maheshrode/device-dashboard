export interface DeviceEvent {
  timestamp: number;
  partsPerMinute: number;
  status: 'running' | 'stopped' | 'maintenance';
  deviceId: string;
  order: string;
}
