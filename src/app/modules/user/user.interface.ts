export enum Role {
  ADMIN = "ADMIN",
  AGENT = "AGENT",
  USER = "USER",
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
  name: string;
  email: string;
  password?: string;
  phone?: string;
  picture?: string;
  address?: string;
  role: Role;
  isVerified?: boolean;
  isDeleted?: boolean;
  status?: User_Status;
  auths?: IAuthProvider[];
}
