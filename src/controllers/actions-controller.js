import { db } from "../models/db.js";
import { pointSchema } from "../models/joi-schema.js";

export const actionsController = {
  addApiKey: {
    handler: async (request, h) => {
      const userId = request.auth.credentials._id;
      const apiKey = request.payload.MAP_API_KEY; // TODO: add trunkate(delete spaces)
      // console.log(userId, apiKey)

      if (!apiKey) {
        return h.redirect("/account?error=empty");
      }

      await db.usersStore.addApiKey(userId, apiKey);
      return h.redirect("/account?info=success");
    },
  },

  addPoint: {
    validate: {
      payload: pointSchema,
      failAction: (request, h, err) => {
        const viewData = {
          isAuthenticated: request.auth.isAuthenticated,
          infoMessage: err.details[0].message,
          infoClass: "has-text-danger",
        };
        return h
          .view("./dashboard", { title: "Dashboard", viewData })
          .takeover();
      },
    },
    handler: async (request, h) => {

      const pointData = {
      owner: request.auth.credentials._id,
      pos: { 
        lat: request.payload.lat,
        lon: request.payload.lon,
      },
      data: {
        name: request.payload.name,
        description: request.payload.description,
        categories: request.payload.categories // this will be a personal category name for user to be able to filter points on map by category
      },
      }

      // console.log(pointData);

      await db.pointsStore.addPoint(pointData);

      return h.redirect("/dashboard");
    }
  }
};
