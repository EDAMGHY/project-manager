import { rolesAndPermissions, allPermissions, users } from "@/config";
import { getRoleName } from "@/lib";
import { RolePermission, Permission, Role, User } from "@/models";

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

    // Seed roles and its permissions
    for (const role of rolesAndPermissions) {
      const existingRole = await Role.findOne({ name: role.name });
      let roleId;
      if (!existingRole) {
        const newRole = await Role.create({
          name: role.name,
          description: role.description,
        });
        roleId = newRole._id;
        console.log(`Role ${role.name} created.`);
      } else {
        roleId = existingRole._id;
      }

      // Assign all permissions to role
      for (const permission of role.permissions) {
        const permissionDoc = await Permission.findOne({ name: permission });
        if (permissionDoc) {
          const existingRolePermission = await RolePermission.findOne({
            role: roleId,
            permission: permissionDoc._id,
          });

          if (!existingRolePermission) {
            await RolePermission.create({
              role: roleId,
              permission: permissionDoc._id,
            });
          }
        }
      }
    }

    // Seed users
    for (const user of users) {
      const emailAlreadyExists = await User.findOne({ email: user.email });
      if (!emailAlreadyExists) {
        // First registered user is an admin
        const role = await Role.findOne({
          name: getRoleName(user.username),
        });

        const createdUser = await User.create({
          name: user.name,
          email: user.email,
          username: user.username,
          password: user.password,
          role: role._id,
        });

        console.log(`User ${createdUser.name} created.`);
      }
    }

    console.log(
      "Seeding of users, roles and permissions completed successfully.",
    );
  } catch (error) {
    console.error("Failed to seed users, roles and permissions:", error);
  }
};
