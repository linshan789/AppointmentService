import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { Provider } from "./ProviderEntity";
import { Reservation } from "./ReservationEntity";

@Entity()
export class Slot {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "timestamptz" })
  startTime: Date;

  @Column({ type: "timestamptz" })
  endTime: Date;

  @Column()
  status: "available" | "reserved" | "confirmed";

  @ManyToOne(() => Provider, (provider) => provider.slots)
  provider: Provider;

  @ManyToOne(() => Reservation, (reservation) => reservation.slot, {
    nullable: true,
  })
  reservation: Reservation | null;
}
