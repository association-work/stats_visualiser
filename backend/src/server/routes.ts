import express from "express";
import { serviceMap } from "./config/services";

export const router = express.Router();

router.get("/data", async (req, resp, next) => {
  try {
    const data = await serviceMap.repository.getAll();
    resp.send(data);
  } catch (e) {
    next(e);
  }
});
