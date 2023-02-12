import UseCaseInterface from "../../../@shared/usecase/use-case.interface";
import {PlaceOrderInputDto, PlaceOrderOutputDto} from "./place-order.dto";
import ClientAdmFacadeInterface from "../../../client-adm/facade/client-adm.facade.interface";
import ProductAdmFacadeInterface from "../../../product-adm/facade/product-adm.facade.interface";
import Product from "../../domain/product.entity";
import StoreCatalogFacadeInterface from "../../../store-catalog/facade/store-catalog.facade.interface";
import Id from "../../../@shared/domain/value-object/id.value-object";
import Client from "../../domain/client.entity";
import Order from "../../domain/order.entity";
import CheckoutGateway from "../../gateway/checkout.gateway";
import InvoiceFacadeInterface from "../../../invoice/facade/invoice.facade.interface";
import PaymentFacadeInterface from "../../../payment/facade/facade.interface";
import {or} from "sequelize";

export default class PlaceOrderUsecase implements UseCaseInterface {
    constructor(private _clientFacade: ClientAdmFacadeInterface,
                private _productFacade: ProductAdmFacadeInterface,
                private _catalogFacade: StoreCatalogFacadeInterface,
                private _repository: CheckoutGateway,
                private _invoiceFacade: InvoiceFacadeInterface,
                private _paymentFacade: PaymentFacadeInterface
    ) {
    }

    async execute(input: PlaceOrderInputDto): Promise<PlaceOrderOutputDto> {
        const client = await this._clientFacade.find({id: input.clientId})
        if (!client) throw new Error("Client not found")
        await this.validateProducts(input);

        const products = await Promise.all(
            input.products.map((p) => this.getProduct(p.productId))
        )

        const myClient = new Client({
            id: new Id(client.id),
            name: client.name,
            address: client.address,
            email: client.email
        })

        const order = new Order({
            client: myClient,
            products,
        })

        const payment = await this._paymentFacade.process({
            orderId: order.id.id,
            amount: order.total
        })

        const invoice = payment.status === 'approved' ? await this._invoiceFacade.generate({
            name: client.name,
            document: '123',
            city: 'c',
            number: '1',
            complement: '',
            state: 's',
            street: 'ss',
            zipCode: '1',
            items: products.map((p) => {
                return {
                    id: p.id.id,
                    name: p.name,
                    price: p.salesPrice,
                }
            })
        }) : null;
        payment.status === 'approved' && order.approved();
        await this._repository.addOrder(order);

        return {
            id: order.id.id,
            invoiceId: payment.status === 'approved' ? invoice.id : null,
            products: order.products.map((p) => {
                return {
                    productId: p.id.id,
                }
            }),
            status: order.status,
            total: order.total,
        }
    }


    private async validateProducts(input: PlaceOrderInputDto): Promise<void> {
        if (input.products.length === 0) {
            throw new Error('No products selected')
        }

        for (const p of input.products) {
            const product = await this._productFacade.checkStock({
                productId: p.productId,
            })
            if (product.stock <= 0) {
                throw new Error(`Product ${product.productId} is not available in stock`)
            }
        }
    }

    private async getProduct(productId: string): Promise<Product> {
        const product = await this._catalogFacade.find({id: productId});
        if (!product) throw new Error('Product not found')
        const productProps = {
            id: new Id(product.id),
            name: product.name,
            description: product.description,
            salesPrice: product.salesPrice,
        }
        return new Product(productProps)
    }
}
