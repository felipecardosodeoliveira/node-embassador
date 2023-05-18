import { Request, Response } from "express";

import { AppDataSource } from "..";

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