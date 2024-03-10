import createServer from "./config/server";
import * as dotenv from "dotenv";
const port: number = 3001;

const start = async () => {
  const server = await createServer();

  try {
    const { url } = await server.listen({ port });
    console.log(`Server running at ${url}`);
  } catch (err) {
    console.error("Error starting the server");
  }
};

void start();
