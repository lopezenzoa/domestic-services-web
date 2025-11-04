export interface User {
    id: number;
    firstName: string;
    lastName: string;
    address: string;
    phoneNumber: string;
    email: string;
    username: string;
    password: string;
    role: "CLIENT" | "PROVIDER" | "ADMIN";
}