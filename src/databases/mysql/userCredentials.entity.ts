import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { UserEntity } from "./user.entity";

@Entity("user_credentials")
export class UserCredentialsEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  password: string;

  @OneToOne(() => UserEntity, (user) => user.credentials, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "user_id" })
  user: UserEntity;
}
