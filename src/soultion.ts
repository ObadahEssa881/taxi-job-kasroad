import { PrismaClient } from "@prisma/client";
import type { Request, Response, NextFunction } from "express";

const prisma = new PrismaClient();

// function to calculate the cancellation rate of each day
export async function getCancellationRate(
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
    let resault: { day: string; cancel: number; total: number }[] = [];

    for (const trip of unbannedTrips) {
      let i = Number(trip.request_at.split("-")[2]) - 1;

      if (resault[i]?.day === undefined) {
        resault[i] = { day: trip.request_at, cancel: 0, total: 0 };
      }

      resault[i].total += 1;
      if (
        trip.status === "cancelled_by_driver" ||
        trip.status === "cancelled_by_client"
      ) {
        resault[i].cancel += 1;
      }
    }
    let final: { day: string; cancelRate: number }[] = [];
    resault.map((x) => {
      final.push({
        day: x.day,
        cancelRate: Number((x.cancel / x.total).toFixed(2)),
      });
    });

    res.status(200).json(final);
  } catch (error) {
    console.error("Error calculating rate:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}
