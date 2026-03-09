import { db } from "../models/db.js";

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
    handler: async (request, h) => {

      const pointData = {
      owner: request.auth.credentials._id,
      time: {
        created: new Date(),
      },
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
