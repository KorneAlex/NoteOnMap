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
    return h.view("./pages/about", {
      title: "About The project",
      viewData: viewData,
    });
  },

  async dashboard(request, h) {
    const userId = request.auth?.credentials?._id;
    const points = await db.pointsStore.getAllPointsForUserId(
      userId.toString(),
    );
    const viewData = {
      isAuthenticated: request.auth.isAuthenticated,
      userId,
      userIsAdmin: await db.usersStore.userIsAdmin(userId),
      pointsJson: JSON.stringify(points),
      mapsApiKey: await db.usersStore.getApiKeyByUserId(userId),
    };
    return h.view("./pages/dashboard", {
      title: "Dashboard",
      isDashboard: true,
      viewData: viewData,
    });
  },

  async account(request, h) {
    const isAdmin = await db.usersStore.userIsAdmin(
      request.auth.credentials._id,
    );
    let users = [];
    if (isAdmin) {
      users = await db.usersStore.getAllUsers();
    }
    const viewData = {
      isAuthenticated: request.auth.isAuthenticated,
      userIsAdmin: isAdmin,
      // TODO: to reduce load on mongodb make requests to local storage. if no local storage try to get it from mongodb
      mapsApiKey: await db.usersStore.getApiKeyByUserId(
        request.auth.credentials._id,
      ),
      username: request.auth.credentials.username,
      users: users,
    };
    // console.log(viewData.username);
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

  async point(request, h) {
      const isAdmin = await db.usersStore.userIsAdmin(
        request.auth.credentials._id,
      );
      const userPoints = await db.pointsStore.getAllPointsIdForUserId(request.auth.credentials._id.toString());
      const pid = request.query.id;
      const viewDataBasic = {
        isAuthenticated: request.auth.isAuthenticated,
        userIsAdmin: isAdmin,
        username: request.auth.credentials.username,
      };

      // console.log("id: ", pid);
      // console.log("UserPoints:", userPoints);

      if (userPoints.includes(pid)) { // https://stackoverflow.com/questions/237104/how-do-i-check-if-an-array-includes-a-value-in-javascript
        // user has the point id in his list
        const point = await db.pointsStore.getPointDataById(pid);
        const viewData = {
            ...viewDataBasic,
            pointData: point
          };
          return h.view("./pages/point", { title: "Point", viewData: viewData });
      } else {
        // user doesn't have the point id in his list
        if (isAdmin) {
          // user is admin
          const point = await db.pointsStore.getPointDataById(pid);
          if (point != null){
            // point exist
            const viewData = {
              ...viewDataBasic,
              pointData: point
            };
            return h.view("./pages/point", { title: "Point", viewData: viewData });
          } else {
            // The point doesn't exist for the admin user.
            const viewData = {
            ...viewDataBasic,
            message: "The point doesn't exist."
            }
            return h.view("./pages/point", { title: "Point", viewData: viewData });
        }
      }
        // Message for the user
        const viewData = {
        ...viewDataBasic,
        message: "The point doesn't exist or you don't have access to this point"
      };
      return h.view("./pages/point", { title: "Point", viewData: viewData });
      }
    }
};
