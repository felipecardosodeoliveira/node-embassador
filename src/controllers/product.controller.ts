import { Request, Response } from "express";

import { AppDataSource } from "..";

import { Product } from "../entity/product.entity";

export const Products = async (req: Request, res: Response) => {
    const products = await AppDataSource
        .getRepository(Product)
        .createQueryBuilder("products")
        .getMany();

    res.send(products);
}

export const CreateProduct = async (req: Request, res: Response) => {
    const product = await AppDataSource
        .getRepository(Product)
        .save(req.body);

    return res.send(product);
}

export const GetProduct = async (req: Request, res: Response) => {
    const product = await AppDataSource
        .createQueryBuilder()
        .select("product")
        .from(Product, "product")
        .where("product.id = :id", { id: req.params.id })
        .getOne();

    return res.send(product);
}

export const UpdateProduct = async (req: Request, res: Response) => {
    await AppDataSource
        .createQueryBuilder()
        .update(Product)
        .set({ ...req.body })
        .where("product.id = :id", { id: req.params.id })
        .execute();

    return res.send({
        message: "Success"
    });
}

export const DeleteProduct = async (req: Request, res: Response) => {
    await AppDataSource
        .createQueryBuilder()
        .delete()
        .from(Product)
        .where("id = :id", { id: req.params.id })
        .execute()

    return res.send({
        message: "Success"
    });
}