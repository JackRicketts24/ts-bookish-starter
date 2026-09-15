import { DataTypes, Model, InferAttributes, InferCreationAttributes, CreationOptional } from 'sequelize';

import { sequelize } from '../db/sequelize';

export class CopyModel extends Model<InferAttributes<CopyModel>, InferCreationAttributes<CopyModel>> {
    declare id: CreationOptional<number>;
    declare bookIsbn: string;
}

CopyModel.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        bookIsbn: {
            type: DataTypes.STRING(13),
            allowNull: false,
            field: 'book_isbn',
        },
    },
    {
        sequelize,
        modelName: 'Copy',
        tableName: 'Copy',
        timestamps: false,
    },
);
