export interface IUser {
  id: string;
  name: string;
  email: string;
  password: string;
  birthdate: string;
  passworddefault: boolean;
  balance: number;
}

export interface IUserIdentification {
  name: string;
  id: string;
}

export interface IUserToken {
  id: string;
  name: string;
  exp: number;
  iat: number;
  passwordDefault: boolean;
  birthdate: string;
  adminAccess?: string;
}

export interface DecodedAdminToken {
  adminAccess: string;
  [key: string]: unknown;
}
