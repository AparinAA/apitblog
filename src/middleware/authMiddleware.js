import jwt from 'jsonwebtoken';
import { UnauthorizationError } from '../module/error.js';
import { allPass, complement, compose, curry, isNil, prop, startsWith, slice, partial, ifElse, applySpec, partialRight, tap } from 'ramda';

//get token from headers
const getHeaders = prop('headers');
const getAuthrization = prop('authorization');
const getAuthHeader = compose(getAuthrization, getHeaders); // main get header

//is correct token
const isAuthHeader = complement(isNil);
const startsWithBearer = curry(startsWith)('Bearer ');
const checkAuthHeader = allPass([isAuthHeader, startsWithBearer]);
const getAccessToken = partial(slice, [7, Infinity]);
const getAndCheckAuthHeader = compose(checkAuthHeader, getAuthHeader); //main check

//to decode token
const partialJwtVerify = partialRight(jwt.verify, [process.env.SECRET_PRIVATE_KEY]);
const jwtVerify = compose(partialJwtVerify, getAccessToken);

//user data generation
const makeUserData = applySpec({
    uid: compose(prop('id'), jwtVerify)
});
const getTokenAndMakeUserDate = compose(makeUserData, getAuthHeader); //main make

//if else check correct token
const ifElseCheck = ifElse(
    getAndCheckAuthHeader,
    getTokenAndMakeUserDate,
    tap(() => { throw new UnauthorizationError('User is not authorization') })
)

// middleware to check authorization
export default function (req, res, next) {
    try {
        req.user = ifElseCheck(req);
        next();
    } catch (err) {
        next(err);
    }
}