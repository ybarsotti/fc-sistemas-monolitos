import GenerateInvoiceUsecase from "./generate-invoice.usecase";

const MockRepository = () => {
    return {
        add: jest.fn(),
        find: jest.fn(),
    }
}

describe('Generate invoice Usecase unit test', function () {
    it('should generate an invoice', async function () {
        const repository = MockRepository();
        const usecase = new GenerateInvoiceUsecase(repository);
        const input = {
            name: "Invoice 1",
            document: "123",
            street: "Street 1",
            number: "1",
            complement: "1",
            city: "City 1",
            state: "State 1",
            zipCode: "0123",
            items: [
                {
                    id: "1",
                    name: "Product 1",
                    price: 250
                },
                {
                    id: "2",
                    name: "Product 2",
                    price: 550
                },
            ],
        };

        const result = await usecase.execute(input);

        expect(repository.add).toHaveBeenCalled()
        expect(result.id).toBeDefined();
        expect(result.name).toBe(input.name);
        expect(result.document).toBe(input.document);
        expect(result.state).toBe(input.state)
        expect(result.number).toBe(input.number)
        expect(result.complement).toBe(input.complement)
        expect(result.city).toBe(input.city)
        expect(result.state).toBe(input.state)
        expect(result.zipCode).toBe(input.zipCode)
        expect(result.total).toBe(800)
        expect(result.items).toHaveLength(2);
        expect(result.items[0]).toStrictEqual({id: '1', name: 'Product 1', price: 250})
        expect(result.items[1]).toStrictEqual({id: '2', name: 'Product 2', price: 550})
    });
});
