import * as dotenv from "dotenv";
import { dataSource } from "./db";
import { buildSchema } from "type-graphql";
import { ApolloServer } from "apollo-server-express";
import express from "express";
import cors from "cors";
import { UserResolver } from "../resolvers/user.resolver";
import { TemplateResolver } from "../resolvers/template.resolver";
import { ZoneResolver } from "../resolvers/zone.resolver";
import { SubZoneResolver } from "../resolvers/subZone.resolver";
import { verifyToken } from "../services/auth.service";
import { getByEmail } from "../services/user.service";
import { GraphQLError } from "graphql";

async function createServer() {
  dotenv.config();
  await dataSource.initialize();

  const schema = await buildSchema({
    resolvers: [UserResolver, TemplateResolver, ZoneResolver, SubZoneResolver],
    validate: { forbidUnknownValues: false },
    authChecker: async ({ context }, roles) => {
      try {
        const payload = verifyToken(context.token);
        const userFromDB = await getByEmail(payload.email);
        context.user = userFromDB;
        return roles.length ? roles.includes(context.user.role) : true;
      } catch (e) {
        throw new GraphQLError(
          "You are not authorized to perform this action."
        );
      }
    },
  });

  const app = express();
  app.use(cors({ origin: "http://localhost:3000", credentials: true })); // mettre url de prod après

  const server = new ApolloServer({
    schema,
    context: ({ req }) => ({
      token: req.headers.authorization
        ? req.headers.authorization.split("Bearer ")[1]
        : null,
    }),
  });
  await server.start();
  server.applyMiddleware({ app });

  return { app, server };
}

export default createServer;
