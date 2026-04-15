import type { Request, Response, NextFunction } from "express";

export const organizerOnly = async (req:Request, res:Response, next:NextFunction) => {
  if (!req.user || req.user.role !== "organizer") {
    return res.status(403).json({
      status: "fail",
      error:{
        message: "Organizers only",
      },
    });
  }
  next();
}