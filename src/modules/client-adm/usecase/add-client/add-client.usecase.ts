import ClientGateway from "../../gateway/client.gateway";
import {AddClientUsecaseInputDto, AddClientUsecaseOutputDto} from "./add-client.usecase.dto";
import Client from "../../domain/client.entity";
import Id from "../../../@shared/domain/value-object/id.value-object";

export default class AddClientUsecase {
    constructor(private readonly _clientRepository: ClientGateway) {
    }

    async execute(input: AddClientUsecaseInputDto): Promise<AddClientUsecaseOutputDto> {
        const props = {
            id: new Id(input.id) || new Id(),
            name: input.name,
            email: input.email,
            address: input.address
        }

        const client = new Client(props);
        await this._clientRepository.add(client);

        return {
            id: client.id.id,
            name: client.name,
            email: client.email,
            address: client.address,
            createdAt: client.createdAt,
            updatedAt: client.updatedAt,
        };
    }
}
