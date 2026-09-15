import { DataTypes, Model, InferAttributes, InferCreationAttributes, CreationOptional } from 'sequelize';

import { sequelize } from '../db/sequelize';

export class LoanModel extends Model<InferAttributes<LoanModel>, InferCreationAttributes<LoanModel>> {
    declare id: CreationOptional<number>;
    declare copyId: number;
    declare userId: number;
    declare due: Date;
}

LoanModel.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        copyId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            field: 'copy_id',
        },
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            field: 'user_id',
        },
        due: {
            type: DataTypes.DATEONLY,
            allowNull: false,
        },
    },
    {
        sequelize,
        modelName: 'Loan',
        tableName: 'Loan',
        timestamps: false,
    },
);
