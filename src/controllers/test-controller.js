import { testSchema } from "../models/joi-schema.js";

export const testController = {
  test: (request, h) => {
    const viewData = {
      isAuthenticated: request.auth.isAuthenticated,
    };
    return h.view("./pages/test", { title: "Test", viewData });
  },

  testSubmit: {
    options: {
      auth: false,
      validate: {
        payload: testSchema,
        failAction: (request, h, err) => {
          const viewData = {
            isAuthenticated: request.auth.isAuthenticated,
            infoMessage: err.details[0].message,
            infoClass: "has-text-danger",
          };

          return h.view("./pages/test", { title: "Test", viewData }).takeover();
        },
      },
    },

    handler: (request, h) => {
      console.log("Validated payload:", request.payload);

      const viewData = {
        isAuthenticated: request.auth.isAuthenticated,
        infoMessage: "Success!",
        infoClass: "has-text-success",
      };

      return h.view("./pages/test", {
        title: "Result",
        viewData,
      });
    },
  },
};
