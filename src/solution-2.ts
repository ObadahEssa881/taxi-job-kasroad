import { PrismaClient } from "@prisma/client";
import type { Request, Response, NextFunction } from "express";

const prisma = new PrismaClient();

// function to calculate the cancellation rate of each day
export async function getCancellationRate2(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const start_date = req.query.start_date as string;
  const end_date = req.query.end_date as string;

  try {
    if (!start_date || !end_date) {
      return res.status(400).json({
        error: "Please provide start_date and end_date query parameters",
      });
    }

    const trips = await prisma.trip.findMany({
      where: {
        request_at: {
          gte: start_date,
          lte: end_date,
        },
      },
      include: {
        user: true,
        driver: true,
      },
    });

    const unbannedTrips = trips.filter(
      (t) => t.user.banned === "No" && t.driver.banned === "No"
    );

    const grouped: Record<string, { total: number; cancelled: number }> = {};
    for (const trip of unbannedTrips) {
      const day = trip.request_at;

      if (!grouped[day]) grouped[day] = { total: 0, cancelled: 0 };
      grouped[day].total += 1;

      if (
        trip.status === "cancelled_by_driver" ||
        trip.status === "cancelled_by_client"
      ) {
        grouped[day].cancelled += 1;
      }
    }

    const result = Object.entries(grouped).map(([day, stats]) => ({
      Day: day,
      "Cancellation Rate": Number((stats.cancelled / stats.total).toFixed(2)),
    }));

    res.status(200).json(result);
  } catch (error) {
    console.error("Error calculating rate:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}
