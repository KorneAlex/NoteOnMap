import M from "mocha";
import { assert } from "chai";
import { db } from "../src/models/db.js";
import { usersStore } from "../src/models/mongodb/user-mongodb-store.js";
import { pointsStore } from "../src/models/mongodb/points-mongodb-store.js";
import { testData as td } from "../test/data-for-tests.js";

export const mongodbTests = M.suite("MongoDB Tests", () => {
  M.beforeEach(async () => {
    await db.init();
  });
  // Users
  M.describe("Users Collection", () => {
    M.afterEach(async () => {
      const user = await usersStore.getUserByEmail(td[0].testUser.email);
      if (user) {
        await usersStore.deleteUserById(user._id);
      }
    });

    M.it("1. should create a new user", async () => {
      const newUser = await usersStore.addUser(td[0].testUser);
      assert.isNotNull(newUser._id, "User ID should not be null");
      assert.equal(newUser.username, td[0].testUser.username);
      assert.equal(newUser.email, td[0].testUser.email);
      assert.equal(newUser.password, td[0].testUser.password);
    });

    M.it("2. should retrieve a user by email", async () => {
      await usersStore.addUser(td[0].testUser);
      const user = await usersStore.getUserByEmail(td[0].testUser.email);
      assert.isNotNull(user, "User should be found");
      assert.equal(user.username, td[0].testUser.username);
      assert.equal(user.email, td[0].testUser.email);
    });

    M.it("3. delete a user by email", async () => {
      const user = await usersStore.getUserByEmail(td[0].testUser.email);
      if (user) {
        await usersStore.deleteUserById(user._id);
      }
    });
  });
  // Points
  M.describe("Points collection", () => {
    M.it("1. Create point with correct data", async () => {
      const newUser = await usersStore.addUser(td[0].testUser);
      const uid = newUser["_id"].toString();
      // console.log("newUser:", newUser['_id'].toString());
      // console.log("uid:", uid);
      const pointData = {
        ...td[0].testPointCorrect1,
        owner: uid,
      };
      // console.log("pointData:", pointData);
      const newPoint = await pointsStore.addPoint(pointData);
      // console.log("newPoint: ", newPoint);
      assert.isNotNull(newPoint["_id"], "Point ID should not be null");
      assert.isNotNull(
        newPoint.time.created,
        "Time created should not be null",
      );
      assert.strictEqual(newPoint.data.name, pointData.data.name);
      assert.strictEqual(newPoint.data.description, pointData.data.description);
      assert.deepEqual(newPoint.data.categories, pointData.data.categories);
      assert.strictEqual(newPoint.pos.lat, pointData.pos.lat);
      assert.strictEqual(newPoint.pos.lon, pointData.pos.lon);
    });
    M.it("2. Edit point", () => {});
    M.it("3. Get point", () => {});
    M.it("4. Delete point", () => {});
    M.it("5. Create a point with unacceptible info", () => {});
  });
});
