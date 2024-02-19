export class Address {
    constructor(
        public streetNumber: string,
        public streetName: string,
        public postalCode: string,
        public city: string,
        public addressLine2?: string, // optionnel avec "?"
        
        ) {}
    }
    