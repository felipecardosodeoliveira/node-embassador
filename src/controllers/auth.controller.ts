import { Request, Response } from "express";

import bcryptjs from "bcryptjs";

import { AppDataSource } from "..";

import { User } from "../entity/user.entity";

import { sign, verify } from "jsonwebtoken";
import { Order } from "../entity/order.entity";

export const Register = async (req: Request, res: Response) => {
    const body = req.body;

    if (!body.password) {
        return res.status(400)
            .send({
                message: "Password's do not value"
            })
    }

    body.password = bcryptjs.hashSync(body.password, 10);

    const user = await AppDataSource
        .getRepository(User)
        .save({
            ...body,
            is_embassador: req.path === '/api/ambassador/register'
        });

    delete user.password;

    return res.send(user);
}

export const Loggin = async (req: Request, res: Response) => {

    const user = await AppDataSource
        .getRepository(User)
        .createQueryBuilder("user")
        .where("user.email = :email", { email: req.body.email })
        .addSelect("user.password")
        .getOne();

    if (!user) {
        return res.status(400).send({
            message: "Invalid credentials"
        })
    }

    if (!await bcryptjs.compare(req.body.password, user.password)) {
        return res.status(400).send({
            message: "invalid credentials"
        });
    }

    const adminLogin = req.path === '/api/admin/login';

    if (user.is_embassador && adminLogin) {
        return res.status(401).send({
            message: 'unauthorized'
        });
    }

    const token = sign({
        id: user.id,
        scope: adminLogin ? "admin" : "ambassador"
    }, process.env.SECRET_KEY);

    res.cookie("jwt", token, {
        expires: new Date(
            Date.now() + 24 * 60 * 60 * 1000
        ),
        httpOnly: true,
    });

    res.send({
        message: "success"
    });
}

export const AuthenticatedUser = async (req: Request, res: Response) => {
    const user = req['user'];

    if (req.path === '/api/admin/user') {
        return res.send(user);
    }

    const orders = await AppDataSource
        .getRepository(Order)
        .createQueryBuilder("orders")
        .where("order.user_id = :id AND order.completed = :completed", {
            id: user.id,
            completed: true
        })
        .loadAllRelationIds({
            relations: ['order_items']
        }).getMany();

    user.revenue = orders.reduce((s: number, o: Order) => s + o.ambassador_revenue, 0);

    res.send(user);
}

export const Logout = async (req: Request, res: Response) => {
    res.cookie("jwt", {
        expires: new Date(
            Date.now()
        ),
    });

    return res.send({
        message: "success"
    });
}

export const UpdateInfo = async (req: Request, res: Response) => {
    const user = req["user"];

    await AppDataSource
        .createQueryBuilder()
        .update(User)
        .set({ ...req.body })
        .where("user.id = :id", { id: user.id })
        .execute();

    return res.send({ message: "success" });
}

export const UpdatePassword = async (req: Request, res: Response) => {
    const user = req["user"];

    await AppDataSource
        .createQueryBuilder()
        .update(User)
        .set({
            password: bcryptjs.hashSync(req.body.password, 10)
        })
        .where("user.id = :id", { id: user.id })
        .execute();

    return res.send({ message: "password update with success" });
}