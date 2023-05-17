import express from 'express';
import cors from 'cors';
import { DataSource } from 'typeorm';
import { routes } from './routes';
import dotenv from "dotenv";
import cookieParser from 'cookie-parser';

dotenv.config();

export const AppDataSource = new DataSource({
    "type": "mysql",
    "host": "db",
    "port": 3306,
    "username": "root",
    "password": "root",
    "database": "embassador",
    "synchronize": true,
    "logging": false,
    "entities": [
        "src/entity/*.ts"
    ]
});

AppDataSource
    .initialize()
    .then(() => {
        const app = express();

        app.use(cookieParser());
        app.use(express.json());
        app.use(cors({
            credentials: true,
            origin: [
                'http://localhost:3000',
            ]
        }));

        routes(app);

        app.listen(3001, () => {
            console.log('listening to 3000')
        })

    })
    .catch((error) => console.log(error))
























