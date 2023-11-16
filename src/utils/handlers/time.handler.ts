import moment from 'moment';

const timeHandler = {
    checkExpireDate: (date: number) => {
        const parsedDate = moment.unix(date);
        const oneHourAgo = moment().subtract(1, 'hours');
        const result = parsedDate.isAfter(oneHourAgo);
        return result;
    },
};

export default timeHandler;
