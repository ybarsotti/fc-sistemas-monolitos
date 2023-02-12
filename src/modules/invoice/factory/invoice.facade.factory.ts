import InvoiceRepository from "../repository/invoice.repository";
import FindInvoiceUsecase from "../usecase/find/find-invoice.usecase";
import GenerateInvoiceUsecase from "../usecase/generate/generate-invoice.usecase";
import InvoiceFacade from "../facade/invoice.facade";

export default class InvoiceFacadeFactory {
    static create() {
        const repository = new InvoiceRepository();
        const findUseCase = new FindInvoiceUsecase(repository);
        const generateUseCase = new GenerateInvoiceUsecase(repository);

        return new InvoiceFacade({
            generateUseCase: generateUseCase,
            findUseCase: findUseCase
        })
    }
}
