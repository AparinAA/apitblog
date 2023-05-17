import * as dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import swaggerUi from 'swagger-ui-express';
import swaggerConfig from './swaggerConfig.json' assert { type: 'json' };

import { connetToDB } from './module/db.js';
import authRouter from './routers/authRouter.js';
import apiRouter from './routers/apiRouter.js';
import secureMiddleware from './middleware/secureMiddleware.js';
import errorMiddleware from './middleware/errorMiddleware.js';

const app = express();
secureMiddleware(app);

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use("/auth", authRouter);

app.use('/api', apiRouter);

app.use(errorMiddleware);

app.use('/', swaggerUi.serve, swaggerUi.setup(swaggerConfig));

const port = process.env.PORT;
const host = 'localhost';

connetToDB(() => {
    console.info('Successfully connected t database');
    app.listen(port, host, () => {
        console.info(`Listen port: ${port}`);
    })
});