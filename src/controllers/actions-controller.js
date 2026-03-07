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
};
