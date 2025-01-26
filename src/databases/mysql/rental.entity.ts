import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { UserToRentalEntity } from "./userToRental.entity";

@Entity("rentals")
export class RentalEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100 })
  street: string;

  @Column({ width: 4 })
  number: number;

  @Column({ length: 50 })
  city: string;

  @Column({ width: 5 })
  zipcode: number;

  @Column({ name: "rooms_count", width: 2 })
  roomsCount: number;

  @Column({ width: 3 })
  surface: number;

  @Column({ length: 50 })
  agency: string;

  @OneToMany(() => UserToRentalEntity, (userToRental) => userToRental.rental)
  users: UserToRentalEntity[];
}
