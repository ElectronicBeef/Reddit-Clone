import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
  BaseEntity,
} from "typeorm";
import User from "./User";
import Upvotes from "./Upvotes";
import {ObjectType, Field} from "type-graphql";

@ObjectType()
@Entity()
class Post extends BaseEntity{
  @Field()
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column({ length: 180 })
  title: string;

  @Field()
  @Column({ length: 10000 })
  text: string;

  @Field()
  @Column()
  points: number;

  @Field()
  @Column()
  voteStatus: number;

  @Field()
  @Column()
  creatorId: number;

  @Field()
  @ManyToOne(() => User, (user) => user.posts)
  creator: User;

  @OneToMany(() => Upvotes, (upvotes) => upvotes.post)
  upvotes: Upvotes[];

  @Field()
  @CreateDateColumn()
  createdAt: Date;

  @Field()
  @UpdateDateColumn()
  updatedAt: Date;
}

export default Post;
