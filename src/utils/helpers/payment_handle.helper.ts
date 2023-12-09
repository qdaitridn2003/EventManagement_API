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

export const discountPaymentHelper = (totalPayment: number, discount?: number) => {
    if (discount) {
        return totalPayment - totalPayment * (discount / 100);
    }
    return totalPayment;
};
