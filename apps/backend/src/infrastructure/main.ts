import express from "express";
import { routes } from "./api/routes";

const app = express();

app.use(express.json());
app.use(routes);

const port = Number(process.env.PORT ?? 3000);
app.listen(port, () => {
  process.stdout.write(`Backend running on port ${port}\n`);
});
