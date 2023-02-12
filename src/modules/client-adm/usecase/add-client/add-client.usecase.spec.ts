import AddClientUsecase from "./add-client.usecase";

const MockRepository = () => {
    return {
        add: jest.fn(),
        find: jest.fn()
    }
}

describe('Add Client Usecase unit test', function () {
    it('should add a client', async function () {
        const repository = MockRepository();
        const usecase = new AddClientUsecase(repository);

        const input = {
            name: 'Client 1',
            email: 'x@x.com',
            address: 'Address 1'
        }

        const result=  await usecase.execute(input)

        expect(repository.add).toHaveBeenCalled();
        expect(result.id).toBeDefined();
        expect(result.name).toEqual(input.name);
        expect(result.email).toEqual(input.email);
        expect(result.address).toEqual(input.address);
    });
});
