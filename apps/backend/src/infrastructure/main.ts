import { createApp } from "./app";

const app = createApp();

const port = Number(process.env.PORT ?? 3000);
app.listen(port, () => {
  process.stdout.write(`Backend running on port ${port}\n`);
});
