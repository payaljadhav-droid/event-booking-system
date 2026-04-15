import { Context } from "hono";
import bcrypt from "bcrypt";
import { prisma } from "../db/prisma";
import { Session } from "hono-sessions";

type SessionData = {
  user: {
    id: string;
    role: string;
  };
};

export type AppEnv = {
  Variables: {
    session: Session<SessionData>;
    user?: {
      id: string;
      role: string;
    };
  };
};

export const registerUser = async (c: Context<AppEnv>) => {
  try {
    console.log("user registered 1");
    const { name, email, password, role } = await c.req.json();
    console.log("user registered 2");

    if (!name || !email || !password || !role) {
      return c.json(
        {
          status: "fail",
          error: { message: "Missing required fields" },
        },
        400,
      );
    }
    console.log("user registered 3");

    const existingUser = await prisma.user.findUnique({ where: { email } });

    console.log("user registered 4");
    if (existingUser) {
      console.log("user registered 5");
      return c.json(
        {
          status: "fail",
          error: { message: "User already exists" },
        },
        400,
      );
    }

    console.log("user registered 6");
    const hashPassword = await bcrypt.hash(password, 10);
    console.log("user registered 7");

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password_hash: hashPassword,
        role,
      },
    });

    console.log("user registered 8");
    return c.json(
      {
        status: "success",
        data: {
          message: "User registered",
          user: {
            id: user.id,
            email: user.email,
            role: user.role,
          },
        },
      },
      201,
    );
  } catch (error) {
    return c.json(
      {
        status: "fail",
        error: { message: "Register error" },
      },
      500,
    );
  }
};

export const loginUser = async (c: Context<AppEnv>) => {
  try {
    const { email, password } = await c.req.json();

    if (!email || !password) {
      return c.json(
        {
          status: "fail",
          error: { message: "Missing fields" },
        },
        400,
      );
    }

    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      return c.json(
        {
          status: "fail",
          error: { message: "User not found" },
        },
        400,
      );
    }

    const isMatch = await bcrypt.compare(password, user.password_hash);

    if (!isMatch) {
      return c.json(
        {
          status: "fail",
          error: { message: "Invalid credentials" },
        },
        400,
      );
    }

    const session = c.get("session") as Session<SessionData>;

    session.set("user", {
      id: user.id.toString(),
      role: user.role,
    });

    return c.json({
      status: "success",
      data: {
        message: "Login successful",
        user: {
          id: user.id,
          role: user.role,
          name: user.name,
          email: user.email,
        },
      },
    });
  } catch (error) {
    return c.json(
      {
        status: "fail",
        error: { message: "Login error" },
      },
      500,
    );
  }
};

export const logoutUser = async (c: Context<AppEnv>) => {
  const session = c.get("session") as Session<SessionData>;

  session.deleteSession();

  return c.json({
    status: "success",
    data: { message: "Logged out" },
  });
};
