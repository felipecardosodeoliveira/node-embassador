import { Request, Response } from "express";

import { AppDataSource } from "..";

import { Order } from "../entity/order.entity";

import { Link } from "../entity/link.entity";

export const Links = async (req: Request, res: Response) => {
    const links = await AppDataSource
        .getRepository(Link)
        .createQueryBuilder("links")
        .where("links.user_id = :id", {
            id: req.params.id
        })
        .getMany();

    return res.send(links);
}

export const CreateLink = async (req: Request, res: Response) => {
    const user = req['user'];

    const link = await AppDataSource.getRepository(Link)
        .save({
            user,
            code: Math.random().toString(36).substring(6),
            products: req.body.products.map(id => ({ id }))
        });

    res.send(link);
}

export const Stats = async (req: Request, res: Response) => {
    const user = req['user'];

    const links = await AppDataSource
        .getRepository(Link)
        .find({
            where: { user },
            relations: ['orders', 'orders.order_items']
        })

    res.send(links.map(link => {
        const orders = link.orders.filter(o => o.complete);

        return {
            code: link.code,
            count: orders.length,
            revenue: orders.reduce((s: number, o: Order) => s + o.ambassador_revenue, 0)
        }
    }));
}

