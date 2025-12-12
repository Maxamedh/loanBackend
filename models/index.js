const User = require('./User');
const Customer = require('./Customer');
const Product = require('./Product');
const Loan = require('./Loan');
const LoanProduct = require('./LoanProduct');
const Repayment = require('./Repayment');

// Associations
Customer.hasMany(Loan, { foreignKey: 'customer_id' });
Loan.belongsTo(Customer, { foreignKey: 'customer_id' });

Loan.belongsToMany(Product, { through: LoanProduct, foreignKey: 'loan_id' });
Product.belongsToMany(Loan, { through: LoanProduct, foreignKey: 'product_id' });

Loan.hasMany(Repayment, { foreignKey: 'loan_id' });
Repayment.belongsTo(Loan, { foreignKey: 'loan_id' });

module.exports = {
    User,
    Customer,
    Product,
    Loan,
    LoanProduct,
    Repayment,
};
