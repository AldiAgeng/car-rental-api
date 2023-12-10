import { Router } from "express";

import { ArticlesController } from "../controllers/article.controller";
import { UserController } from "../controllers/user.controller";
import { CarsController } from "../controllers/car.controller";
import { authenticateToken, authenticateTokenAdmin, authenticateTokenSuperAdmin } from "../middlewares/authorization";
import upload from "../utils/upload.on.memory";

export const route = Router();

const articlesController = new ArticlesController();
const userController = new UserController();
const carsController = new CarsController();

// articles
route.get("/articles", authenticateToken, articlesController.list);
route.post("/articles", authenticateToken, upload.single("image"),  articlesController.create);
route.get("/articles/:id", authenticateToken, articlesController.show);
route.patch("/articles/:id", authenticateToken, upload.single("image"), articlesController.update);
route.delete("/articles/:id", authenticateToken, articlesController.delete);

// cars
route.get("/cars", authenticateTokenAdmin, carsController.list);
route.post("/cars", authenticateTokenAdmin, upload.single("image"),  carsController.create);
route.get("/cars/public", carsController.listPublic);
route.get("/cars/:id", authenticateTokenAdmin, carsController.show);
route.patch("/cars/:id", authenticateTokenAdmin, upload.single("image"), carsController.update);
route.delete("/cars/:id", authenticateTokenAdmin, carsController.delete);

// users
route.post("/users/login", userController.login);
route.post("/users/refresh-token", userController.refreshToken);
route.post("/users/logout", authenticateToken, userController.logout);
route.get("/users/me", authenticateToken, userController.whoami);

// super admin management users
route.post("/users", authenticateTokenSuperAdmin, userController.store);

// users member
route.post("/users/member/register", userController.register);

// oauth
route.post('/users/auth/google', userController.googleLogin);

export default route;