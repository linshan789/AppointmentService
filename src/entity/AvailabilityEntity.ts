import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { Provider } from "./ProviderEntity";

@Entity()
export class Availability {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "timestamptz" })
  startTime: Date;

  @Column({ type: "timestamptz" })
  endTime: Date;

  @ManyToOne(() => Provider, (provider) => provider.availability)
  provider: Provider;
}
