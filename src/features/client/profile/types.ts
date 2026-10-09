export interface ProfileUser {
  id: string;
  fName: string;
  lName: string;
  phone: string;
  role: "USER" | "ADMIN";
  createdAt: Date;
}
