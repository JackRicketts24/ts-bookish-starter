import { DataTypes, Model, InferAttributes, InferCreationAttributes } from 'sequelize';

import { sequelize } from '../db/sequelize';

export class BookModel extends Model<InferAttributes<BookModel>, InferCreationAttributes<BookModel>> {
    declare isbn: string;
    declare title: string;
    declare authors: string;
}

BookModel.init(
    {
        isbn: {
            type: DataTypes.STRING(13),
            primaryKey: true,
        },
        title: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
        authors: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
    },
    {
        sequelize,
        modelName: 'Book',
        tableName: 'Book',
        timestamps: false,
    },
);
