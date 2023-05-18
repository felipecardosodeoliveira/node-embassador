import {
    AutenticatedUser,
    Loggin,
    Logout,
    Register,
    UpdateInfo,
    UpdatePassword
} from "./controllers/auth.controller";

import { CreateLink, Links } from "./controllers/link.controller";

import {
    CreateProduct,
    DeleteProduct,
    GetProduct,
    Products,
    UpdateProduct
} from "./controllers/product.controller";

import { Embassador } from "./controllers/user.controller";

import { AuthMiddleware } from "./middlewares/auth";

export const routes = (app) => {
    app.post('/api/admin/resgister', Register);
    app.post('/api/admin/loggin', Loggin);
    app.get('/api/admin/user', AuthMiddleware, AutenticatedUser);
    app.post('/api/admin/logout', AuthMiddleware, Logout);
    app.put('/api/admin/user/register', AuthMiddleware, UpdateInfo);
    app.put('/api/admin/user/update-password', AuthMiddleware, UpdatePassword);

    app.get('/api/admin/embassadors', AuthMiddleware, Embassador);
    app.get('/api/admin/products', AuthMiddleware, Products);
    app.post('/api/admin/products/create', AuthMiddleware, CreateProduct);
    app.get('/api/admin/products/show/:id', AuthMiddleware, GetProduct);
    app.put('/api/admin/products/update/:id', AuthMiddleware, UpdateProduct);
    app.delete('/api/admin/products/delete/:id', AuthMiddleware, DeleteProduct);

    app.get('/api/admin/users/:id/links', AuthMiddleware, Links);
    app.post('/api/admin/links', AuthMiddleware, CreateLink);

}

