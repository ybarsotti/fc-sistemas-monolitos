import StoreCatalogFacadeInterface, {
    FindAllStoreCatalogFacadeOutputDto,
    FindStoreCatalogFacadeInputDto, FindStoreCatalogFacadeOutputDto
} from "./store-catalog.facade.interface";
import FindProductUsecase from "../usecase/find-product/find-product.usecase";
import FindAllProductsUsecase from "../usecase/find-all-products/find-all-products.usecase";

export interface UseCaseProps {
    findUseCase: FindProductUsecase;
    findAllUseCase: FindAllProductsUsecase;
}

export default class StoreCatalogFacade implements StoreCatalogFacadeInterface {
    private readonly _findUseCase: FindProductUsecase;
    private readonly _findAllUseCase: FindAllProductsUsecase;

    constructor(props: UseCaseProps) {
        this._findAllUseCase = props.findAllUseCase;
        this._findUseCase = props.findUseCase
    }

    find(id: FindStoreCatalogFacadeInputDto): Promise<FindStoreCatalogFacadeOutputDto> {
        return this._findUseCase.execute(id);
    }

    findAll(): Promise<FindAllStoreCatalogFacadeOutputDto> {
        return this._findAllUseCase.execute()
    }
}
