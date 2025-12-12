const sequelize = require('./config/db');
const { User, Customer, Product, Loan } = require('./models');
const bcrypt = require('bcryptjs');

const seedDatabase = async () => {
    try {
        await sequelize.authenticate();
        console.log('Database connected.');

        // Force sync to recreate tables
        await sequelize.sync({ force: true });
        console.log('Database synced (tables recreated).');

        // Create IT User
        const salt1 = await bcrypt.genSalt(10);
        const itPassword = await bcrypt.hash('it123', salt1);

        await User.create({
            name: 'IT Admin',
            email: 'it@example.com',
            password_hash: itPassword,
            phone: '0611111111',
            role: 'IT',
            is_active: true,
        });
        console.log('IT user created: it@example.com / it123');

        // Create Agent User
        const salt2 = await bcrypt.genSalt(10);
        const agentPassword = await bcrypt.hash('agent123', salt2);

        await User.create({
            name: 'Agent User',
            email: 'agent@example.com',
            password_hash: agentPassword,
            phone: '1234567890',
            role: 'admin', // Using admin role for agent capabilities
            is_active: true,
        });
        console.log('Agent user created: agent@example.com / agent123');

        // Create Customers
        const customer1 = await Customer.create({
            name: 'John Doe',
            phone: '555-0101',
            address: '123 Main St, Cityville',
        });
        const customer2 = await Customer.create({
            name: 'Jane Smith',
            phone: '555-0102',
            address: '456 Oak Ave, Townburg',
        });
        console.log('Customers created.');

        // Create Products
        const product1 = await Product.create({
            name: 'Personal Loan',
            description: 'Unsecured personal loan for general use.',
        });
        const product2 = await Product.create({
            name: 'Business Loan',
            description: 'Loan for small business expansion.',
        });
        const product3 = await Product.create({
            name: 'Education Loan',
            description: 'Loan for tuition and school expenses.',
        });
        console.log('Products created.');

        // Create a Loan for Customer 1
        const loan = await Loan.create({
            customer_id: customer1.id,
            amount: 1000.00,
            duration_months: 6,
            description: 'Loan for home renovation',
            status: 'pending',
        });
        await loan.addProducts([product1]);
        console.log('Sample loan created.');

        process.exit();
    } catch (error) {
        console.error('Error seeding database:', error);
        process.exit(1);
    }
};

seedDatabase();
