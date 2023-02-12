import Invoice from "../../domain/invoice.entity";
import Id from "../../../@shared/domain/value-object/id.value-object";
import Address from "../../value-object/address.value-object";
import Product from "../../domain/product.entity";
import FindInvoiceUsecase from "./find-invoice.usecase";

const invoice = new Invoice({
    address: new Address({
        city: "City 1", complement: "1", number: "1", state: "SP", street: "Street", zipCode: "Code"
    }),
    createdAt: new Date(),
    document: "123",
    id: new Id("1"),
    items: [
        new Product({id: new Id("1"), name: "Product 1", price: 100}),
        new Product({id: new Id("2"), name: "Product 2", price: 200}),
    ],
    name: 'Invoice 1',
    updatedAt: new Date()
})

const MockRepository = () => {
    return {
        add: jest.fn(),
        find: jest.fn().mockReturnValue(Promise.resolve(invoice))
    }
}

describe('Find Invoice Usecase unit test', function () {
    it('should find an invoice', async function () {
        const repository = MockRepository();
        const usecase = new FindInvoiceUsecase(repository);

        const input = {
            id: '1',
        }

        const result = await usecase.execute(input);

        expect(repository.find).toHaveBeenCalled();
        expect(result.id).toBe('1')
        expect(result.document).toBe('123')
        expect(result.name).toBe('Invoice 1')
        expect(result.total).toBe(300)
        expect(result.address).toStrictEqual({
            city: "City 1", complement: "1", number: "1", state: "SP", street: "Street", zipCode: "Code"
        })
        expect(result.items[0]).toStrictEqual({id: '1', name: 'Product 1', price: 100})
        expect(result.items[1]).toStrictEqual({id: '2', name: 'Product 2', price: 200})
    });
});
