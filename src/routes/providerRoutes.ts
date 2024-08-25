import { Router } from "express";
import { AppDataSource } from "../database/database";
import { Provider } from "../entity/ProviderEntity";
import { Availability } from "../entity/AvailabilityEntity";
import { Slot } from "../entity/SlotEntity";
import { Reservation } from "../entity/ReservationEntity";
import { IsNull, LessThan } from "typeorm";

const router = Router();

/**
 * @swagger
 * /providers:
 *   post:
 *     summary: Create a new provider
 *     tags: [Providers]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *             example:
 *               name: Dr. John Doe
 *     responses:
 *       200:
 *         description: Provider created successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Provider'
 *       500:
 *         description: An error occurred while creating the provider.
 */
router.post("/", async (req, res) => {
  const { name } = req.body;

  try {
    const providerRepository = AppDataSource.getRepository(Provider);

    const provider = new Provider();
    provider.name = name;

    await providerRepository.save(provider);

    res.send({ message: "Provider created successfully", provider });
  } catch (error) {
    res
      .status(500)
      .send({
        message: "An error occurred while creating the provider",
        error,
      });
  }
});

/**
 * @swagger
 * /providers:
 *   get:
 *     summary: Get all providers
 *     tags: [Providers]
 *     responses:
 *       200:
 *         description: List of all providers.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Provider'
 *       500:
 *         description: An error occurred while retrieving providers.
 */
router.get("/", async (req, res) => {
  try {
    const providerRepository = AppDataSource.getRepository(Provider);
    const providers = await providerRepository.find();
    res.send(providers);
  } catch (error) {
    res
      .status(500)
      .send({ message: "An error occurred while retrieving providers", error });
  }
});

/**
 * @swagger
 * /providers/{providerId}:
 *   get:
 *     summary: Get a provider by ID
 *     tags: [Providers]
 *     parameters:
 *       - in: path
 *         name: providerId
 *         schema:
 *           type: integer
 *         required: true
 *         description: The id of the provider
 *     responses:
 *       200:
 *         description: The provider details.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Provider'
 *       404:
 *         description: Provider not found.
 *       500:
 *         description: An error occurred while retrieving the provider.
 */
router.get("/:providerId", async (req, res) => {
  const { providerId } = req.params;

  try {
    const providerRepository = AppDataSource.getRepository(Provider);
    const provider = await providerRepository.findOne({
      where: { id: parseInt(providerId) },
    });

    if (!provider) {
      return res.status(404).send({ message: "Provider not found" });
    }

    res.send(provider);
  } catch (error) {
    res
      .status(500)
      .send({
        message: "An error occurred while retrieving the provider",
        error,
      });
  }
});

/**
 * @swagger
 * /providers/{providerId}:
 *   put:
 *     summary: Update a provider's information
 *     tags: [Providers]
 *     parameters:
 *       - in: path
 *         name: providerId
 *         schema:
 *           type: integer
 *         required: true
 *         description: The id of the provider
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *             example:
 *               name: Dr. Jane Doe
 *     responses:
 *       200:
 *         description: Provider updated successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Provider'
 *       404:
 *         description: Provider not found.
 *       500:
 *         description: An error occurred while updating the provider.
 */
router.put("/:providerId", async (req, res) => {
  const { providerId } = req.params;
  const { name } = req.body;

  try {
    const providerRepository = AppDataSource.getRepository(Provider);
    const provider = await providerRepository.findOne({
      where: { id: parseInt(providerId) },
    });

    if (!provider) {
      return res.status(404).send({ message: "Provider not found" });
    }

    provider.name = name || provider.name;

    await providerRepository.save(provider);

    res.send({ message: "Provider updated successfully", provider });
  } catch (error) {
    res
      .status(500)
      .send({
        message: "An error occurred while updating the provider",
        error,
      });
  }
});

/**
 * @swagger
 * /providers/{providerId}:
 *   delete:
 *     summary: Delete a provider by ID
 *     tags: [Providers]
 *     parameters:
 *       - in: path
 *         name: providerId
 *         schema:
 *           type: integer
 *         required: true
 *         description: The id of the provider
 *     responses:
 *       200:
 *         description: Provider deleted successfully.
 *       404:
 *         description: Provider not found.
 *       500:
 *         description: An error occurred while deleting the provider.
 */
router.delete("/:providerId", async (req, res) => {
  const { providerId } = req.params;

  try {
    const providerRepository = AppDataSource.getRepository(Provider);
    const provider = await providerRepository.findOne({
      where: { id: parseInt(providerId) },
    });

    if (!provider) {
      return res.status(404).send({ message: "Provider not found" });
    }

    await providerRepository.remove(provider);

    res.send({ message: "Provider deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .send({
        message: "An error occurred while deleting the provider",
        error,
      });
  }
});

