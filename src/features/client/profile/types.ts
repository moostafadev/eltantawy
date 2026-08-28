export interface ProfileUser {
  id: string;
  fName: string;
  lName: string;
  email: string;
  phone: string;
  role: "USER" | "ADMIN";
  isVerified: boolean;
  createdAt: Date;
}
