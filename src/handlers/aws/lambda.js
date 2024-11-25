const lambdaHandler = require('../../utils/lambda');

exports.invoke = async (event = {}) => {
    try {
        const { name, payload } = event.body || {};
        const resp = await lambdaHandler.invoke(name, payload);
        return resp.Response;
    } catch (err) {
        throw err;
    }
};