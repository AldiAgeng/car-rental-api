import express, { Express } from "express";
import { Model } from "objection";
import { config } from "dotenv";
import morgan from "morgan";
import cors from 'cors';
import swaggerUi from "swagger-ui-express";
import swaggerDocument from "./docs/swagger-docs.json";

config();

import  knexInstance  from "./databases";
import { route } from "./routes/route";

const PORT = process.env.PORT || 3000;
const app: Express = express();

Model.knex(knexInstance);

app.use(morgan("combined"));
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use("/api/v1", route);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use((req, res) => {
  res.status(404).json({
    code: 404,
    status: "error",
    message: "Route not found",
    data: null,
  });
});

app.listen(PORT, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${PORT}`);
});
