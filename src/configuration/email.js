require('dotenv').config({ path: '.env' });

module.exports = {
    user: process.env.MAILTRAP_USER,
    password: process.env.MAILTRAP_PASSWORD,
    host: 'smtp.mailtrap.io',
    port: '2525'
}