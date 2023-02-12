export interface FindInvoiceUsecaseFacadeInputDto {
    id: string;
}
export interface FindInvoiceUsecaseFacadeOutputDto {
    id: string;
    name: string;
    document: string;
    address: {
        street: string;
        number: string;
        complement: string;
        city: string;
        state: string;
        zipCode: string;
    };
    items: {
        id: string;
        name: string;
        price: number;
    }[];
    total: number;
    createdAt: Date;
}

export interface GenerateInvoiceUsecaseFacadeInputDto {
    name: string;
    document: string;
    street: string;
    number: string;
    complement: string;
    city: string;
    state: string;
    zipCode: string;
    items: {
        id: string;
        name: string;
        price: number;
    }[];
}
export interface GenerateInvoiceUsecaseFacadeOutputDto {
    id: string;
    name: string;
    document: string;
    street: string;
    number: string;
    complement: string;
    city: string;
    state: string;
    zipCode: string;
    items: {
        id: string;
        name: string;
        price: number;
    }[];
    total: number;
}



export default interface InvoiceFacadeInterface {
    generate(input: GenerateInvoiceUsecaseFacadeInputDto): Promise<GenerateInvoiceUsecaseFacadeOutputDto>
    find(inpu: FindInvoiceUsecaseFacadeInputDto): Promise<FindInvoiceUsecaseFacadeOutputDto>
}
