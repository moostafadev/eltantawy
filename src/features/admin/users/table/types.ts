import { getUsers, getGuestUsers } from "./user.service";

export type RegisteredUser = Awaited<ReturnType<typeof getUsers>>[number];

export type GuestUser = Awaited<ReturnType<typeof getGuestUsers>>[number];

export type UserRow =
  | { kind: "REGISTERED"; data: RegisteredUser }
  | { kind: "GUEST"; data: GuestUser };
