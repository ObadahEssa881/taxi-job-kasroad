import express from "express";
import dotenv from "dotenv";
import { getCancellationRate } from "./soultion.js";
import { getCancellationRate2 } from "./solution-2.js";

dotenv.config();

const app = express();
app.use(express.json());

app.get("/api/cancellation-rate", getCancellationRate);
app.get("/api/cancellation-rate2", getCancellationRate2);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
