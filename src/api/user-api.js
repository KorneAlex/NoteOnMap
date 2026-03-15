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

  getAll: {
    auth: false,
    handler: async function(request, h) {
      try {
        return await db.usersStore.getAllUsers();
      } catch (err) {
        console.log("[ API getAll ]");
        return Boom.serverUnavailable("Database Error");
      }
    },
  },

  getOne: {
    auth: false,
    handler: async function(request, h) {
      try {
        console.log("[ API getOne ]", request.query.id)
        return await db.usersStore.getUserDataById(request.query.id);
      } catch (err) {
        console.log("[ API getOne ]");
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

  update: {
    auth: false,
    handler: async function(request, h) {
      try {
        console.log("[ API UPDATE user-api ]", request.query.id, request.payload)
        return await db.usersStore.updateUserById(request.query.id, request.payload);
      } catch (err) {
        console.log("[ API UPDATE user-api ] ", err);
        return Boom.serverUnavailable("Database Error");
      }
    },
  },
};
