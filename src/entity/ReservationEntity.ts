import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { Slot } from "./SlotEntity";
import { Client } from "./ClientEntity";

@Entity()
export class Reservation {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "timestamptz" })
  expiresAt: Date;

  @Column({ type: "timestamptz", nullable: true })
  confirmedAt: Date;

  @ManyToOne(() => Slot, (slot) => slot.reservation)
  slot: Slot;

  @ManyToOne(() => Client, (client) => client.reservations)
  client: Client;
}
