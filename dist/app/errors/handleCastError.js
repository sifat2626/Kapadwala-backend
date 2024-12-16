"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const handleCastError = (err) => {
    const errorDetails = [
        {
            field: err.path,
            message: err.message,
        },
    ];
    const statusCode = 400;
    return {
        statusCode,
        message: 'Invalid ID',
        errorDetails,
    };
};
exports.default = handleCastError;
