import { apiClient } from "../api/apiClient";
import { logger } from "../utils/logger";

const PROFILE_KEYS = ["_id", "id", "displayName", "email", "role", "active", "phone", "avatar"];

const isRecord = (value) => value !== null && typeof value === "object" && !Array.isArray(value);

const hasProfileSignals = (value) => PROFILE_KEYS.some((key) => typeof value?.[key] !== "undefined");

const extractProfilePayload = (payload) => {
  if (payload == null) {
    return null;
  }

  if (!isRecord(payload)) {
    throw new Error("Invalid profile response shape");
  }

  const candidates = [payload.data, payload.user, payload];

  for (const candidate of candidates) {
    if (candidate == null) {
      continue;
    }

    if (!isRecord(candidate)) {
      throw new Error("Invalid profile entity shape");
    }

    if (hasProfileSignals(candidate)) {
      return candidate;
    }
  }

  return null;
};

const normalizeUserProfile = (user = {}) => ({
  ...user,
  id: user._id || user.id,
});

export const getCurrentProfile = async () => {
  try {
    const response = await apiClient.get("/users/me");
    const profilePayload = extractProfilePayload(response.data);

    return profilePayload ? normalizeUserProfile(profilePayload) : null;
  } catch (error) {
    logger.error("userService", "Failed to fetch current profile", error.response?.data || error.message);
    throw error;
  }
};

export const updateCurrentProfile = async (payload) => {
  try {
    const response = await apiClient.patch("/users/me", payload);
    const profilePayload = extractProfilePayload(response.data);

    return profilePayload ? normalizeUserProfile(profilePayload) : null;
  } catch (error) {
    logger.error("userService", "Failed to update current profile", error.response?.data || error.message);
    throw error;
  }
};
