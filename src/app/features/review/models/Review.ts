import { Provider } from "../../../shared/models/Provider";

export interface Review {
    id ?: number;
    description: string;
    creationDate: string;
    client: any;
    provider: any
    
}