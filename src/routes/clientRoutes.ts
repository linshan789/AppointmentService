// src/routes/clientRoutes.ts
import { Router } from "express";
import { AppDataSource } from "../database/database";
import { Client } from "../entity/ClientEntity";
import { Reservation } from "../entity/ReservationEntity";
import { Slot } from "../entity/SlotEntity";

const router = Router();

/**
 * @swagger
 * /clients:
 *   post:
 *     summary: Create a new client
 *     tags: [Clients]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               phoneNumber:
 *                 type: string
 *             example:
 *               name: John Doe
 *               email: john.doe@example.com
 *               phoneNumber: 123-456-7890
 *     responses:
 *       200:
 *         description: Client created successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Client'
 */
router.post("/", async (req, res) => {
  const { name, email, phoneNumber } = req.body;

  try {
    const clientRepository = AppDataSource.getRepository(Client);

    // Check if a client with the same email already exists
    const existingClient = await clientRepository.findOne({ where: { email } });
    if (existingClient) {
      return res
        .status(400)
        .send({ message: "Client with this email already exists" });
    }

    const client = new Client();
    client.name = name;
    client.email = email;
    client.phoneNumber = phoneNumber;

    await clientRepository.save(client);

    res.send({ message: "Client created successfully", client });
  } catch (error) {
    res
      .status(500)
      .send({ message: "An error occurred while creating the client", error });
  }
});

/**
 * @swagger
 * /clients:
 *   get:
 *     summary: Get all clients
 *     tags: [Clients]
 *     responses:
 *       200:
 *         description: List of all clients
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Client'
 *       500:
 *         description: An error occurred while retrieving clients.
 */
router.get("/", async (req, res) => {
  try {
    const clientRepository = AppDataSource.getRepository(Client);
    const clients = await clientRepository.find();
    res.send(clients);
  } catch (error) {
    res
      .status(500)
      .send({ message: "An error occurred while retrieving clients", error });
  }
});

/**
 * @swagger
 * /clients/{clientId}:
 *   get:
 *     summary: Get a client by ID
 *     tags: [Clients]
 *     parameters:
 *       - in: path
 *         name: clientId
 *         schema:
 *           type: integer
 *         required: true
 *         description: The id of the client
 *     responses:
 *       200:
 *         description: The client details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Client'
 *       404:
 *         description: Client not found.
 *       500:
 *         description: An error occurred while retrieving the client.
 */
router.get("/:clientId", async (req, res) => {
  const { clientId } = req.params;

  try {
    const clientRepository = AppDataSource.getRepository(Client);
    const client = await clientRepository.findOne({
      where: { id: parseInt(clientId) },
    });

    if (!client) {
      return res.status(404).send({ message: "Client not found" });
    }

    res.send(client);
  } catch (error) {
    res
      .status(500)
      .send({
        message: "An error occurred while retrieving the client",
        error,
      });
  }
});

/**
 * @swagger
 * /clients/{clientId}:
 *   put:
 *     summary: Update a client's information
 *     tags: [Clients]
 *     parameters:
 *       - in: path
 *         name: clientId
 *         schema:
 *           type: integer
 *         required: true
 *         description: The id of the client
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               phoneNumber:
 *                 type: string
 *             example:
 *               name: John Doe
 *               email: john.doe@example.com
 *               phoneNumber: 123-456-7890
 *     responses:
 *       200:
 *         description: Client updated successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Client'
 *       404:
 *         description: Client not found.
 *       500:
 *         description: An error occurred while updating the client.
 */
router.put("/:clientId", async (req, res) => {
  const { clientId } = req.params;
  const { name, email, phoneNumber } = req.body;

  try {
    const clientRepository = AppDataSource.getRepository(Client);
    const client = await clientRepository.findOne({
      where: { id: parseInt(clientId) },
    });

    if (!client) {
      return res.status(404).send({ message: "Client not found" });
    }

    client.name = name || client.name;
    client.email = email || client.email;
    client.phoneNumber = phoneNumber || client.phoneNumber;

    await clientRepository.save(client);

    res.send({ message: "Client updated successfully", client });
  } catch (error) {
    res
      .status(500)
      .send({ message: "An error occurred while updating the client", error });
  }
});

/**
 * @swagger
 * /clients/{clientId}:
 *   delete:
 *     summary: Delete a client by ID
 *     tags: [Clients]
 *     parameters:
 *       - in: path
 *         name: clientId
 *         schema:
 *           type: integer
 *         required: true
 *         description: The id of the client
 *     responses:
 *       200:
 *         description: Client deleted successfully.
 *       404:
 *         description: Client not found.
 *       500:
 *         description: An error occurred while deleting the client.
 */
