"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.timestampHelper = void 0;
const timestampHelper = (date) => {
    const startTimestampOfDateParameter = date.toISOString().slice(0, 10);
    const endTimestampOfDateParameter = new Date(date.getTime() + 24 * 60 * 60 * 1000);
    return { dateStart: startTimestampOfDateParameter, dateEnd: endTimestampOfDateParameter };
};
exports.timestampHelper = timestampHelper;
