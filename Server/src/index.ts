import "reflect-metadata";
import AppDataSource from "./data-source";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer";
import express, { Request, Response } from "express";
import http from "http";
import cors from "cors";
import { json } from "body-parser";
import { Hello } from "./resolvers/hello";
import { UserResolver } from "./resolvers/user";
import { buildSchema } from "type-graphql";
import RedisStore from "connect-redis";
import session from "express-session";
import { createClient } from "redis";

export type MyContext = {
  req: Request & { session: Express.Session };
  res: Response;
};

const main = async () => {
  await AppDataSource.initialize();

  const app = express();

  app.set("trust proxy", 1);
  const corsOptions = {
    origin: "https://sandbox.embed.apollographql.com",
    credentials: true,
  };

  const httpServer = http.createServer(app);
  const port = 3000;

  const redisClient = createClient();
  redisClient.connect().catch(console.error);
  const redisStore = new RedisStore({
    client: redisClient,
  });

  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [Hello, UserResolver],
    }),
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
  });
  await apolloServer.start();

  app.use(
    session({
      name: "qid",
      store: redisStore,
      resave: false,
      saveUninitialized: false,
      secret: "weotjweptoijwepitn",
      cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 365 * 10,
        httpOnly: true,
        sameSite: "none",
        secure: true,
      },
    }),
    cors(corsOptions),
    json(),
    expressMiddleware(apolloServer, {
      context: async ({ req, res }) => ({ req: req.session, res }),
    })
  );

  httpServer.listen(port, () => {
    console.log(`Server now running on port: ${port}`);
  });
};

main();
