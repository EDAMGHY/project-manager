import { methodMap } from "@/lib";
import { Request as RequestExpress } from "express";

export type METHOD = keyof typeof methodMap;

export interface Request extends RequestExpress {
  permission?: string;
  user?: {
    /**
     * Current user's name
     */
    name: string;
    /**
     * Current user's username
     */
    username: string;
    /**
     * Current user's id
     */
    userId: string;
    /**
     * Current user's role id
     */
    role: string;
    /**
     * IssuedAt timestamp
     */
    iat: number;
    /**
     * Expiry timestamp
     */
    exp: number;
  };
}

export interface IFilterExpress {
  [key: string | number]:
    | {
        $regex?: string;
        $lte?: Date | string;
        $gte?: Date | string;
        $options?: string;
      }
    | string
    | number;
}
export interface ISortExpress {
  [key: string]: "asc" | "desc";
}

export interface IRolesAndPermissions {
  name: string;
  description: string;
  permissions: string[];
}

/**
 * @interface IUser
 * @description User Interface
 * @param {string} name - User's name
 * @param {string} username - User's username
 * @param {string} email - User's email
 * @param {string} password - User's password
 * @param {string} role - User's role
 */
export interface IUser {
  name: string;
  username: string;
  email: string;
  password: string;
  role?: string;
}
