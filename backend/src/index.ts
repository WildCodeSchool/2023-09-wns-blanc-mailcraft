import createServer from "./config/server";
import dotenv from "dotenv";

dotenv.config();
const port = process.env.PORT || 3001;

async function start() {
  const { app } = await createServer();

  app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
  });
}

void start();
