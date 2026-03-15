import Boom from "@hapi/boom";
import { db } from "../models/db.js";

export const userApi = {
  create: {
    auth: false,
    handler: async function(request, h) {
      try {
        const user = await db.usersStore.addUser(request.payload);
        if (user) {
          return h.response(user).code(201);
        }
        return Boom.badImplementation("error creating user");
      } catch (err) {
        return Boom.serverUnavailable("Database Error");
      }
    },
  },

  find: {
    auth: false,
    handler: async function(request, h) {
      try {
        const users = await db.usersStore.getAllUsers();
        return users;
      } catch (err) {
        console.log("[ API FIND ]");
        return Boom.serverUnavailable("Database Error");
      }
    },
  },

  delete: {
    auth: false,
    handler: async function(request, h) {
      try {
        console.log("DELETE HANDLER user-api", request.query.id)
        return await db.usersStore.deleteUserById(request.query.id);
      } catch (err) {
        console.log("[ API FIND ] ", err);
        return Boom.serverUnavailable("Database Error");
      }
    },
  },
};
