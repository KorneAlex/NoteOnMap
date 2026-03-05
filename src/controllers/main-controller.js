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

  dashboard: (request, h) => {
    const viewData = {
        isAuthenticated: request.auth.isAuthenticated,
    };
    return h.view("./pages/dashboard", { title: "Dashboard", viewData: viewData });
  },
};