import M from "mocha";
import { assert } from "chai";
import { db } from "../src/models/db.js";

export const userStoreTest = M.suite("User Store Tests", () => {
  M.before(async () => {
    await db.init();
  });

  M.describe("Create Users", () => {

    // users
    const regular = {
      username: "alex",
      email: "alex@test.com",
      password: "password",
      repeatPassword: "password",
    };

    M.it("regular user", async () => {
      const user = await db.usersStore.addUser(regular);
      assert.isNotNull(user, "user was not created");
      assert.equal(user.username, regular.username);
      assert.equal(user.email, regular.email);
    });

    M.it("duplicate email", async () => {
      assert.isNull(await db.usersStore.addUser(regular), "Duplicate email should not be allowed");
    });

    M.after(async () => {
      const users = await db.usersStore.getAllUsers();
      for (const user of users) {
        await db.usersStore.deleteUserById(user._id);
      }
    });
  });
});