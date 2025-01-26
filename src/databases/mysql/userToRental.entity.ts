import {
  Column,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { UserEntity } from "./user.entity";
import { RentalEntity } from "./rental.entity";
import { UserStatus } from "../../types/user/UserStatus";

@Entity("users_rentals")
export class UserToRentalEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => UserEntity, (user) => user.rentals)
  @JoinColumn({ name: "user_id" })
  user: UserEntity;

  @ManyToOne(() => RentalEntity, (rental) => rental.users)
  @JoinColumn({ name: "rental_id" })
  rental: RentalEntity;

  @Column({ type: "enum", enum: UserStatus, default: UserStatus.member })
  status: UserStatus;

  @DeleteDateColumn({ nullable: true })
  deletedAt: Date | null;
}
