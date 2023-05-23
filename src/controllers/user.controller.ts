import { Request, Response } from "express";

import { AppDataSource, client } from "..";

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

export const Rankings = async (req: Request, res: Response) => {
    const result: string[] = await client.sendCommand(['ZREVRANGEBYSCORE', 'rankings', '+inf', '-inf', 'WITHSCORES']);
    let name;

    res.send(result.reduce((o, r) => {
        if (isNaN(parseInt(r))) {
            name = r;
            return o;
        } else {
            return {
                ...o,
                [name]: parseInt(r)
            };
        }
    }, {}));
}