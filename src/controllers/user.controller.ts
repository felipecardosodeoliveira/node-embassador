import { Request, Response } from "express";

import { AppDataSource } from "..";

import { User } from "../entity/user.entity";

export const Embassador = async (req: Request, res: Response) => {
    const user = await AppDataSource
        .createQueryBuilder()
        .select("user")
        .from(User, "user")
        .where("user.is_embassador = :embassador", { embassador: true })
        .getOne();

    return res.send(user);

}