import UseCaseInterface from "../../../@shared/usecase/use-case.interface";
import InvoiceGateway from "../../gateway/invoice.gateway";
import {GenerateInvoiceUsecaseInputDto, GenerateInvoiceUsecaseOutputDto} from "./generate-invoice.usecase.dto";
import Invoice from "../../domain/invoice.entity";
import Address from "../../value-object/address.value-object";
import Product from "../../domain/product.entity";
import Id from "../../../@shared/domain/value-object/id.value-object";

export default class GenerateInvoiceUsecase implements UseCaseInterface {
    constructor(private readonly _invoiceRepository: InvoiceGateway) {
    }

    async execute(input: GenerateInvoiceUsecaseInputDto): Promise<GenerateInvoiceUsecaseOutputDto> {
        const invoice = new Invoice({
            id: new Id(input.id),
            address: new Address({
                city: input.city,
                complement: input.complement,
                number: input.number,
                state: input.state,
                street: input.street,
                zipCode: input.zipCode
            }),
            document: input.document, items: input.items.map(({id, name, price}) => new Product({
                id: new Id(id), name, price
            })), name: input.name
        });
        await this._invoiceRepository.add(invoice)

        return {
            city: invoice.address.city,
            complement: invoice.address.complement,
            document: invoice.document,
            id: invoice.id.id,
            items: invoice.items.map(({id, name, price}) => ({id: id.id, name, price})),
            name: invoice.name,
            number: invoice.address.number,
            state: invoice.address.state,
            street: invoice.address.street,
            total: invoice.getTotal(),
            zipCode: invoice.address.zipCode
        }
    }
}
