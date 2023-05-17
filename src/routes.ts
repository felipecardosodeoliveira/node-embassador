import {
    AutenticatedUser,
    Loggin,
    Logout,
    Register,
    UpdateInfo,
    UpdatePassword
} from "./controllers/auth.controller";
import { AuthMiddleware } from "./middlewares/auth";

export const routes = (app) => {
    app.post('/api/admin/resgister', Register);
    app.post('/api/admin/loggin', Loggin);
    app.get('/api/admin/user', AuthMiddleware, AutenticatedUser);
    app.post('/api/admin/logout', AuthMiddleware, Logout);
    app.put('/api/admin/user/register', AuthMiddleware, UpdateInfo);
    app.put('/api/admin/user/update-password', AuthMiddleware, UpdatePassword);
}

