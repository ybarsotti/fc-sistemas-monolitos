import {Sequelize} from "sequelize-typescript";
import {InvoiceModel} from "../repository/invoice.model";
import {InvoiceProductModel} from "../repository/invoice-product.model";
import InvoiceFacadeFactory from "../factory/invoice.facade.factory";

describe('InvoiceFacade test', function () {
    let sequelize: Sequelize;

    beforeEach(async () => {
        sequelize = new Sequelize({
            dialect: "sqlite",
            storage: ":memory:",
            logging: false,
            sync: {force: true},
        });

        await sequelize.addModels([InvoiceModel, InvoiceProductModel]);
        await sequelize.sync();
    });

    afterEach(async () => {
        await sequelize.close();
    });

    it('should generate an invoice', async function () {
        const usecase = InvoiceFacadeFactory.create();
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

        const result = await usecase.generate(input);

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

    it('should find an invoice', async function () {
        const usecase = InvoiceFacadeFactory.create();
        const input = {
            id: '1',
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

        await usecase.generate(input);

        const invoice = await usecase.find({id: '1'})

        expect(invoice).toBeDefined()
        expect(invoice.id).toBeDefined();
        expect(invoice.name).toBe(input.name);
        expect(invoice.document).toBe(input.document);
        expect(invoice.address.street).toBe(input.street);
        expect(invoice.address.number).toBe(input.number);
        expect(invoice.address.complement).toBe(input.complement);
        expect(invoice.address.city).toBe(input.city);
        expect(invoice.address.state).toBe(input.state);
        expect(invoice.address.zipCode).toBe(input.zipCode);
        expect(invoice.items).toHaveLength(2);
        expect(invoice.items[0].name).toBe('Product 1')
        expect(invoice.items[0].price).toBe(250)
        expect(invoice.items[1].name).toBe('Product 2')
        expect(invoice.items[1].price).toBe(550)
    });
});
