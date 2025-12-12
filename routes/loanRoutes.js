const express = require('express');
const router = express.Router();
const loanController = require('../controllers/loanController');
const authMiddleware = require('../middleware/authMiddleware');

// @route   POST api/loans/apply
// @desc    Apply for a loan (Agent creates loan for customer)
// @access  Private
router.post('/apply', authMiddleware, loanController.applyLoan);

// @route   GET api/loans/customer/:customerId
// @desc    Get loans for a specific customer
// @access  Private
router.get('/customer/:customerId', authMiddleware, loanController.getLoansByCustomer);

// @route   GET api/loans/stats
// @desc    Get Dashboard Stats
// @access  Private
router.get('/stats', authMiddleware, loanController.getDashboardStats);

// @route   GET api/loans/report
// @desc    Get Advanced Report
// @access  Private
router.get('/report', authMiddleware, loanController.getReport);

// @route   GET api/loans/all
// @desc    Get all loans
// @access  Private
router.get('/all', authMiddleware, loanController.getAllLoans);

// @route   PUT api/loans/:id
// @desc    Update loan details
// @access  Private
router.put('/:id', authMiddleware, loanController.updateLoan);

// @route   PUT api/loans/:id/status
// @desc    Update loan status (Approve/Reject)
// @access  Private
router.put('/:id/status', authMiddleware, loanController.updateLoanStatus);

// @route   POST api/loans/:id/repay
// @desc    Record repayment
// @access  Private
router.post('/:id/repay', authMiddleware, loanController.repayLoan);

module.exports = router;
