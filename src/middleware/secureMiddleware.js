import helmet from 'helmet';
import slowDown from 'express-slow-down';
import { rateLimit } from 'express-rate-limit';
import cors from 'cors';
//secure. remove header X-Powered-By, antiDDOS + default helmet security
export default function (app) {

    app.use((req, res, next) => {
        res.removeHeader('X-Powered-By');
        next();
    });

    const corsOptions = {
        origin: "*"
    };

    app.use(cors(corsOptions));

    // app.use(helmet({
    //     contentSecurityPolicy: {
    //         useDefaults: true
    //     }
    // }));

    const limiter = rateLimit({
        windowMs: 1 * 60 * 1000,
        max: 120,
    });

    const speedLimiter = slowDown({
        windowMs: 1 * 60 * 1000,
        delayAfter: 100,
        delayMs: 1000,
    });

    app.use(speedLimiter);
    app.use(limiter);
}