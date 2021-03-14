const jwt = require('jsonwebtoken');
const jwksClient = require('jwks-rsa');

const jwksUri = process.env.JWKS_URI;
const audience = process.env.AUDIENCE;
const issuer = process.env.ISSUER;
const algorithms = [process.env.ALGORITHM];
const kid = process.env.KID;

const client = jwksClient({
    jwksUri,
    rateLimit: true
});

exports.handler = async function (event, context, callback) {
    // AWS uses the Authorization header for signing requests, so we have to use a custom 'Auth' header for tokens
    // Note: Headers are case-insensitive, but HTTP/2 specifies headers should be lowercase
    let accessToken = event.headers.auth?.replace('Bearer ', '');

    if (!accessToken) {
        callback('Unauthorized');
    }

    const signingKey = await (await client.getSigningKeyAsync(kid)).getPublicKey();

    try {
        const token = jwt.verify(accessToken, signingKey, { audience, issuer, algorithms });
        callback(null, createPolicy(token.sub));
    } catch (e) {
        callback('Unauthorized');
    }
};

function createPolicy(userId) {
    return {
        principalId: userId,
        policyDocument: {
            Version: '2012-10-17',
            Statement: [
                {
                    Action: 'execute-api:Invoke',
                    Effect: 'Allow',
                    Resource: '*'
                }
            ]
        },
        context: {
            userId
        }
    };
}
