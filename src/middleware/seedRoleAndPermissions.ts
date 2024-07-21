// seedRoleAndPermissions.ts
import { ownerRole, userRole, allPermissions } from "@/config";
import { RolePermission, Permission, Role } from "@/models";

export const seedRolesAndPermissions = async () => {
  try {
    // Seed permissions
    for (const permission of allPermissions) {
      const existingPermission = await Permission.findOne({ name: permission });
      if (!existingPermission) {
        await Permission.create({ name: permission, description: permission });
        console.log(`Permission ${permission} created.`);
      }
    }

    // Seed owner role and its permissions
    const ownerExistingRole = await Role.findOne({ name: ownerRole.name });
    let ownerRoleId;
    if (!ownerExistingRole) {
      const newOwnerRole = await Role.create({
        name: ownerRole.name,
        description: ownerRole.description,
      });
      ownerRoleId = newOwnerRole._id;
      console.log(`Role ${ownerRole.name} created.`);
    } else {
      ownerRoleId = ownerExistingRole._id;
    }

    // Assign all permissions to owner role
    for (const permission of ownerRole.permissions) {
      const permissionDoc = await Permission.findOne({ name: permission });
      if (permissionDoc) {
        const existingRolePermission = await RolePermission.findOne({
          role: ownerRoleId,
          permission: permissionDoc._id,
        });

        if (!existingRolePermission) {
          await RolePermission.create({
            role: ownerRoleId,
            permission: permissionDoc._id,
          });
        }
      }
    }

    // Seed user role and its permissions
    const userExistingRole = await Role.findOne({ name: userRole.name });
    let userRoleId;
    if (!userExistingRole) {
      const newUserRole = await Role.create({
        name: userRole.name,
        description: userRole.description,
      });
      userRoleId = newUserRole._id;
      console.log(`Role ${userRole.name} created.`);
    } else {
      userRoleId = userExistingRole._id;
    }

    // Assign selected permissions to user role
    for (const permission of userRole.permissions) {
      const permissionDoc = await Permission.findOne({ name: permission });
      if (permissionDoc) {
        const existingRolePermission = await RolePermission.findOne({
          role: userRoleId,
          permission: permissionDoc._id,
        });
        if (!existingRolePermission) {
          await RolePermission.create({
            role: userRoleId,
            permission: permissionDoc._id,
          });
        }
      }
    }

    console.log("Seeding of roles and permissions completed successfully.");
  } catch (error) {
    console.error("Failed to seed roles and permissions:", error);
  }
};
