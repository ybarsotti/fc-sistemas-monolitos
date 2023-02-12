import {Sequelize} from "sequelize-typescript";
import Invoice from "../domain/invoice.entity";
import Id from "../../@shared/domain/value-object/id.value-object";
import Address from "../value-object/address.value-object";
import Product from "../domain/product.entity";
import InvoiceRepository from "./invoice.repository";
import {InvoiceModel} from "./invoice.model";
import {InvoiceProductModel} from "./invoice-product.model";

describe('InvoiceRepository test', function () {
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

    it('should add an invoice', async function () {
        const invoice = new Invoice({
            address: new Address({
                city: "City 1", complement: "C 1", number: "1", state: "State 1", street: "Street 1", zipCode: "Code"
            }),
            document: "123", id: new Id("1"), items: [
                new Product({
                    name: "P1", price: 50
                }), new Product({
                    name: "P2", price: 150
                }),
            ], name: "Invoice 1"
        })

        const repository = new InvoiceRepository();
        await repository.add(invoice);

        const invoiceDb = await InvoiceModel.findOne({where: {id: '1'}, include: [InvoiceProductModel]})
        expect(invoiceDb).toBeDefined();
        expect(invoiceDb.id).toBe(invoice.id.id);
        expect(invoiceDb.name).toBe(invoice.name);
        expect(invoiceDb.document).toBe(invoice.document);
        expect(invoiceDb.street).toBe(invoice.address.street);
        expect(invoiceDb.number).toBe(invoice.address.number);
        expect(invoiceDb.complement).toBe(invoice.address.complement);
        expect(invoiceDb.city).toBe(invoice.address.city);
        expect(invoiceDb.state).toBe(invoice.address.state);
        expect(invoiceDb.zipCode).toBe(invoice.address.zipCode);
        expect(invoiceDb.products).toHaveLength(2);
        expect(invoiceDb.products[0].name).toBe('P1')
        expect(invoiceDb.products[0].price).toBe(50)
        expect(invoiceDb.products[1].name).toBe('P2')
        expect(invoiceDb.products[1].price).toBe(150)
    });

    it('should find an invoice', async function () {
        const invoice = await InvoiceModel.create({
            id: '1',
            name: 'Invoice 1',
            document: '123',
            street: 'street 1',
            number: '1',
            complement: 'c',
            city: 'city 1',
            state: 'state 1',
            zipCode: 'code',
            createdAt: new Date(),
            updatedAt: new Date(),
            products: [
                {id: '1', name: 'p1', price: 50, createdAt: new Date(), updatedAt: new Date()},
                {id: '2', name: 'p2', price: 100, createdAt: new Date(), updatedAt: new Date()},
            ],
        }, {
            include: [InvoiceProductModel]
        })

        const repository = new InvoiceRepository()
        const result = await repository.find('1')

        expect(result.id.id).toBe('1')
        expect(result.name).toBe(invoice.name)
        expect(result.document).toBe(invoice.document)
        expect(result.address.street).toBe(invoice.street)
        expect(result.address.number).toBe(invoice.number)
        expect(result.address.complement).toBe(invoice.complement)
        expect(result.address.city).toBe(invoice.city)
        expect(result.address.state).toBe(invoice.state)
        expect(result.address.zipCode).toBe(invoice.zipCode)
        expect(result.items).toHaveLength(2)
        expect(result.items[0].name).toBe('p1')
        expect(result.items[0].price).toBe(50)
        expect(result.items[1].name).toBe('p2')
        expect(result.items[1].price).toBe(100)
    });
});
