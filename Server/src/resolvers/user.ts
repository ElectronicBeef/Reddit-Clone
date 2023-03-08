import { Resolver, Mutation, Arg, Query, Ctx } from "type-graphql";
import User from "../entities/User";
import { MyContext } from "../index";

@Resolver()
export class UserResolver {

  // Register a user and keep them logged in 
  @Mutation(() => User)
  async register(
    @Arg("username") username: string,
    @Arg("password") password: string,
    @Arg("email") email: string,
    @Ctx("req") { req }: MyContext,
  ): Promise<User> {
    const user = await User.create({
      username,
      email,
      password,
    }).save();

    // Keeping them logged in through session/cookie
    try {
      req.session.userId = user.id;
    }
    catch (error) {
      console.log(error);
      console.error(error);
    }
    return user;
  }

  // Find all exisiting users
  @Query(() => [User])
  async findAllUsers(): Promise<User[]> {
    const Users = await User.find({
      select: {
        id: true,
        username: true,
        email: true,
      },
    });
    return Users;
  }
}
