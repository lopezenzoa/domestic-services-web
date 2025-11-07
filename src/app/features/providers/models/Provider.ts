import { Shift } from "./Shift";

export interface Provider {
    // Define the properties of the Provider interface
    id: number;
    firstName: string;
    lastName: string;
    address: string;
    phoneNumber: string;
    email: string;
    username: string;
    password: string;
    role: 'PROVIDER';
    licenseNumber: string;
    facility: {
        id: number;
        name: string;
        description: string;
    };
    shifts: Shift[];
}