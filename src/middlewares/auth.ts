import { Request, Response } from "express";

import { sign, verify } from "jsonwebtoken";

import { User } from "../entity/user.entity";

import { AppDataSource } from "..";

export const AuthMiddleware = async (req: Request, res: Response, next: Function) => {
    try {
        const jwt = req.cookies["jwt"];

        const payload: any = verify(jwt, process.env.SECRET_KEY);

        if (!payload) {
            return res.status(401).send({
                message: 'unautenticated'
            });
        }

        const user = await AppDataSource
            .getRepository(User)
            .createQueryBuilder("user")
            .where("user.id = :id", { id: payload.id })
            .getOne();

        req["user"] = user;
        next();
    } catch (error) {
        return res.status(401).send({
            message: 'unautenticated'
        });
    }
}