export enum Role {
  ADMIN = "ADMIN",
  AGENT = "AGENT",
  USER = "USER",
}

export enum Approval {
  APPROVE = "APPROVED",
  SUSPEND = "SUSPEND",
}

export enum User_Status {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
  BLOCKED = "BLOCKED",
}

export interface IAuthProvider {
  provider: "google" | "credentials";
  providerId: string;
}

export interface IUser {
  _id?: string;
  name: string;
  phone: string;
  password?: string;
  email?: string;
  picture?: string;
  address?: string;
  role: Role;
  approval: Approval;
  isVerified?: boolean;
  isDeleted?: boolean;
  status?: User_Status;
  auths?: IAuthProvider[];
}
