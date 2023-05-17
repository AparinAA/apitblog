import * as dotenv from 'dotenv';
dotenv.config();

import crypto from 'crypto';
import jwt from 'jsonwebtoken';

export function checkValidPassword(user, password) {
    return user.hash === crypto.pbkdf2Sync(password ?? '', user?.salt ?? '', 1000, 64, `sha512`).toString(`hex`);
}

export function generateAccessToken(id) {
    const payload = { id };
    return jwt.sign(payload, process.env.SECRET_PRIVATE_KEY, { expiresIn: '6h' });
}

export function getHashPassword(password) {
    const salt = crypto.randomBytes(8).toString('hex');
    const hash = crypto.pbkdf2Sync(password, salt, 1000, 64, `sha512`).toString(`hex`);

    return { salt, hash };
}