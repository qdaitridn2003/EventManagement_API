export const discountHandleHelper = (discount?: string) => {
    if (discount && discount !== '0%') {
        const amount = parseFloat(discount.split('%')[0]);
        console.log(amount);
        return amount / 100;
    } else {
        return 1;
    }
};
