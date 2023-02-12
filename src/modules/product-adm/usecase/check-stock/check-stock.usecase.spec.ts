import Product from "../../domain/product.entity";
import Id from "../../../@shared/domain/value-object/id.value-object";
import CheckStockUsecase from "./check-stock.usecase";

const product = new Product({
    id: new Id("1"),
    name: 'Product',
    description: 'Product description',
    purchasePrice: 100,
    stock: 10
})

const MockRepository = () => {
    return {
        add: jest.fn(),
        find: jest.fn().mockReturnValue(Promise.resolve(product)),
    }
}

describe('CheckStock usecase unit test', function () {
    it('should get stock of a product', async function () {
        const productRepository = MockRepository();
        const checkStockUseCase = new CheckStockUsecase(productRepository);
        const input = {
            productId: '1'
        }

        const result = await checkStockUseCase.execute(input);

        expect(productRepository.find).toHaveBeenCalled();
        expect(result.productId).toBe('1')
        expect(result.stock).toBe(10)

    });
});
