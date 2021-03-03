exports.handler = function (event, context, callback) {
    // AWS used the Authorization header for signing requests, so we need a different header for tokens
    let token = event.headers.Auth;

    // TODO: actually validate the token
    if (!token) {
        callback("Unauthorized");
        return;
    }

    const policy = {
        principalId: "userId",
        policyDocument: {
            Version: "2012-10-17",
            Statement: [
                {
                    Action: "execute-api:Invoke",
                    Effect: "Allow",
                    Resource: "*"
                }
            ]
        }
    }

    callback(null, policy);
};