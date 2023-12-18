export class User {
    id: number;
    username: string;
    password: string;
    firstName?: string;
    lastName?: string;
    token?: string;
    email: string;
    role: string;
    company?: string;
    phone?: string;
    active?: boolean;
    authorized_connection?: boolean;
    dateUpd?: Date;
    dateAdd?: Date;
}