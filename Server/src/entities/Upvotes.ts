import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, BaseEntity } from "typeorm";
import Post from "./Post";
import User from "./User";
import { ObjectType, Field } from "type-graphql";

@ObjectType()
@Entity()
class Upvotes extends BaseEntity {
  @Field()
  @Column()
  value: number;

  @ManyToOne(() => User, (user) => user.upvotes)
  user: User;

  @Field()
  @Column()
  userId: number;

  @Field()
  @PrimaryGeneratedColumn()
  postId: number;

  @ManyToOne(() => Post, (post) => post.upvotes, {
    onDelete: "CASCADE",
  })
  post: Post;
}

export default Upvotes;
