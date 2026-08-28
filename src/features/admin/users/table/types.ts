import { getUsers } from "./user.service";

export type User = Awaited<ReturnType<typeof getUsers>>[number];
