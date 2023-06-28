"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPagination = void 0;
const DEFAULT_PAGE_NUM = 1;
const DEFAULT_PAGE_SIZE = 0;
const getPagination = (size, num) => {
    const pageSize = Number(size) || DEFAULT_PAGE_SIZE;
    const pageNum = Number(num) || DEFAULT_PAGE_NUM;
    const pageSkip = (pageNum - 1) * pageSize;
    return {
        pageSkip,
        pageSize,
    };
};
exports.getPagination = getPagination;
