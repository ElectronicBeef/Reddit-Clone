import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
  BaseEntity,
} from "typeorm";
import Post from "./Post";
import Upvotes from "./Upvotes";
import {ObjectType, Field, ID} from "type-graphql";

@ObjectType()
@Entity()
class User extends BaseEntity{
  @Field(()=> ID)
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column({ length: 35 })
  username: string;

  @Field()
  @Column({ length: 100 })
  email: string;

  @Column({ length: 1000 })
  password: string;

  @OneToMany(() => Post, (post) => post.creator)
  posts: Post[];

  @OneToMany(() => Upvotes, (upvotes) => upvotes.user)
  upvotes: Upvotes;

  @Field()
  @CreateDateColumn()
  createdAt: Date;

  @Field()
  @UpdateDateColumn()
  updatedAt: Date;
}

export default User;
