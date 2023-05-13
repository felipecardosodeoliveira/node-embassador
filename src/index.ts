import express from 'express';
import cors from 'cors';
import { DataSource } from 'typeorm';

const AppDataSource = new DataSource({
    "type": "mysql",
    "host": "db",
    "port": 3306,
    "username": "root",
    "password": "root",
    "database": "embassador",
    "synchronize": true,
    "logging": false,
    "entities": [
        "src/entity/**/*.ts"
    ]
});

AppDataSource.initialize()
    .then(() => {
        const app = express();

        app.use(express.json());

        app.use(cors({
            origin: [
                'http://localhost:3000'
            ]
        }));

        app.get('/', (request, response) => {
            response.send('Hello World')
        });

        app.listen(3001, () => {
            console.log('listening to 3000')
        })

    })
    .catch((error) => console.log(error))
























