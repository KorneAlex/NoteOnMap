import M from "mocha";
import { assert } from "chai";
import { db } from "../src/models/db.js";
import { usersStore } from "../src/models/mongodb/user-mongodb-store.js";
import { pointsStore } from "../src/models/mongodb/points-mongodb-store.js";
import { testData as td } from "../test/data-for-tests.js";

export const mongodbTests = M.suite("MongoDB Tests", () => {
  M.before(async () => {
    await db.init();
  });
  // Users
  M.describe("Users Collection", () => {
    M.beforeEach(async () => {
      const user = await db.usersStore.getUserByEmail(td[0].testUser.email);
      if (user !== null) {
        // console.log(user);
        const res = await db.usersStore.deleteUserById(user._id.toString());
        // console.log("user already exist");
        // console.log("user deleted:", res);
      }
    });

    M.it("1. should create a new user", async () => {
      const newUser = await usersStore.addUser(td[0].testUser);
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

    M.it("3. delete a user by email", async () => {});
  });

  M.after(async () => {
    const user = await db.usersStore.getUserByEmail(td[0].testUser.email);

    if (user !== null) {
    await db.usersStore.deleteUserById(user._id.toString());
    await db.pointsStore.deletePointsByCategory("DevTest");
    }
  });

  // Points
  M.describe("Points collection", () => {

    M.beforeEach(async () => {
      const user = await db.usersStore.getUserByEmail(td[0].testUser.email);
      if (user !== null) {
        // console.log(user);
        const res = await db.usersStore.deleteUserById(user._id.toString());
        // console.log("user already exist");
        // console.log("user deleted:", res);
      }
    });

    M.it("1. Create point with correct data", async () => {
      const newUser = await usersStore.addUser(td[0].testUser);
      let uid = newUser["_id"].toString();
      const pointData = {
        ...td[0].testPointCorrect1,
        owner: uid,
      };
      const newPoint = await pointsStore.addPoint(pointData);
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
      await pointsStore.deletePointsByCategoryForUserId(uid, "DevTest");
    });

    M.it("2. Edit point", () => {});

    M.it("3. Get points for testUser", async () => {
      const newUser = await usersStore.addUser(td[0].testUser);
      let uid = newUser["_id"].toString();
      const pointData1 = {
        ...td[0].testPointCorrect1,
        owner: uid,
      };
      const pointData2 = {
        ...td[0].testPointCorrect2,
        owner: uid,
      };
      const newPoint1 = await pointsStore.addPoint(pointData1);
      const newPoint2 = await pointsStore.addPoint(pointData2);
      const points = await db.pointsStore.getAllPointsForUserId(uid);
      assert.strictEqual(newPoint1._id.toString(), points[0]._id.toString());
      assert.strictEqual(newPoint2._id.toString(), points[1]._id.toString());
      await pointsStore.deletePointsByCategoryForUserId(uid, "DevTest");

    });

    M.it("4. Delete point by id", async () => {
      const newUser = await usersStore.addUser(td[0].testUser);
      let uid = newUser["_id"].toString();
      const pointData = {
        ...td[0].testPointCorrect1,
        owner: uid,
      };
      const newPoint = await pointsStore.addPoint(pointData);
      await pointsStore.deletePointById(newPoint._id.toString());
    });

    M.it("5. Delete point by category for user id", async () => {
      const newUser = await usersStore.addUser(td[0].testUser);
      let uid = newUser["_id"].toString();
      const pointData = {
        ...td[0].testPointCorrect1,
        owner: uid,
      };
      const newPoint = await pointsStore.addPoint(pointData);
      const category = "DevTest"
      assert.isNotNull(await db.pointsStore.getPointById(newPoint._id.toString()));
      const pointsToDelete = await pointsStore.deletePointsByCategoryForUserId(uid, category);
      if (pointsToDelete == null) {
        console.log("[ TEST5 ] No points Found")
      };
      assert.isNull(await db.pointsStore.getPointById(newPoint._id.toString()));
    });

      M.it("6. Create a point with unacceptible info", () => {});

    M.after(async () => {
      const user = await db.usersStore.getUserByEmail(td[0].testUser.email);

      if (user !== null) {
      await db.usersStore.deleteUserById(user._id.toString());
      }
      await db.pointsStore.deletePointsByCategory("DevTest");
    });
  });
});
