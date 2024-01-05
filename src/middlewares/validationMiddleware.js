const {body} = require('express-validator');

const validateLoginForm = [
    body('email')
    .notEmpty().withMessage('Debes completar el campo de email').bail()
    .isEmail().withMessage('Debes colocar un email valido'),
    body('password')
    .notEmpty().withMessage('Debes completar el campo de contraseña')
];

module.exports = validateLoginForm;