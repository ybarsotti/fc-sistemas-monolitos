import PlaceOrderUsecase from "./place-order.usecase";
import {PlaceOrderInputDto} from "./place-order.dto";
import Product from "../../domain/product.entity";
import Id from "../../../@shared/domain/value-object/id.value-object";

const mockDate = new Date(2000, 1, 1)

describe('PlaceOrderUseCase unit test', function () {

    describe('validateProducts method', function () {
        // @ts-ignore
        const placeOrderUseCase = new PlaceOrderUsecase()

        it('should throw error if no products are selected', async function () {
            const input: PlaceOrderInputDto = {
                clientId: '0',
                products: [],
            }

            await expect(placeOrderUseCase['validateProducts'](input)).rejects.toThrow(new Error("No products selected"))
        });

        it('should throw an error when product is out of stock', async function () {
            const mockProductFacade = {
                checkStock: jest.fn(({productId}: { productId: string }) =>
                    Promise.resolve({
                        productId,
                        stock: productId === '1' ? 0 : 1
                    })
                )
            }
            // @ts-ignore
            placeOrderUseCase['_productFacade'] = mockProductFacade;
            let input: PlaceOrderInputDto = {
                clientId: '0',
                products: [{productId: '1'}]
            }

            await expect(placeOrderUseCase['validateProducts'](input)).rejects.toThrow(new Error("Product 1 is not available in stock"))

            input = {
                clientId: '0',
                products: [{productId: '0'}, {productId: '1'}]
            }

            await expect(placeOrderUseCase['validateProducts'](input)).rejects.toThrow(new Error("Product 1 is not available in stock"))
            expect(mockProductFacade.checkStock).toHaveBeenCalledTimes(3)

            input = {
                clientId: '0',
                products: [{productId: '0'}, {productId: '1'}, {productId: '2'}]
            }

            await expect(placeOrderUseCase['validateProducts'](input)).rejects.toThrow(new Error("Product 1 is not available in stock"))
            expect(mockProductFacade.checkStock).toHaveBeenCalledTimes(5)

        });
    });

    describe('getProducts method', function () {
        beforeAll(() => {
            jest.useFakeTimers('modern')
            jest.setSystemTime(mockDate);
        })

        afterAll(() => {
            jest.useRealTimers();
        })

        // @ts-ignore
        const placeOrderUseCase = new PlaceOrderUsecase()

        it('should throw an error when product not found', async function () {
            const mockCatalogFacade = {
                find: jest.fn().mockResolvedValue(null),
            }

            // @ts-ignore
            placeOrderUseCase['_catalogFacade'] = mockCatalogFacade;

            await expect(placeOrderUseCase['getProduct']('0')).rejects.toThrow(
                new Error('Product not found')
            )
        });

        it('should return a product', async function () {
            const mockCatalogFacade = {
                find: jest.fn().mockResolvedValue({
                    id: '0',
                    name: 'Product 0',
                    description: "Product 0 description",
                    salesPrice: 0,
                }),
            }

            // @ts-ignore
            placeOrderUseCase['_catalogFacade'] = mockCatalogFacade;
            await expect(placeOrderUseCase['getProduct']('0')).resolves.toEqual(
                new Product({
                    id: new Id('0'),
                    name: "Product 0",
                    description: "Product 0 description",
                    salesPrice: 0,
                })
            )
            expect(mockCatalogFacade.find).toHaveBeenCalledTimes(1)
        });
    });

    describe('execute method', function () {
        beforeAll(() => {
            jest.useFakeTimers('modern')
            jest.setSystemTime(mockDate);
        })

        afterAll(() => {
            jest.useRealTimers();
        })

        it('should throw an error when clent not found', async function () {
            const mockClientFacade = {
                find: jest.fn().mockResolvedValue(null),
            }
            // @ts-ignore
            const placeOrderUseCase = new PlaceOrderUsecase()
            // @ts-ignore
            placeOrderUseCase['_clientFacade'] = mockClientFacade;

            const input: PlaceOrderInputDto = {
                clientId: '0',
                products: [],
            }

            await expect(placeOrderUseCase.execute(input)).rejects.toThrow(
                new Error('Client not found')
            )

        });

        it('should throw an error when products are not valid', async function () {
            const mockClientFacade = {
                find: jest.fn().mockResolvedValue(true),
            }
            // @ts-ignore
            const placeOrderUseCase = new PlaceOrderUsecase()

            const mockValidateProducts = jest
                // @ts-ignore
                .spyOn(placeOrderUseCase, 'validateProducts')
                // @ts-ignore
                .mockRejectedValue(new Error("No products selected"))

            // @ts-ignore
            placeOrderUseCase['_clientFacade'] = mockClientFacade;

            const input: PlaceOrderInputDto = {
                clientId: '1',
                products: [],
            }

            await expect(placeOrderUseCase.execute(input)).rejects.toThrow(
                new Error('No products selected')
            )
            expect(mockValidateProducts).toHaveBeenCalledTimes(1)
        });

        describe('Place an order', function () {
            const clientProps = {
                id: '1c',
                name: 'Client 0',
                document: '0000',
                email: 'client@user.com',
                street: 'some address',
                number: '1',
                complement: '',
                city: 'some city',
                state: 'some state',
                zipCode: '000'
            }

            const mockClientFacade = {
                find: jest.fn().mockResolvedValue(clientProps),
            }

            const mockPaymentFacade = {
                process: jest.fn(),
            }

            const mockCheckoutRepository = {
                addOrder: jest.fn(),
            }

            const mockInvoiceFacade = {
                generate: jest.fn().mockResolvedValue({id: '1i'})
            }

            const placeOrderUseCase = new PlaceOrderUsecase(
                mockClientFacade as any,
                null,
                null,
                mockCheckoutRepository as any,
                mockInvoiceFacade as any,
                mockPaymentFacade,
            )

            const products = {
                '1': new Product({
                    id: new Id('1'),
                    name: 'Product 1',
                    description: 'some description',
                    salesPrice: 40
                }),
                '2': new Product({
                    id: new Id('2'),
                    name: 'Product 2',
                    description: 'some description',
                    salesPrice: 30
                }),
            }

            const mockValidateProducts = jest
                // @ts-ignore
                .spyOn(placeOrderUseCase, 'validateProducts')
                // @ts-ignore
                .mockResolvedValue(null)

            const mockGetProduct = jest
                // @ts-expect-error - spy on private method
                .spyOn(placeOrderUseCase, 'getProduct')
                // @ts-expect-error - not return never
                .mockImplementation((productId: keyof typeof products) => {
                    return productId[productId]
                });

            it('should not be approved', async function () {
                mockPaymentFacade.process = mockPaymentFacade.process.mockReturnValue({
                    transactionId: '1t',
                    orderId: '1o',
                    amount: 100,
                    status: 'error',
                    createdAt: new Date(),
                    updatedAt: new Date(),
                });

                const input: PlaceOrderInputDto = {
                    clientId: '1c',
                    products: [{productId: '1'}, {productId: '2'}]
                }

                let output = await placeOrderUseCase.execute(input);

                expect(output.invoiceId).toBeNull();
                expect(output.total).toBe(70);
                expect(output.products).toStrictEqual([
                    {
                        productId: '1',
                    },
                    {
                        productId: '2',
                    },
                ])
                expect(mockClientFacade.find).toHaveBeenCalledTimes(1)
                expect(mockClientFacade.find).toHaveBeenCalledWith({id: '1c'})
                expect(mockValidateProducts).toHaveBeenCalledTimes(1)
                expect(mockValidateProducts).toHaveBeenCalledWith(input)
                expect(mockGetProduct).toHaveBeenCalledTimes(2)
                expect(mockCheckoutRepository.addOrder).toHaveBeenCalledTimes(1)
                expect(mockPaymentFacade.process).toHaveBeenCalledTimes(1)
                expect(mockPaymentFacade.process).toHaveBeenLastCalledWith({
                    orderId: output.id,
                    amount: output.total
                })

                expect(mockInvoiceFacade.generate).toHaveBeenCalledTimes(0)
            });

            it('should be approved', async function () {
                mockPaymentFacade.process = mockPaymentFacade.process.mockReturnValue({
                    transactionId: '1t',
                    orderId: '1o',
                    amount: 100,
                    status: 'approved',
                    createdAt: new Date(),
                    updatedAt: new Date(),
                })

                const input: PlaceOrderInputDto = {
                    clientId: '1c',
                    products: [
                        {productId: '1'},
                        {productId: '2'}
                    ]
                }

                let output = await placeOrderUseCase.execute(input)

                expect(output.invoiceId).toBe('1i')
                expect(output.total).toBe(70)
                expect(output.products).toStrictEqual([
                    { productId: '1'},
                    { productId: '2'},
                ])
            });
        })
    });
});
