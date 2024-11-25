const { LambdaClient, InvokeCommand } = require('@aws-sdk/client-lambda');
const lambdaClient = new LambdaClient();

exports.invoke = async (name, payload) => {
    const resp = await lambdaClient.send(new InvokeCommand({
        FunctionName: name,
        Payload: JSON.stringify(payload)
    }));
    return {
        StatusCode: resp.StatusCode,
        ExecutedVersion: resp.ExecutedVersion,
        Response: resp.Payload ? JSON.parse(Buffer.from(resp.Payload).toString()) : undefined
    };
};