/**
 * @swagger
 * /providers/{providerId}/availability:
 *   post:
 *     summary: Submit availability for a provider
 *     tags: [Providers]
 *     description: Submit a time range during which a provider is available. This will generate 15-minute time slots within that range.
 *     parameters:
 *       - in: path
 *         name: providerId
 *         schema:
 *           type: integer
 *         required: true
 *         description: The ID of the provider
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               startTime:
 *                 type: string
 *                 format: date-time
 *                 description: The start time of the availability period
 *               endTime:
 *                 type: string
 *                 format: date-time
 *                 description: The end time of the availability period
 *             example:
 *               startTime: 2024-08-23T08:00:00.000Z
 *               endTime: 2024-08-23T10:00:00.000Z
 *     responses:
 *       200:
 *         description: Availability and slots created successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Availability and slots created successfully
 *                 slots:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                       startTime:
 *                         type: string
 *                         format: date-time
 *                       endTime:
 *                         type: string
 *                         format: date-time
 *                       status:
 *                         type: string
 *                         enum: [available, reserved, confirmed]
 *       404:
 *         description: Provider not found.
 *       500:
 *         description: An error occurred while submitting availability.
 */
router.post("/:providerId/availability", async (req, res) => {
  const { providerId } = req.params;
  const { startTime, endTime } = req.body;

  try {
    const providerRepository = AppDataSource.getRepository(Provider);
    const availabilityRepository =
      AppDataSource.getRepository(Availability);
    const slotRepository = AppDataSource.getRepository(Slot);

    // Find the provider
    const provider = await providerRepository.findOne({
      where: { id: parseInt(providerId) },
    });
    if (!provider) {
      return res.status(404).send({ message: "Provider not found" });
    }

    // Create new availability
    const availability = new Availability();
    availability.provider = provider;
    availability.startTime = new Date(startTime);
    availability.endTime = new Date(endTime);

    // Save the availability
    await availabilityRepository.save(availability);

    // TODO: Any updates to availability will wipe out existing reservations

    // Generate 15 min slots
    const slots: Slot[] = [];
    let currentTime = new Date(startTime);
    const availabilityEndTime = new Date(endTime);

    while (currentTime < availabilityEndTime) {
      const slotEndTime = new Date(currentTime);
      slotEndTime.setMinutes(slotEndTime.getMinutes() + 15);

      if (slotEndTime <= availabilityEndTime) {
        const slot = new Slot();
        slot.provider = provider;
        slot.startTime = new Date(currentTime);
        slot.endTime = slotEndTime;
        slot.status = "available";
        slots.push(slot);
      }

      currentTime = slotEndTime;
    }

    // Save the slots
    await slotRepository.save(slots);

    res.send({ message: "Availability and slots created successfully", slots });
  } catch (error) {
    res
      .status(500)
      .send({
        message: "An error occurred while submitting availability",
        error,
      });
  }
});

/**
 * @swagger
 * /providers/{providerId}/available-slots:
 *   get:
 *     summary: Get all available slots for a provider
 *     tags: [Providers]
 *     description: Retrieve a list of all available slots for a specific provider.
 *     parameters:
 *       - in: path
 *         name: providerId
 *         schema:
 *           type: integer
 *         required: true
 *         description: The ID of the provider
 *     responses:
 *       200:
 *         description: List of available slots.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   startTime:
 *                     type: string
 *                     format: date-time
 *                   endTime:
 *                     type: string
 *                     format: date-time
 *                   status:
 *                     type: string
 *                     enum: [available, reserved, confirmed]
 *       404:
 *         description: Provider not found.
 *       500:
 *         description: An error occurred while retrieving available slots.
 */
router.get("/:providerId/available-slots", async (req, res) => {
  const { providerId } = req.params;

  try {
    const providerRepository = AppDataSource.getRepository(Provider);
    const slotRepository = AppDataSource.getRepository(Slot);

    // Find the provider
    const provider = await providerRepository.findOne({
      where: { id: parseInt(providerId) },
    });
    if (!provider) {
      return res.status(404).send({ message: "Provider not found" });
    }

    // Find all available slots for the provider
    const availableSlots = await slotRepository.find({
      where: {
        provider: { id: provider.id },
        status: "available",
      },
      order: {
        startTime: "ASC", // Order by start time
      },
    });

    res.send({ availableSlots });
  } catch (error) {
    res
      .status(500)
      .send({
        message: "An error occurred while retrieving available slots",
        error,
      });
  }
});

export default router;
