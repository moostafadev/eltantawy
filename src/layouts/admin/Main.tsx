import ClientAdmin from "./Client";
import { IProps } from "./types";

const Admin = ({ children }: IProps) => {
  return <ClientAdmin>{children}</ClientAdmin>;
};

export default Admin;
