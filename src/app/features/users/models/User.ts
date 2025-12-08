export interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  role: "CLIENT" | "PROVIDER" | "ADMIN";
  address?: string;
  phoneNumber?: string;
  username?: string;
}
