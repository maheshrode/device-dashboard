export type Environment = 'TEST' | 'QUAL' | 'PROD';

export interface AppConfig {
    environment: Environment;
    apiBaseUrl: string;
    refreshInterval?: number;
}
