import { GrvtClient, GrvtWsClient, EGrvtEnvironment } from "@grvt/sdk";

export interface GrvtCredentials {
  apiKey: string;
  apiSecret: string;
  env: EGrvtEnvironment;
  subAccountId: string;
  instrument: string;
}

export class GrvtGateway {
  private readonly grvtClient: GrvtClient;
  private readonly wsClient: GrvtWsClient;

  constructor(private readonly credentials: GrvtCredentials) {
    this.grvtClient = new GrvtClient({
      apiKey: credentials.apiKey,
      apiSecret: credentials.apiSecret,
      env: credentials.env,
    });
    this.wsClient = new GrvtWsClient({ apiKey: credentials.apiKey, env: credentials.env });
  }

  async initialize(): Promise<void> {
    await this.wsClient.connect();
  }
}

