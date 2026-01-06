import { http } from "./http";

export const login = async (email, password) => {
  try {
    const response = await http.post("auth/login", { email, password });
    const { token } = response.data;

    if (!token) {
      throw new Error("No se recibió un token");
    }
    localStorage.setItem("authToken", token);
    await getProfile();
    return token;
  } catch (error) {
    console.error("Error logging in:", error.message);
    throw error;
  }
};

export const getProfile = async () => {
  try {
    const response = await http.get("users/profile");
    const user = response.data.user;

    if (!user) {
      throw new Error("No se pudo obtener el perfil");
    }

    localStorage.setItem("userData", JSON.stringify(user));
    return user;
  } catch (error) {
    console.error("Error fetching profile:", error.message);
    throw error;
  }
};

export const register = async (userData) => {
  try {
    const response = await http.post("auth/register", userData);
    const { token, user } = response.data;

    if (token) {
      localStorage.setItem("authToken", token);
    }
    if (user) {
      localStorage.setItem("userData", JSON.stringify(user));
    }

    return response.data;
  } catch (error) {
    console.error("Error registering:", error.message);
    throw error;
  }
};

export const updateProfile = async (profileData) => {
  try {
    const response = await http.put("users/profile", profileData);
    const user = response.data.user;

    if (user) {
      localStorage.setItem("userData", JSON.stringify(user));
    }

    return user;
  } catch (error) {
    console.error("Error updating profile:", error.message);
    throw error;
  }
};

export const changePassword = async (
  currentPassword,
  newPassword,
  confirmPassword
) => {
  try {
    const response = await http.put("users/change-password", {
      currentPassword,
      newPassword,
      confirmPassword,
    });
    return response.data;
  } catch (error) {
    console.error("Error changing password:", error.message);
    throw error;
  }
};

export const logout = () => {
  localStorage.removeItem("authToken");
  localStorage.removeItem("userData");
};

// Funciones de administración (requieren rol admin)
export const fetchUsers = async (page = 1, limit = 10, role, isActive) => {
  try {
    const params = new URLSearchParams();
    params.append("page", page);
    params.append("limit", limit);
    if (role) params.append("role", role);
    if (isActive !== undefined) params.append("isActive", isActive);

    const response = await http.get(`users?${params}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching users:", error.message);
    throw error;
  }
};

export const searchUsers = async ({
  q = "",
  page = 1,
  limit = 10,
  role,
  isActive,
  sort,
  order,
} = {}) => {
  try {
    const params = new URLSearchParams();
    if (q) params.append("q", q);
    params.append("page", page);
    params.append("limit", limit);
    if (role) params.append("role", role);
    if (isActive !== undefined) params.append("isActive", isActive);
    if (sort) params.append("sort", sort);
    if (order) params.append("order", order);

    const response = await http.get(`users/search?${params}`);
    return response.data;
  } catch (error) {
    console.error("Error searching users:", error.message);
    throw error;
  }
};

export const getUserById = async (userId) => {
  try {
    const response = await http.get(`users/${userId}`);
    return response.data.user;
  } catch (error) {
    console.error("Error fetching user by id:", error.message);
    throw error;
  }
};
