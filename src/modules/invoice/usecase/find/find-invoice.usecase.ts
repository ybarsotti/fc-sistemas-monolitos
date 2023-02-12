import UseCaseInterface from "../../../@shared/usecase/use-case.interface";
import InvoiceGateway from "../../gateway/invoice.gateway";
import {FindInvoiceUsecaseInputDto, FindInvoiceUsecaseOutputDto} from "./find-invoice.usecase.dto";

export default class FindInvoiceUsecase implements UseCaseInterface {
    constructor(private readonly _invoiceRepository: InvoiceGateway) {

    }

    async execute(input: FindInvoiceUsecaseInputDto): Promise<FindInvoiceUsecaseOutputDto> {
        const invoice = await this._invoiceRepository.find(input.id);

        return {
            address: {
                city: invoice.address.city,
                complement: invoice.address.complement,
                number: invoice.address.number,
                state: invoice.address.state,
                street: invoice.address.street,
                zipCode: invoice.address.zipCode
            },
            createdAt: invoice.createdAt,
            document: invoice.document,
            id: invoice.id.id,
            items: invoice?.items?.map(({id, name, price}) => ({id: id.id, name, price})),
            name: invoice.name,
            total: invoice.getTotal()
        }
    }
}
