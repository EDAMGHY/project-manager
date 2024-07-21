export const createTokenUser = (user) => {
  return {
    name: user.name,
    username: user?.username,
    userId: user._id,
    role: user.role,
  };
};
