import { db } from '../module/db.js';
import { validationResult } from 'express-validator';
import { checkValidPassword, generateAccessToken, getHashPassword } from '../helpFuncionts.js';
import { BadRequestError } from '../module/error.js';

function Controller() {
    async function singup(req, res, next) {
        try {
            const errors = validationResult(req);

            if (!errors.isEmpty()) {
                throw new BadRequestError(JSON.stringify(errors));
            }
            const { username, password } = req.body;
            const checkUserValid = await db.collection('usersCollection').findOne({ username });

            if (checkUserValid) {
                throw new BadRequestError("User with the same name already exists")
            }

            const hashPassword = getHashPassword(password);
            const userAdd = await db.collection('usersCollection').insertOne({
                username,
                ...hashPassword
            });

            if (userAdd) {
                return res.status(200).json({ message: "User successfully registered" });
            } else {
                throw new BadRequestError("Something went wrong")
            }
        } catch (err) {
            next(err);
        }
    }

    async function login(req, res, next) {
        try {
            const { username, password } = req.body;
            const user = await db.collection('usersCollection').findOne({ username });
            if (!user) {
                throw BadRequestError("User is not found");
            }

            const isValidPasswrod = checkValidPassword(user, password);
            if (!isValidPasswrod) {
                throw BadRequestError("Password is invalid");
            }

            const accessToken = generateAccessToken(user._id);
            return res.status(200).json({ accessToken });

        } catch (err) {
            next(err);
        }
    }

    async function users(req, res) {
        try {
            const users = await db.collection('usersCollection').find().toArray()
            const clearUsers = users.map(user => user.username);
            res.json(clearUsers);
        } catch (e) {
            console.info("user", e);
            return res.status(400).json({ message: "User error" })
        }
    }

    return {
        singup,
        login,
        users
    }
}

export const authController = Controller();