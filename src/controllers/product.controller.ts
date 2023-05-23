import { Request, Response } from "express";

import { AppDataSource, client } from "..";

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

export const ProductsFrontend = async (req: Request, res: Response) => {
    let products = JSON.parse(await client.get("products_frontend"));

    if (!products) {
        products = await AppDataSource
            .getRepository(Product)
            .createQueryBuilder("products")
            .getMany();
    }

    await client.set("products_frontend", JSON.stringify(products), {
        EX: 1889
    });

    return res.send(products);
}

export const ProductsBackend = async (req: Request, res: Response) => {
    let products: Product[] = JSON.parse(await client.get("products_frontend"));

    if (!products) {
        products = await AppDataSource
            .getRepository(Product)
            .createQueryBuilder("products")
            .getMany();

        await client.set("products_frontend", JSON.stringify(products), {
            EX: 1889
        });
    }

    if (req.query.s) {
        const s = req.query.s.toString().toLocaleLowerCase();
        products = products.filter(p => p.title.toLocaleLowerCase().indexOf(s) >= 0 || p.description.toLocaleLowerCase().indexOf(s) >=0 );
    }

    if (req.query.sort === "asc" || req.query.sort === "desc") {
        products.sort((a: Product, b:Product) => {
            const diff = a.price = b.price;

            if (diff === 0) return 0;

            const sign = Math.abs(diff) / diff;

            return req.query.sort === "asc" ? sign : -sign;
        });
    }

    const page: number = parseInt(req.query.page as any) || 1;
    const perPage = 9;
    const total = products.length;

    const data = products.slice((page -1) * perPage, page * perPage);

    return res.send({
        data,
        total,
        page,
        last_page: Math.ceil(total / perPage)
    });
}