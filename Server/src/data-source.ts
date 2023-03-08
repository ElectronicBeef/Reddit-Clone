import { DataSource } from "typeorm";
import Post from "./entities/Post";
import User from "./entities/User";
import Upvotes from "./entities/Upvotes";

const AppDataSource = new DataSource({
  type: "postgres",
  host: "localhost",
  port: 5433,
  username: "postgres",
  password: "123",
  database: "Reddit Clone",
  synchronize: true,
  logging: true,
  entities: [Post, User, Upvotes],
});

export default AppDataSource;