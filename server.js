// db_flow_1.1: server setup with db initialization

import Hapi from "@hapi/hapi";
import Handlebars from "handlebars";
import Cookie from "@hapi/cookie";
import Vision from "@hapi/vision";
import dotenv from "dotenv";
import path from "path";

// my modules
import { routes } from "./routes.js";
import { db } from "./src/models/db.js";

dotenv.config();

// variables
const __dirname = path.resolve();

// Initialize database
await db.init();

//server
const init = async () => {
  const server = Hapi.server({
    port: 3000,
    host: process.env.HOST || "localhost",
    routes: {
      files: {
        relativeTo: __dirname,
      },
    },
  });

  // modules and plugins
  await server.register([
    { plugin: Vision },
    { plugin: Cookie },
  ]);

  // validator
  // server.validate(Joi);

  // hapi Vision configuration for handlebars
  server.views({
    engines: {
      hbs: Handlebars,
    },
    relativeTo: __dirname + "/src",
    path: "views",
    layout: true,
    layoutPath: "./views/layouts",
    partialsPath: "./views/partials",
  });

  // authentication with cookies
  const cookieName = process.env.cookie_name;
  const cookiePassword = process.env.cookie_password;

  server.app.cookieName = cookieName;

  server.auth.strategy("session", "cookie", {
    cookie: {
      name: cookieName,
      password: cookiePassword,
      isSecure: false, // TODO: set to true in production
      path: "/", // I spend 2 days trying to figure out why my cookies didn't work. NO INFORMAITION ONLINE ABOUT PATH USAGE!
    },
    validate: async (request, session) => {
      if (!session || !session.id) {
        return { isValid: false };
      }

      const account = await db.usersStore.getUserById(session.id);
      if (!account) {
        return { isValid: false };
      }
      return { isValid: true, credentials: account };
    },
    redirectTo: "/login",
  });

  server.auth.default("session");

  server.route(routes);

  await server.start();
  console.log("Server running on %s", server.info.uri);
};

process.on("unhandledRejection", (err) => {
  console.log(err);
  process.exit(1);
});

init();
