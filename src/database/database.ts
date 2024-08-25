import { DataSource } from "typeorm";
import { Provider } from "../entity/ProviderEntity";
import { Availability } from "../entity/AvailabilityEntity";
import { Slot } from "../entity/SlotEntity";
import { Reservation } from "../entity/ReservationEntity";
import { Client } from "../entity/ClientEntity";

export const AppDataSource = new DataSource({
  type: "postgres",
  host: "localhost",
  port: 5432,
  username: "postgres",
  password: "password",
  database: "appointment",
  entities: [
    Provider,
    Availability,
    Slot,
    Reservation,
    Client,
  ],
  synchronize: true,
  logging: true,
});

export const initializeDatabase = async () => {
  try {
    await AppDataSource.initialize();
    console.log("Data Source has been initialized!");
  } catch (err) {
    console.error("Error during Data Source initialization:", err);
  }
};
