import jwt from 'jsonwebtoken';
import { UnauthorizationError } from '../module/error.js';

// middleware to check authorization
export default function (req, res, next) {
    try {
        const authHeader = req.headers.authorization;
        if (authHeader && authHeader.startsWith('Bearer ')) {
            const accessToken = authHeader.slice(7, authHeader.length);

            const decodeToken = jwt.verify(accessToken, process.env.SECRET_PRIVATE_KEY);
            req.user = { uid: decodeToken.id };

            next();
        } else {
            throw new UnauthorizationError('User is not authorization');
        }
    } catch (err) {
        next(err);
    }
}