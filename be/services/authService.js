import { badRequest } from "../utils/apiError.js";

const mockUsers = [
  {
    id: "u1",
    fullName: "Demo User",
    email: "user@example.com",
    role: "user",
    avatar: "",
  },
  {
    id: "admin1",
    fullName: "Demo Admin",
    email: "admin@example.com",
    role: "admin",
    avatar: "",
  },
];

function buildAuthResponse(user) {
  return {
    user,
    token: `mock-token-${user.role}`,
  };
}

export function register(payload) {
  if (!payload?.email || !payload?.password) {
    throw badRequest("email and password are required");
  }

  const user = {
    id: `u${mockUsers.length + 1}`,
    fullName: payload.fullName || payload.name || "",
    email: payload.email,
    role: payload.role || "user",
    avatar: "",
  };

  mockUsers.push(user);
  return buildAuthResponse(user);
}

export function login(payload) {
  if (!payload?.email || !payload?.password) {
    throw badRequest("email and password are required");
  }

  const user =
    mockUsers.find((entry) => entry.email === payload.email) || {
      id: "u1",
      fullName: "Demo User",
      email: payload.email,
      role: payload.email.includes("admin") ? "admin" : "user",
      avatar: "",
    };

  return buildAuthResponse(user);
}

export function getCurrentUser() {
  return mockUsers[0];
}
