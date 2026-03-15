import { userApi } from "./src/api/user-api.js";

export const apiRoutes = [
  { method: "POST", path: "/api/users", config: userApi.create },
  { method: "GET", path: "/api/users/getAll", config: userApi.getAll },
  { method: "GET", path: "/api/users/getOne", config: userApi.getOne },
  { method: "PATCH", path: "/api/users", config: userApi.update },
  { method: "DELETE", path: "/api/users", config: userApi.delete },
];
