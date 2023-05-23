import {
    AuthenticatedUser,
    Loggin,
    Logout,
    Register,
    UpdateInfo,
    UpdatePassword
} from "./controllers/auth.controller";

import { CreateLink, Links, Stats } from "./controllers/link.controller";

import {
    CreateProduct,
    DeleteProduct,
    GetProduct,
    Products,
    ProductsBackend,
    ProductsFrontend,
    UpdateProduct
} from "./controllers/product.controller";

import { Embassador, Rankings } from "./controllers/user.controller";

import { AuthMiddleware } from "./middlewares/auth";

export const routes = (app) => {
    // Admin
    app.post('/api/admin/resgister', Register);
    app.post('/api/admin/loggin', Loggin);
    app.get('/api/admin/user', AuthMiddleware, AuthenticatedUser);
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
    // app.post('/api/admin/links', AuthMiddleware, CreateLink);

    // Ambassador
    app.post('/api/ambassador/resgister', Register);
    app.post('/api/ambassador/login', Loggin);
    app.get('/api/ambassador/user', AuthMiddleware, AuthenticatedUser);
    app.post('/api/ambassador/logout', AuthMiddleware, Logout);
    app.put('/api/ambassador/user/register', AuthMiddleware, UpdateInfo);
    app.put('/api/ambassador/user/update-password', AuthMiddleware, UpdatePassword);

    app.get('/api/ambassador/products/frontend', ProductsFrontend);
    app.get('/api/ambassador/products/backend', ProductsBackend);
    app.post('/api/ambassador/links', AuthMiddleware, CreateLink);
    app.get('/api/ambassador/stats', AuthMiddleware, Stats);
    app.get('/api/ambassador/rankings', AuthMiddleware, Rankings);


}

