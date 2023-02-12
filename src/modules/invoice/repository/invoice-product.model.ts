import {BelongsTo, Column, ForeignKey, Model, PrimaryKey, Table} from "sequelize-typescript";
import {InvoiceModel} from "./invoice.model";

@Table({
    tableName: "invoice-products",
    timestamps: false,
})
export class InvoiceProductModel extends Model {
    @PrimaryKey
    @Column({ allowNull: false })
    id: string;

    @Column({ allowNull: false })
    name: string;

    @Column({ allowNull: false })
    price: number;

    @Column({ allowNull: false })
    @ForeignKey(() => InvoiceModel)
    invoice_id: number;

    @BelongsTo(() => InvoiceModel, {
        foreignKey: 'invoice_id'
    })
    invoice: ReturnType<() => InvoiceModel>;

    @Column({ allowNull: false })
    createdAt: Date;

    @Column({ allowNull: false })
    updatedAt: Date;
}
