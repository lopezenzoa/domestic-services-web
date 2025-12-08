export interface Provider {
  id: number;
  firstName: string;
  lastName: string;

  facility: {
    id: number;
    name: string;
  };

  shifts?: {
    id: number;
    dateTime: string;
    available: boolean;
  }[];
}
