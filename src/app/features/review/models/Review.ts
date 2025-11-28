import { Provider } from "../../providers/models/Provider";

export interface Review {
    id ?: number;
    description: string;
    creationDate: string;
    client: any;
    provider: any
    
}