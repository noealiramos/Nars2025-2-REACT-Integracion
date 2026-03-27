import users from "../data/users";

export const fetchUsers = async () => {
  await new Promise((resolve) => setTimeout(resolve, 200));
  return users;
};