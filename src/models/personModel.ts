import { DataTypes, Model, InferAttributes, InferCreationAttributes, CreationOptional } from 'sequelize';

import { sequelize } from '../db/sequelize';

export class PersonModel extends Model<InferAttributes<PersonModel>, InferCreationAttributes<PersonModel>> {
    declare id: CreationOptional<number>;
    declare name: string;
    declare password: string;
}

PersonModel.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        name: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
        password: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
    },
    {
        sequelize,
        modelName: 'Person',
        tableName: 'Person',
        timestamps: false,
    },
);
