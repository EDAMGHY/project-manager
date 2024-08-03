import { responseObject } from "@/lib";
import { Response } from "express";
import { IFilterExpress, ISortExpress, Request } from "@/types";
import { Permission, Role, RolePermission } from "@/models";
import * as CustomAPIError from "@/errors";
import { StatusCodes } from "http-status-codes";

/**
 *
 * Create a new role
 * @param req: Request
 * @param res: Response
 * @route POST /api/v1/roles
 * @access Authenticated - PERMISSION : CREATE_ROLE
 */
export const createRole = async (req: Request, res: Response) => {
  const { name, description, permissions = [] } = req.body;

  const role = await Role.create({
    name,
    description,
  });

  const permissionIds = await await Promise.all(
    permissions?.map(async (permission: string) => {
      const perm = await Permission.findOne({
        name: permission,
      });

      return perm.id;
    }) || [],
  );

  permissionIds.forEach(async (permission: string) => {
    const existingRolePermission = await RolePermission.findOne({
      role: role._id,
      permission,
    });
    if (!existingRolePermission) {
      await RolePermission.create({
        role: role._id,
        permission,
      });
    }
  });

  const rolePermissions = await RolePermission.find({
    role: role._id,
  }).populate("permission");

  res.status(StatusCodes.CREATED).json(
    responseObject("Role Created Successfully...", {
      role,
      permissions: rolePermissions.map((rp) => rp.permission?.name),
      permission: req.permission,
    }),
  );
};
/**
 *
 * get all roles
 * @param req: Request
 * @param res: Response
 * @route GET /api/v1/roles
 * @access Authenticated - PERMISSION : GET_ROLES
 */
export const getRoles = async (req: Request, res: Response) => {
  const { name, description, sort = "createdAt", order = "desc" } = req.query;
  // Filter setup
  const filters: IFilterExpress[] = [];

  // Add other filters as needed
  if (name) filters.push({ name: { $regex: `.*${name}.*`, $options: "i" } });
  if (description)
    filters.push({
      description: { $regex: `.*${description}.*`, $options: "i" },
    });

  //handle Error if no filters are provided
  // "message": "$and/$or/$nor must be a nonempty array",
  let obj = {};
  if (filters.length > 0) {
    obj = { $and: filters };
  }

  // Sorting setup
  const key = sort.toString();
  const value = order as "desc" | "asc";
  const sorting: ISortExpress = { [key]: value };

  // fetch roles
  const roles = await Role.find(obj).sort(sorting);

  const allRoles = await Promise.all(
    roles?.map(async (role) => {
      const rolePermissions = await RolePermission.find({
        role: role._id,
      }).populate("permission");

      const obj = {
        _id: role.id,
        name: role.name,
        description: role.description,
        permissions: rolePermissions.map((rp) => rp.permission?.name),
        createdAt: role.createdAt,
        updatedAt: role.updatedAt,
      };
      return obj;
    }) || [],
  );

  res.status(StatusCodes.OK).json(
    responseObject("Roles Fetched Successfully...", {
      roles: allRoles,
      permission: req.permission,
    }),
  );
};

/**
 * Get a role
 * @param req: Request
 * @param res: Response
 * @route GET /api/v1/roles/:id
 * @access Authenticated - PERMISSION : GET_ROLE
 */
export const getRole = async (req: Request, res: Response) => {
  const roleId = req.params?.id;

  const role = await Role.findById(roleId);

  if (!role) {
    throw new CustomAPIError.NotFoundError(
      `No role found with the id of ${roleId}`,
    );
  }

  const rolePermissions = await RolePermission.find({
    role: role._id,
  }).populate("permission");

  res.status(StatusCodes.OK).json(
    responseObject(`Role with ID: ${roleId} Fetched Successfully...`, {
      role,
      permissions: rolePermissions.map((rp) => rp.permission?.name),

      permission: req.permission,
    }),
  );
};

/**
 *
 * Edit a role
 * @param req: Request
 * @param res: Response
 * @route PUT /api/v1/roles/:id
 * @access Authenticated - PERMISSION : EDIT_ROLE
 */
export const editRole = async (req: Request, res: Response) => {
  const { name, description, permissions = [] } = req.body;
  const roleId = req.params?.id;

  const role = await Role.findById(roleId);

  if (!role) {
    throw new CustomAPIError.NotFoundError(
      `No role found with the id of ${roleId}`,
    );
  }

  if (name) role.name = name;
  if (description) role.description = description;

  const permissionIds = await await Promise.all(
    permissions?.map(async (permission: string) => {
      const perm = await Permission.findOne({
        name: permission,
      });

      return perm.id;
    }) || [],
  );

  permissionIds?.forEach(async (permission: string) => {
    const existingRolePermission = await RolePermission.findOne({
      role: role._id,
      permission,
    });
    if (!existingRolePermission) {
      await RolePermission.create({
        role: role._id,
        permission,
      });
    }
  });

  await role.save();

  const rolePermissions = await RolePermission.find({
    role: role._id,
  }).populate("permission");

  res.status(StatusCodes.OK).json(
    responseObject("Role Edited Successfully...", {
      role,
      permissions: rolePermissions.map((rp) => rp.permission?.name),
      permission: req.permission,
    }),
  );
};

/**
 *
 * Delete a role
 * @param req: Request
 * @param res: Response
 * @route DELETE /api/v1/roles/:id
 * @access Authenticated - PERMISSION : DELETE_ROLE
 */
export const deleteRole = async (req: Request, res: Response) => {
  const roleId = req.params?.id;

  const role = await Role.findById(roleId);

  if (!role) {
    throw new CustomAPIError.NotFoundError(
      `No role found with the id of ${roleId}`,
    );
  }

  // remove related role permissions
  await RolePermission.deleteMany({
    role: role._id,
  });

  await role.deleteOne();
  await RolePermission.deleteMany({ role: role._id });

  res.status(StatusCodes.OK).json(
    responseObject("Role Deleted Successfully...", {
      permission: req.permission,
    }),
  );
};
