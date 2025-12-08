import { Client } from './Client';
import { Provider } from './Provider';

export interface Call {
  id: number;
  description: string;
  address: string;
  date: string;
  state: string;

  client: Client;     
  provider: Provider; 
}
