import BaseEntity from "../../@shared/domain/entity/base.entity";
import AgregateRoot from "../../@shared/domain/entity/agregate-root.interface";
import Id from "../../@shared/domain/value-object/id.value-object";

type ProductProps = {
    id?: Id;
    name: string;
    price: number;
}

export default class Product extends BaseEntity implements AgregateRoot {
    private _name: string;
    private _price: number

    constructor(props: ProductProps) {
        super(props.id);
        this._name = props.name;
        this._price = props.price;
    }


    get name(): string {
        return this._name;
    }

    get price(): number {
        return this._price;
    }
}
