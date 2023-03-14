import { Resolver, Mutation, Arg, Query, Ctx } from "type-graphql";
import User from "../entities/User";
import { MyContext } from "../index";
import AppDataSource from "../data-source";

/* 
ToDo:
- Logout 
- Change password 
- Forgot password
- Error handling/messages
*/

@Resolver()
export class UserResolver {
  // Register a user and keep them logged in
  @Mutation(() => User)
  async register(
    @Arg("username") username: string,
    @Arg("password") password: string,
    @Arg("email") email: string,
    @Ctx("req") { req }: MyContext
  ): Promise<User | null> {
    // Validate entered information
    if (
      !email.includes("@") ||
      username.length <= 2 ||
      username.includes("@") ||
      password.length <= 2
    ) {
      return null;
    }

    // Check if email and or username are in use
    const emailTaken = await User.findOne({
      where: {
        email: email,
      },
    });
    const usernameTaken = await User.findOne({
      where: {
        username: username,
      },
    });

    // Register the user
    if (!emailTaken && !usernameTaken) {
      const user = await User.create({
        username,
        email,
        password,
      }).save();

      // Keeping them logged in through session/cookie
      try {
        req.session.userId = user.id;
      } catch (error) {
        console.log(error);
      }
      return user;
    } else {
      return null;
    }
  }

  // Loggin in a user
  @Query(() => User)
  async login(
    @Arg("username") username: string,
    @Arg("password") password: string,
    @Ctx("req") { req }: MyContext
  ): Promise<User | undefined> {
    const user = await User.findOne({
      where: {
        username: username,
        password: password,
      },
    });
    if (!user) {
      return;
    }

    req.session.userId = user.id;
    return user;
  }

  // Logging out a user (doesnt work at the moment)
  @Mutation(() => Boolean)
  logout(@Ctx() { req, res }: MyContext) {
    return new Promise((resolve) =>
      req.session.destroy((err) => {
        res.clearCookie("qid");
        if (err) {
          console.log(err);
          resolve(false);
          return;
        }
        resolve(true);
      })
    );
  }

  // Who is logged in?
  @Query(() => User)
  async me(@Ctx("req") { req }: MyContext): Promise<User | null> {
    if (!req.session.userId) {
      return null;
    } else {
      const user = User.findOne({
        where: {
          id: req.session.userId,
        },
      });
      return user;
    }
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

  // Delete a user (only for admin purposes)
  @Mutation(() => Boolean)
  async deleteUser(@Arg("id") id: number): Promise<Boolean> {
    try {
      await AppDataSource.createQueryBuilder()
        .delete()
        .from(User)
        .where("id = :id", { id: id })
        .execute();
      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  }
}
