import { BookModel } from './bookModel';
import { CopyModel } from './copyModel';
import { LoanModel } from './loanModel';
import { PersonModel } from './personModel';

BookModel.hasMany(CopyModel, { foreignKey: 'bookIsbn' });
CopyModel.belongsTo(BookModel, { foreignKey: 'bookIsbn' });

CopyModel.hasMany(LoanModel, { foreignKey: 'copyId' });
LoanModel.belongsTo(CopyModel, { foreignKey: 'copyId' });

PersonModel.hasMany(LoanModel, { foreignKey: 'userId' });
LoanModel.belongsTo(PersonModel, { foreignKey: 'userId' });
