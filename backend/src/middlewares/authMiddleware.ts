import type { Request, Response, NextFunction } from "express";

export const authMiddleware = async (req:Request, res:Response, next: NextFunction) => {
  
  console.log("SESSION IN MIDDLEWARE:", req.session);
  if (!req.session || !req.session.user) {
    return res.status(401).json({
      status: "fail",
      error:{
        message: "Unauthorized",
      },
    });
  }
  req.user = {
      id: req.session.user.id,
      role: req.session.user.role
  };
  next();
}
