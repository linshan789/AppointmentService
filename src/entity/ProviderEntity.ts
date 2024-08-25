import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { Availability } from "./AvailabilityEntity";
import { Slot } from "./SlotEntity";

@Entity()
export class Provider {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @OneToMany(() => Availability, (availability) => availability.provider)
  availability: Availability[];

  @OneToMany(() => Slot, (slot) => slot.provider)
  slots: Slot[];
}
