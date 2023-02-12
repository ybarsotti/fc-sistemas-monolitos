import InvoiceFacadeInterface, {
    FindInvoiceUsecaseFacadeInputDto, FindInvoiceUsecaseFacadeOutputDto,
    GenerateInvoiceUsecaseFacadeInputDto, GenerateInvoiceUsecaseFacadeOutputDto
} from "./invoice.facade.interface";
import UseCaseInterface from "../../@shared/usecase/use-case.interface";

export interface UseCaseProps {
    generateUseCase: UseCaseInterface;
    findUseCase: UseCaseInterface;
}

export default class InvoiceFacade implements InvoiceFacadeInterface {
    private _findUseCase: UseCaseInterface;
    private _generateUseCase: UseCaseInterface;

    constructor(props: UseCaseProps) {
        this._findUseCase = props.findUseCase;
        this._generateUseCase = props.generateUseCase;
    }


    find(input: FindInvoiceUsecaseFacadeInputDto): Promise<FindInvoiceUsecaseFacadeOutputDto> {
        return this._findUseCase.execute(input)
    }

    generate(input: GenerateInvoiceUsecaseFacadeInputDto): Promise<GenerateInvoiceUsecaseFacadeOutputDto> {
        return this._generateUseCase.execute(input)
    }

}
