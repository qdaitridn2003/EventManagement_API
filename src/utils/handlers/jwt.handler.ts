import jwt from 'jsonwebtoken';
import { JwtPayloadType, JwtSignatureType } from '../../types';
import { ApiConfigs } from '../../configs';

const jwtHandler = {
    signToken: (payload: JwtPayloadType, signature: JwtSignatureType) => {
        if (signature === 'access') {
            return new Promise<string>((resolve, reject) => {
                jwt.sign(
                    payload,
                    ApiConfigs.accessTokenKey,
                    {
                        algorithm: 'HS256',
                        expiresIn: '1h',
                    },
                    (error, token) => {
                        if (error) {
                            reject(error);
                        } else {
                            resolve(token as string);
                        }
                    },
                );
            });
        } else if (signature === 'refresh') {
            return new Promise<string>((resolve, reject) => {
                jwt.sign(
                    payload,
                    ApiConfigs.refreshTokenKey,
                    {
                        algorithm: 'HS256',
                    },
                    (error, token) => {
                        if (error) {
                            reject(error);
                        } else {
                            resolve(token as string);
                        }
                    },
                );
            });
        } else {
            throw new Error('Invalid signature');
        }
    },
    verifyToken: (token: string, signature: JwtSignatureType) => {
        if (signature === 'access') {
            return new Promise<jwt.JwtPayload>((resolve, reject) => {
                jwt.verify(
                    token,
                    ApiConfigs.accessTokenKey,
                    (error, decode) => {
                        if (error) {
                            reject(error);
                        } else {
                            resolve(decode as jwt.JwtPayload);
                        }
                    },
                );
            });
        } else if (signature === 'refresh') {
            return new Promise<jwt.JwtPayload>((resolve, reject) => {
                jwt.verify(
                    token,
                    ApiConfigs.refreshTokenKey,
                    (error, decode) => {
                        if (error) {
                            reject(error);
                        } else {
                            resolve(decode as jwt.JwtPayload);
                        }
                    },
                );
            });
        } else {
            throw new Error('Invalid signature');
        }
    },
    decodeToken: (token: string) => {
        return jwt.decode(token);
    },
};

export default jwtHandler;
