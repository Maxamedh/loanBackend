const { Loan, Customer, Product, Repayment, LoanProduct } = require('../models');
const { Op } = require('sequelize');

exports.applyLoan = async (req, res) => {
    const { customer_id, product_ids, amount, duration_months, interest_rate, description } = req.body;

    try {
        const loan = await Loan.create({
            customer_id,
            amount,
            duration_months,
            interest_rate: interest_rate || 5.0,
            description,
            status: 'pending',
        });

        if (product_ids && product_ids.length > 0) {
            await loan.addProducts(product_ids);
        }

        res.json(loan);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

exports.getLoansByCustomer = async (req, res) => {
    try {
        const loans = await Loan.findAll({
            where: { customer_id: req.params.customerId },
            include: [
                { model: Product },
                { model: Repayment }
            ]
        });
        res.json(loans);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

exports.getAllLoans = async (req, res) => {
    try {
        const loans = await Loan.findAll({
            include: [
                { model: Customer },
                { model: Product }
            ]
        });
        res.json(loans);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

exports.updateLoan = async (req, res) => {
    try {
        const loan = await Loan.findByPk(req.params.id);
        if (!loan) return res.status(404).json({ message: 'Loan not found' });

        await loan.update(req.body);
        res.json(loan);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

exports.repayLoan = async (req, res) => {
    const { amount, notes } = req.body;
    const loanId = req.params.id;

    try {
        const loan = await Loan.findByPk(loanId);
        if (!loan) {
            return res.status(404).json({ message: 'Loan not found' });
        }

        // Record Repayment
        await Repayment.create({
            loan_id: loanId,
            amount,
            notes,
            status: 'completed'
        });

        // Update Loan Totals
        const newTotalRepaid = parseFloat(loan.total_repaid) + parseFloat(amount);
        let newStatus = loan.status;

        if (newTotalRepaid >= parseFloat(loan.amount)) {
            newStatus = 'paid';
        } else if (newTotalRepaid > 0) {
            newStatus = 'partial';
        }

        loan.total_repaid = newTotalRepaid;
        loan.status = newStatus;
        await loan.save();

        res.json({ loan, message: 'Repayment recorded' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

exports.updateLoanStatus = async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;

    try {
        let loan = await Loan.findByPk(id);
        if (!loan) {
            return res.status(404).json({ message: 'Loan not found' });
        }

        loan.status = status;
        if (status === 'approved') {
            loan.approved_date = new Date();
        }
        await loan.save();

        res.json(loan);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

// NEW: Dashboard Stats
exports.getDashboardStats = async (req, res) => {
    try {
        const totalCustomers = await Customer.count();
        const loans = await Loan.findAll();

        const totalLoansAmount = loans.reduce((sum, loan) => sum + parseFloat(loan.amount), 0);
        const totalRepaid = loans.reduce((sum, loan) => sum + parseFloat(loan.total_repaid), 0);
        const totalRemaining = totalLoansAmount - totalRepaid;

        res.json({
            totalCustomers,
            totalLoansAmount,
            totalRepaid,
            totalRemaining
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

// NEW: Advanced Report
exports.getReport = async (req, res) => {
    const { startDate, endDate, customerId } = req.query;

    let whereClause = {};

    // Date Filter (using applied_date)
    if (startDate && endDate) {
        whereClause.applied_date = {
            [Op.between]: [new Date(startDate), new Date(endDate)]
        };
    } else if (startDate) {
        whereClause.applied_date = {
            [Op.gte]: new Date(startDate)
        };
    }

    // Customer Filter
    if (customerId) {
        whereClause.customer_id = customerId;
    }

    try {
        const loans = await Loan.findAll({
            where: whereClause,
            include: [
                { model: Customer },
                { model: Product },
                { model: Repayment } // Include repayments to calculate paid amount per loan if needed
            ],
            order: [['applied_date', 'DESC']]
        });

        res.json(loans);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};
