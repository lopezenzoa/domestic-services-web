import { ClientLite } from "./ClientLite";
import { ProviderLite } from "./ProviderLite";

export interface CallRequest {
  date: string;
  client: ClientLite;
  provider: ProviderLite;
  description: string;
  address: string;
}
