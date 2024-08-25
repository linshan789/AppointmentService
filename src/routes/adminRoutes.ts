import { Router } from "express";
import { AppDataSource } from "../database/database";
import { Slot } from "../entity/SlotEntity";
import { Reservation } from "../entity/ReservationEntity";
import { IsNull, LessThan } from "typeorm";

const router = Router();

/**
 * @swagger
 * /admin/expire-reservations:
 *   post:
 *     summary: Expire reservations and release slots
 *     tags: [Admin]
 *     description: Expire all reservations that have not been confirmed within the allowed time and release the associated slots.
 *     responses:
 *       200:
 *         description: Expired reservations have been successfully released.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Expired reservations have been released
 *       500:
 *         description: An error occurred while expiring reservations.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: An error occurred while expiring reservations
 *                 error:
 *                   type: string
 */

// options:
// 1. cron to call this every 30 min
// 2. distributed lock via redis?
router.post("/expire-reservations", async (req, res) => {
  try {
    const reservationRepository =
      AppDataSource.getRepository(Reservation);
    const slotRepository = AppDataSource.getRepository(Slot);

    // Find all reservations that have expired but not been confirmed
    const cutOffTime = new Date();
    cutOffTime.setMinutes(cutOffTime.getMinutes() - 30);
    const expiredReservations = await reservationRepository.find({
      where: {
        expiresAt: LessThan(cutOffTime),
        confirmedAt: IsNull(),
      },
      relations: ["slot"],
    });

    // TODO: MAKE THIS INTO A TRANSACTION!!!
    
    // Update the slots for expired reservations
    for (const reservation of expiredReservations) {
      reservation.slot.status = "available";
      reservation.slot.reservation = null;
      await slotRepository.save(reservation.slot);
      await reservationRepository.remove(reservation);
    }

    res.send({ message: "Expired reservations have been released" });
  } catch (error) {
    res
      .status(500)
      .send({
        message: "An error occurred while expiring reservations",
        error,
      });
  }
});

export default router;
