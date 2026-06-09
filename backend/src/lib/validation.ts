import type { NextFunction, Request, Response } from "express";
import { ZodError, type ZodTypeAny } from "zod";
import { ApiError } from "../middleware/errorHandler";

function mapZodError(error: ZodError) {
  return error.issues.map((issue) => ({
    path: issue.path.join("."),
    message: issue.message,
  }));
}

function parseWithSchema<T extends ZodTypeAny>(schema: T, data: unknown, label: string) {
  const result = schema.safeParse(data);

  if (!result.success) {
    const details = mapZodError(result.error);
    throw new ApiError(400, `${label} validation failed: ${JSON.stringify(details)}`);
  }

  return result.data;
}

export function validateBody<T extends ZodTypeAny>(schema: T) {
  return (req: Request, _res: Response, next: NextFunction) => {
    try {
      req.body = parseWithSchema(schema, req.body, "Body");
      return next();
    } catch (error) {
      return next(error);
    }
  };
}

export function validateQuery<T extends ZodTypeAny>(schema: T) {
  return (req: Request, _res: Response, next: NextFunction) => {
    try {
      req.query = parseWithSchema(schema, req.query, "Query");
      return next();
    } catch (error) {
      return next(error);
    }
  };
}

export function validateParams<T extends ZodTypeAny>(schema: T) {
  return (req: Request, _res: Response, next: NextFunction) => {
    try {
      req.params = parseWithSchema(schema, req.params, "Params");
      return next();
    } catch (error) {
      return next(error);
    }
  };
}
