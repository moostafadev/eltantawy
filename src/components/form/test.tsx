"use client";

import Form from "./Main";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "../input";
import { Button } from "../button";

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, "This field is required")
    .email("Invalid email address"),

  password: z
    .string()
    .min(1, "This field is required")
    .min(8, "Password must be at least 8 characters"),
});

export type LoginForm = z.infer<typeof loginSchema>;

const Test = () => {
  const handleSubmit = (data: LoginForm) => {
    console.log(data);
  };

  return (
    <Form<LoginForm>
      onSubmit={handleSubmit}
      resolver={zodResolver(loginSchema)}
      defaultValues={{
        email: "",
        password: "",
      }}
    >
      <Input<LoginForm>
        name="email"
        label="Email"
        placeholder="Enter your email"
      />

      <Input<LoginForm>
        name="password"
        label="Password"
        placeholder="Enter your password"
        type="password"
      />

      <Button type="submit" color="MAIN">
        Login
      </Button>
    </Form>
  );
};

export default Test;
