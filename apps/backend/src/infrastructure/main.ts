import express from "express";
import cors from "cors";
import { routes } from "./api/routes";
import { seedData } from "./seed";

const app = express();

app.use(cors());
app.use(express.json());
app.use(routes);

const port = Number(process.env.PORT ?? 3000);
app.listen(port, async () => {
  await seedData();
  process.stdout.write(`Backend running on port ${port}\n`);
});
