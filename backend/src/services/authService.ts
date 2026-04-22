import { Context } from "hono";
import bcrypt from "bcrypt";
import { prisma } from "../db/prisma";
import { Session } from "hono-sessions";
import { registerSchema, loginSchema } from "../schemas/auth.schema";


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
    const body = await c.req.json();

    const parsed = registerSchema.safeParse(body);
    if (!parsed.success) {
      return c.json(
        {
          status: "fail",
          error: {
            message: "Validation failed",
            details: parsed.error.flatten(),
          },
        },
        400
      );
    }

    const { name, email, password, role } = parsed.data;

    const existingUser = await prisma.user.findUnique({ where: { email } });

    if (existingUser) {
      return c.json(
        {
          status: "fail",
          error: { message: "User already exists" },
        },
        400,
      );
    }

    const hashPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password_hash: hashPassword,
        role,
      },
    });

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
    const body = await c.req.json();

    const parsed = loginSchema.safeParse(body);
    if (!parsed.success) {
      return c.json(
        {
          status: "fail",
          error: {
            message: "Validation failed",
            details: parsed.error.flatten(),
          },
        },
        400
      );
    }

    const { email, password } = parsed.data;

    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      return c.json(
        {
          status: "fail",
          error: { message: "Invalid credentials" },
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
