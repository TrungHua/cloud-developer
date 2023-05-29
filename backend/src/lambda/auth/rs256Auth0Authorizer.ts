import 'source-map-support/register';
import { CustomAuthorizerEvent, CustomAuthorizerResult } from 'aws-lambda';
import { verify } from 'jsonwebtoken';
import JwtPayload from '../../auth/JwtPayload';

const cert = `-----BEGIN CERTIFICATE-----
MIIDHTCCAgWgAwIBAgIJKUD020LbTR6mMA0GCSqGSIb3DQEBCwUAMCwxKjAoBgNV
BAMTIWRldi0xNTRwZnFxcDJhbm5lN2oyLnVzLmF1dGgwLmNvbTAeFw0yMzA1MjUw
NzEzMDFaFw0zNzAxMzEwNzEzMDFaMCwxKjAoBgNVBAMTIWRldi0xNTRwZnFxcDJh
bm5lN2oyLnVzLmF1dGgwLmNvbTCCASIwDQYJKoZIhvcNAQEBBQADggEPADCCAQoC
ggEBAK5ufwHaYY9j5PYJZFfSBhj6c84Wc45P2NptFCPGHMKawj7Gsx4kXUUEoX4C
Gu2yl/dFcRn9M81DZn2uBYpj3dG//maxbL4GFfVcHXVQWEEIF8FAaJ1b8GHxw4jz
GbVf0eLHoGoMajkCowe1DPWfAth8NBg3q8TouTzQVlAJzUhDmQ2knr3aIBnrdRyA
hG8W3dISZ+vMt5Hc3DgwVyAE9vgtTfczVoY4J1FYNqhJWIPOCruK390i2ZFXSaGA
o1oWfpE7/iBjp4HfEVM/DU/LBYVaYSplMaHe+eu1Rgq6MCk/rY8IhTvrJiwguIKw
0zskkDJs9EUdYuD6eg/PZQZeiJMCAwEAAaNCMEAwDwYDVR0TAQH/BAUwAwEB/zAd
BgNVHQ4EFgQU/NJenAOEvWHrk6gcV3DIrPn2paswDgYDVR0PAQH/BAQDAgKEMA0G
CSqGSIb3DQEBCwUAA4IBAQBPqUP1GxSZrrInvYL0/2/HEWzOeUyLG0tgwVL+G8rN
bwcMqZkMzgWP7ex7oabohzF22Cwilk8jNuzBUDGxoJv4sMOCWFSbIu/fdnJ1oc3j
84y/KAHttPnICEQf7SyJyY0nagunOVjoJkyq6yOG16/jeMp+e7qM9EWdCB+6etmz
IDVBFPexYU93XC64sRBjuuMBJpXdGBxb9HRJY7U4jxp0kKNi0Mqrr4lTu8xMQF/Q
QLLXwF9bc4tFr6fZG19LY8OLrzUuwNNTYz+6Jj3vjVhmuP7GNBoQf+blMLAQbUz0
YcXWbxxzpx4dS3gwW3Yv0ifiqhkLiSaOrPS7yLUUo106
-----END CERTIFICATE-----`;

export const handler = async (
    event: CustomAuthorizerEvent
): Promise<CustomAuthorizerResult> => {
    try {
        const jwtToken = verifyToken(event.authorizationToken);
        console.log('Authorized!!!', jwtToken);

        return {
            principalId: jwtToken.sub,
            policyDocument: {
                Version: '2012-10-17',
                Statement: [
                    {
                        Action: 'execute-api:Invoke',
                        Effect: 'Allow',
                        Resource: '*',
                    },
                ],
            },
        };
    } catch (e) {
        console.log('Not authorized: ', e.message);

        return {
            principalId: 'user',
            policyDocument: {
                Version: '2012-10-17',
                Statement: [
                    {
                        Action: 'execute-api:Invoke',
                        Effect: 'Deny',
                        Resource: '*',
                    },
                ],
            },
        };
    }
};

const verifyToken = (authHeader: string): JwtPayload => {
    if (!authHeader) throw new Error('No authentication header');

    if (!authHeader.toLowerCase().startsWith('bearer '))
        throw new Error('Invalid authentication header');

    const split = authHeader.split(' ');
    const token = split[1];

    return verify(token, cert, { algorithms: ['RS256'] }) as JwtPayload;
};
