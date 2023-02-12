import InvoiceGateway from "../gateway/invoice.gateway";
import Invoice from "../domain/invoice.entity";
import {InvoiceModel} from "./invoice.model";
import Address from "../value-object/address.value-object";
import Id from "../../@shared/domain/value-object/id.value-object";
import Product from "../domain/product.entity";
import {InvoiceProductModel} from "./invoice-product.model";

export default class InvoiceRepository implements InvoiceGateway {
    async add(invoice: Invoice): Promise<void> {
        await InvoiceModel.create({
            id: invoice.id.id,
            name: invoice.name,
            document: invoice.document,
            street: invoice.address.street,
            number: invoice.address.number,
            complement: invoice.address.complement,
            city: invoice.address.city,
            state: invoice.address.state,
            zipCode: invoice.address.zipCode,
            createdAt: invoice.createdAt,
            updatedAt: invoice.updatedAt,
            products: invoice.items.map(({ id, name, price, updatedAt, createdAt }) => ({
                id: id.id,
                name,
                price,
                createdAt,
                updatedAt
            }))
        }, {
            include: [InvoiceProductModel]
        })
    }

    async find(id: string): Promise<Invoice> {
        const invoice = await InvoiceModel.findOne({
            include: InvoiceProductModel,
            where: {
                id
            },
        });
        return new Invoice({
            address: new Address({
                city: invoice?.city,
                complement: invoice?.complement,
                number: invoice?.number,
                state: invoice?.state,
                street: invoice?.street,
                zipCode: invoice?.zipCode
            }),
            createdAt: invoice.createdAt,
            document: invoice.document,
            id: new Id(invoice.id),
            items: invoice.products.map(({id, name, price}) => new Product({
                id: new Id(id),
                name,
                price
            })),
            name: invoice.name,
            updatedAt: invoice.updatedAt
        })
    }
}
