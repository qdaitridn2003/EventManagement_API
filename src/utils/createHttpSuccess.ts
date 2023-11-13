const createHttpSuccess = (statusCode?: number, data?: object | object[] | null, message?: string) => {
    return {
        data: data ?? {},
        statusCode: statusCode ?? 200,
        message: message ?? 'You have successfully',
    };
};

export default createHttpSuccess;
