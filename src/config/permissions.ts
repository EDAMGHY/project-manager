// !CREATE MIDDLEWARE FOR DYNAMICALLY ADDING PERMISSIONS

import { IRolesAndPermissions, IUser } from "@/types";

// USERS
export const GET_USERS = "GET_USERS";
export const GET_USER = "GET_USER";
export const EDIT_USER = "EDIT_USER";
export const EDIT_USER_ROLE = "EDIT_USER_ROLE";
export const DELETE_USER = "DELETE_USER";

//ROLES
export const GET_ROLES = "GET_ROLES";
export const GET_ROLE = "GET_ROLE";
export const CREATE_ROLE = "CREATE_ROLE";
export const EDIT_ROLE = "EDIT_ROLE";
export const DELETE_ROLE = "DELETE_ROLE";

//PERMISSIONS
export const GET_PERMISSIONS = "GET_PERMISSIONS";
export const GET_PERMISSION = "GET_PERMISSION";
// export const CREATE_PERMISSION = "CREATE_PERMISSION";
export const EDIT_PERMISSION = "EDIT_PERMISSION";
// export const DELETE_PERMISSION = "DELETE_PERMISSION";

//TASKS
export const GET_TASKS = "GET_TASKS";
export const GET_TASK = "GET_TASK";
export const CREATE_TASK = "CREATE_TASK";
export const EDIT_TASK = "EDIT_TASK";
export const DELETE_TASK = "DELETE_TASK";

//PROJECTS
export const GET_PROJECTS = "GET_PROJECTS";
export const GET_PROJECT = "GET_PROJECT";
export const CREATE_PROJECT = "CREATE_PROJECT";
export const EDIT_PROJECT = "EDIT_PROJECT";
export const DELETE_PROJECT = "DELETE_PROJECT";

//LOGGER
export const GET_LOGS = "GET_LOGS";
export const GET_LOG = "GET_LOG";
export const DELETE_LOG = "DELETE_LOG";

export const allPermissions = [
  // TASKS
  GET_TASKS,
  GET_TASK,
  CREATE_TASK,
  EDIT_TASK,
  DELETE_TASK,
  // PROJECTS
  GET_PROJECTS,
  GET_PROJECT,
  CREATE_PROJECT,
  EDIT_PROJECT,
  DELETE_PROJECT,
  // USERS
  GET_USERS,
  GET_USER,
  EDIT_USER,
  DELETE_USER,
  // ROLES
  GET_ROLES,
  GET_ROLE,
  CREATE_ROLE,
  EDIT_ROLE,
  EDIT_USER_ROLE,
  DELETE_ROLE,
  // PERMISSIONS
  GET_PERMISSIONS,
  GET_PERMISSION,
  // CREATE_PERMISSION,
  EDIT_PERMISSION,
  // DELETE_PERMISSION,
  // LOGGER
  GET_LOGS,
  GET_LOG,
  DELETE_LOG,
];

// Roles and Permissions
export const rolesAndPermissions: IRolesAndPermissions[] = [
  {
    name: "OWNER",
    description: "Owner Role",
    permissions: [
      // TASKS
      GET_TASKS,
      GET_TASK,
      CREATE_TASK,
      EDIT_TASK,
      DELETE_TASK,
      // PROJECTS
      GET_PROJECTS,
      GET_PROJECT,
      CREATE_PROJECT,
      EDIT_PROJECT,
      DELETE_PROJECT,
      // USERS
      GET_USERS,
      GET_USER,
      EDIT_USER,
      DELETE_USER,
      // ROLES
      GET_ROLES,
      GET_ROLE,
      CREATE_ROLE,
      EDIT_ROLE,
      EDIT_USER_ROLE,
      DELETE_ROLE,
      // PERMISSIONS
      GET_PERMISSIONS,
      GET_PERMISSION,
      // CREATE_PERMISSION,
      EDIT_PERMISSION,
      // DELETE_PERMISSION,
      // LOGGER
      GET_LOGS,
      GET_LOG,
      DELETE_LOG,
    ],
  },
  {
    name: "ADMIN",
    description: "Admin Role",
    permissions: [
      // TASKS
      GET_TASKS,
      GET_TASK,
      CREATE_TASK,
      EDIT_TASK,
      DELETE_TASK,
      // PROJECTS
      GET_PROJECTS,
      GET_PROJECT,
      CREATE_PROJECT,
      EDIT_PROJECT,
      DELETE_PROJECT,
      // USERS
      GET_USERS,
      GET_USER,
      EDIT_USER,
      DELETE_USER,
      // // ROLES
      // GET_ROLES,
      // GET_ROLE,
      // CREATE_ROLE,
      // EDIT_ROLE,
      // DELETE_ROLE,
      // PERMISSIONS
      // GET_PERMISSIONS,
      // GET_PERMISSION,
      // // CREATE_PERMISSION,
      // EDIT_PERMISSION,
      // // DELETE_PERMISSION,
      // // LOGGER
      GET_LOGS,
      GET_LOG,
      DELETE_LOG,
    ],
  },
  {
    name: "USER",
    description: "User Role",
    permissions: [
      // TASKS
      GET_TASKS,
      GET_TASK,
      CREATE_TASK,
      EDIT_TASK,
      DELETE_TASK,
      // PROJECTS
      GET_PROJECTS,
      GET_PROJECT,
      CREATE_PROJECT,
      EDIT_PROJECT,
      DELETE_PROJECT,

      // USER
      EDIT_USER,
      DELETE_USER,
    ],
  },
];

export const users: IUser[] = [
  {
    name: "Abdellah DAMRI",
    username: "edamghy",
    email: "d@gmail.com",
    password: "1234567890",
    // role: "OWNER",
  },
  {
    name: "Eren Yeager",
    username: "erenyeager",
    email: "eren@gmail.com",
    password: "1234567890",
    // role: "ADMIN",
  },
  {
    name: "Tony Stark",
    username: "tonystark",
    email: "stark@gmail.com",
    password: "1234567890",
    // role: "USER",
  },
];
