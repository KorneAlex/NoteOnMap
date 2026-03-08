import { db } from "../models/db.js";

export const mainController = {
  index: (request, h) => {
    const viewData = {
        isAuthenticated: request.auth.isAuthenticated,
    };
    return h.view("index", {
      title: "Home Page",
      message: `Welcome to the Home Page!`,
      viewData: viewData,
    });
  },

  about: (request, h) => {
    const viewData = {
        isAuthenticated: request.auth.isAuthenticated,
    };
    return h.view("./pages/about", { title: "About The project", viewData: viewData });
  },

  async dashboard(request, h) {
    const points = await db.pointsStore.getAllPointsForUserId(request.auth.credentials.username); // passing points for the current user from the server side to the client side
    const viewData = {
        isAuthenticated: request.auth.isAuthenticated,
        userId: request.auth.credentials._id,
        pointsJson: JSON.stringify(points), // convertting the data to JSON format so the client can work with it
        mapsApiKey: await db.usersStore.getApiKeyByUserId(request.auth.credentials._id)
    };
    return h.view("./pages/dashboard", { title: "Dashboard", viewData: viewData });
  },

  async account(request, h) {
    const viewData = {
        isAuthenticated: request.auth.isAuthenticated,
        mapsApiKey: await db.usersStore.getApiKeyByUserId(request.auth.credentials._id),
        username: request.auth.credentials.username,
    };
    if (request.query.info === "success") {
      viewData.infoMessage = "API key saved successfully!";
      viewData.infoClass = "has-text-success";
    }
    if (request.query.error === "empty") {
      viewData.infoMessage = "Please enter an API key.";
      viewData.infoClass = "has-text-danger";
    }
    return h.view("./pages/account", { title: "Account", viewData: viewData });
  },
};