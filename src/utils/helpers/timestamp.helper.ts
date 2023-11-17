export const timestampHelper = (date: Date) => {
    const startTimestampOfDateParameter = date.toISOString().slice(0, 10);
    const endTimestampOfDateParameter = new Date(date.getTime() + 24 * 60 * 60 * 1000);
    return { dateStart: startTimestampOfDateParameter, dateEnd: endTimestampOfDateParameter };
};
