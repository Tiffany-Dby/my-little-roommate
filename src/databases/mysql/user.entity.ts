import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  OneToOne,
} from "typeorm";
import { UserToRentalEntity } from "./userToRental.entity";
import { UserCredentialsEntity } from "./userCredentials.entity";

@Entity("users")
export class UserEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: "first_name", length: 50 })
  firstName: string;

  @Column({ name: "last_name", length: 50 })
  lastName: string;

  @Column({ unique: true })
  email: string;

  @Column({ width: 3 })
  age: number;

  @OneToMany(() => UserToRentalEntity, (userToRental) => userToRental.user)
  rentals: UserToRentalEntity[];

  @OneToOne(() => UserCredentialsEntity, (credentials) => credentials.user, {
    cascade: true,
  })
  credentials: UserCredentialsEntity;
}
