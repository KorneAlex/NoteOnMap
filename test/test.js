// test all
import { mongodbTests } from "./mongodb-tests.js";
import dotenv from "dotenv";
dotenv.config();

mongodbTests.run();