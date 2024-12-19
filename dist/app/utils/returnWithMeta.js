"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.returnWithMeta = void 0;
const returnWithMeta = (metaData, data) => {
    return {
        meta: {
            total: metaData.total,
            limit: metaData.limit,
            page: metaData.page,
        },
        data,
    };
};
exports.returnWithMeta = returnWithMeta;
