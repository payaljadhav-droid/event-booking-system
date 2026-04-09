import bcrypt from "bcrypt";
import User from "../models/user";
import type { Request, Response } from "express";

export const registerUser = async (req: Request, res: Response) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password || !role) {
      return res.status(400).json({
        status: "fail",
        error: {
          message: "Missing required fields",
        },
      });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        status: "fail",
        error: {
          message: "User already registered",
        },
      });
    }

    const hashPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password_hash: hashPassword,
      role,
    });

    res.status(201).json({
      status: "Success",
      data: {
        message: "User registered successfully",
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
        error: null,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      status: "fail",
      error: {
        message: "Error registering user",
      },
    });
  }
};

export const loginUser = async (req: Request, res: Response) => {
  try {
    console.log("Body: ", req.body);
    const { email, password } = req.body;
    console.log("email: ", req.body.email);
    console.log("password: ", req.body.password);

    if (!email || !password) {
      console.log("Either missing?");
      return res.status(400).json({
        status: "fail",
        error: {
          message: "Missing required feilds",
        },
      });
    }

    const user = await User.findOne({ email });
    console.log("user: ", user);
    if (!user) {
      return res.status(400).json({
        status: "fail",
        error: {
          message: "user not found",
        },
      });
    }

    const isMatch = bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(400).json({
        status: "fail",
        error: {
          message: "invalid credentials",
        },
      });
    }

    req.session.user = {
      id: user._id.toString(),
      role: user.role,
    };

    req.session.save((err) => {
      if (err) console.log(err);
      else console.log("Session saved");
    });

    res.status(200).json({
      status: "success",
      data: {
        message: "Login successful",
        user: {
          id: user._id,
          role: user.role,
        },
      },
    });
  } catch (error) {
    res.status(500).json({
      status: "fail",
      error: {
        message: "Error in login",
      },
    });
  }
};

export const logoutUser = (req: Request, res: Response) => {
  console.log("logout route hits");
  req.session.destroy(() => {
    res.json({
      status: "success",
      data: {
        message: "logout successfully",
      },
    });
  });
};
