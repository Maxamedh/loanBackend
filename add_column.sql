-- Manual SQL to add profile_image column
-- Run this in your MySQL client or phpMyAdmin

USE loan_management;

ALTER TABLE Users ADD COLUMN profile_image LONGTEXT NULL;

-- Verify the column was added
DESCRIBE Users;
