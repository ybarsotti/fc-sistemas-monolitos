import BaseEntity from "../../@shared/domain/entity/base.entity";
import AgregateRoot from "../../@shared/domain/entity/agregate-root.interface";
import Id from "../../@shared/domain/value-object/id.value-object";

type ProductProps = {
    id: Id;
    name: string;
    description: string;
    salesPrice: number;
}

export default class Product extends BaseEntity implements AgregateRoot {
    private readonly _name: string;
    private readonly _description: string;
    private readonly _salesPrice: number;


    constructor(props: ProductProps) {
        super(props.id);
        this._name = props.name;
        this._description = props.description;
        this._salesPrice = props.salesPrice;
    }


    get name(): string {
        return this._name;
    }

    get description(): string {
        return this._description;
    }

    get salesPrice(): number {
        return this._salesPrice;
    }
}