router.delete("/:clientId", async (req, res) => {
  const { clientId } = req.params;

  try {
    const clientRepository = AppDataSource.getRepository(Client);
    const client = await clientRepository.findOne({
      where: { id: parseInt(clientId) },
    });

    if (!client) {
      return res.status(404).send({ message: "Client not found" });
    }

    await clientRepository.remove(client);

    res.send({ message: "Client deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .send({ message: "An error occurred while deleting the client", error });
  }
});

/**
 * @swagger
 * /clients/{clientId}/reserve:
 *   post:
 *     summary: Reserve a slot for a client
 *     tags: [Clients]
 *     parameters:
 *       - in: path
 *         name: clientId
 *         schema:
 *           type: integer
 *         required: true
 *         description: The id of the client
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               slotId:
 *                 type: integer
 *             example:
 *               slotId: 5
 *     responses:
 *       200:
 *         description: Slot reserved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Reservation'
 *       400:
 *         description: Slot not available or does not exist, or reservation is less than 24 hours in advance.
 *       404:
 *         description: Client not found.
 *       500:
 *         description: An error occurred during reservation.
 */
router.post("/:clientId/reserve", async (req, res) => {
  const { clientId } = req.params;
  const { slotId } = req.body;

  try {
    const clientRepository = AppDataSource.getRepository(Client);
    const slotRepository = AppDataSource.getRepository(Slot);
    const reservationRepository =
      AppDataSource.getRepository(Reservation);

    // Find the client
    const client = await clientRepository.findOne({
      where: { id: parseInt(clientId) },
    });
    if (!client) {
      return res.status(404).send({ message: "Client not found" });
    }

    // Find the slot
    const slot = await slotRepository.findOne({
      where: {
        id: parseInt(slotId),
        status: "available",
      },
    });
    if (!slot) {
      return res
        .status(400)
        .send({ message: "Slot not available or does not exist" });
    }

    // make sure slot is more than 24 hours in the future
    const currentTime = new Date();
    const slotStartTime = slot.startTime;
    const timeDiffHours =
      (slotStartTime.getTime() - currentTime.getTime()) / (1000 * 60 * 60);

    if (timeDiffHours < 24) {
      return res
        .status(400)
        .send({
          message: "Reservations must be made at least 24 hours in advance",
        });
    }

    // Create the reservation
    const reservation = new Reservation();
    reservation.client = client;
    reservation.slot = slot;
    reservation.expiresAt = new Date(Date.now() + 30 * 60000); // should move this to a const var

    // Save the reservation
    await reservationRepository.save(reservation);

    // Update the slot status to "reserved"
    slot.status = "reserved";
    slot.reservation = reservation;
    await slotRepository.save(slot);

    res.send({
      reservation_id: reservation.id,
      expires_at: reservation.expiresAt,
    });
  } catch (error) {
    res
      .status(500)
      .send({ message: "An error occurred during reservation", error });
  }
});

/**
 * @swagger
 * /clients/{clientId}/confirm:
 *   post:
 *     summary: Confirm a reservation for a client
 *     tags: [Clients]
 *     parameters:
 *       - in: path
 *         name: clientId
 *         schema:
 *           type: integer
 *         required: true
 *         description: The id of the client
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               reservationId:
 *                 type: integer
 *             example:
 *               reservationId: 10
 *     responses:
 *       200:
 *         description: Reservation confirmed successfully.
 *       400:
 *         description: Reservation has expired.
 *       404:
 *         description: Client or reservation not found.
 *       500:
 *         description: An error occurred while confirming the reservation.
 */
router.post("/:clientId/confirm", async (req, res) => {
  const { clientId } = req.params;
  const { reservationId } = req.body;

  try {
    const clientRepository = AppDataSource.getRepository(Client);
    const reservationRepository =
      AppDataSource.getRepository(Reservation);
    const slotRepository = AppDataSource.getRepository(Slot);

    // Find the client
    const client = await clientRepository.findOne({
      where: { id: parseInt(clientId) },
    });
    if (!client) {
      return res.status(404).send({ message: "Client not found" });
    }

    // Find the reservation
    const reservation = await reservationRepository.findOne({
      where: { id: parseInt(reservationId), client: { id: client.id } },
      relations: ["slot"],
    });
    if (!reservation) {
      return res.status(404).send({ message: "Reservation not found" });
    }

    // Check if the reservation has expired
    if (reservation.expiresAt < new Date()) {
      return res.status(400).send({ message: "Reservation has expired" });
    }

    // Confirm the reservation
    reservation.confirmedAt = new Date();
    await reservationRepository.save(reservation);

    // Update the slot status to "confirmed"
    reservation.slot.status = "confirmed";
    await slotRepository.save(reservation.slot);

    res.send({ message: "Reservation confirmed successfully" });
  } catch (error) {
    res
      .status(500)
      .send({
        message: "An error occurred while confirming the reservation",
        error,
      });
  }
});

export default router;
