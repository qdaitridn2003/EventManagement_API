import { ContractSchemaType, EventSchemaType, PaymentSchemaType } from '../../types';

type PaymentType = 'initial' | 'remaining' | 'total';

export const paymentHelper = (type: PaymentType, contract: ContractSchemaType) => {
    let result = 0;
    if (type === 'initial') {
        for (const event of contract.events as EventSchemaType[]) {
            result += (event.payment as PaymentSchemaType).initialPayment;
        }
    } else if (type === 'remaining') {
        for (const event of contract.events as EventSchemaType[]) {
            result += (event.payment as PaymentSchemaType).remainingPayment;
        }
    } else if (type === 'total') {
        for (const event of contract.events as EventSchemaType[]) {
            result += (event.payment as PaymentSchemaType).totalPayment;
        }
    }
    return result;
};

export const remainingPaymentHelper = (totalPayment: number, initialPayment: number, discount?: number) => {
    const discountPayment = totalPayment * (discount ? discount / 100 : 0);
    console.log('Discount', discountPayment);
    const remainingPayment = totalPayment - discountPayment - initialPayment;
    return remainingPayment;
};
