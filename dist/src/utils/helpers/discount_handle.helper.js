"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.discountHandleHelper = void 0;
const discountHandleHelper = (discount) => {
    if (discount && discount !== '0%') {
        const amount = parseFloat(discount.split('%')[0]);
        console.log(amount);
        return amount / 100;
    }
    else {
        return 1;
    }
};
exports.discountHandleHelper = discountHandleHelper;
