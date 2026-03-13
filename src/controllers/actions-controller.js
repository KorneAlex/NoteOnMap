import { db } from "../models/db.js";
import { addPointFormSchema } from "../models/joi-schema.js";

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
      payload: addPointFormSchema,
      failAction: (request, h, err) => {
        const viewData = {
          isAuthenticated: request.auth.isAuthenticated,
          infoMessage: err.details[0].message,
          infoClass: "has-text-danger",
        };
        // console.log(err);
        return h
          .view("./pages/account", { title: "Account", viewData })
          .takeover();
      },
    },
    handler: async (request, h) => {
      const { lat, lon, name, description } = request.payload;
      const pointData = {
        owner: request.auth.credentials._id.toString(),
        pos: {
          lat,
          lon,
        },
        data: {
          name,
          description,
          // categories: categories, // used to filter points on map by category
        },
      };

      // console.log(pointData);

      await db.pointsStore.addPoint(pointData);

      return h.redirect("/dashboard");
    },
  },
};
