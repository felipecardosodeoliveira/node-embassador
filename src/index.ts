import express from 'express';
import cors from 'cors';
import { DataSource } from 'typeorm';
import { routes } from './routes';
import dotenv from "dotenv";
import cookieParser from 'cookie-parser';
import { createClient } from 'redis';

dotenv.config();

export const client = createClient({
    url: 'redis://redis:6379'
});

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
    .then(async () => {

        await client.connect();
        
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
























