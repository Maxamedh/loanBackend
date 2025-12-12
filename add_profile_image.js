const sequelize = require('./config/db');

async function addProfileImageColumn() {
    try {
        await sequelize.authenticate();
        console.log('Database connected.');

        // Add the profile_image column to Users table
        await sequelize.query(`
      ALTER TABLE Users 
      ADD COLUMN IF NOT EXISTS profile_image LONGTEXT NULL
    `);

        console.log('✅ profile_image column added successfully!');
        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
}

addProfileImageColumn();
