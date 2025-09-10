import { NextFunction, Request, Response } from "express";
import { z } from "zod";

export function validate(
  schema: z.ZodObject,
  data: (req: Request) => any
) {
  return function (req: Request, resp: Response, next: NextFunction) {
    const validationResult = schema.safeParse(data(req));
    if (validationResult.success) {
      next();
    } else {
      resp.sendStatus(400);
    }
  };
}
