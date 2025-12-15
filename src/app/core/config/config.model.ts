export interface ApiEndpoints {
  config: string;
  devices: string;
  events: string;
  order: string;
}

export interface AppConfig {
  availableLanguages: string[];
  environment: string;
  environmentColour: string;
  environmentName: string;
  endpoints: ApiEndpoints;
}
