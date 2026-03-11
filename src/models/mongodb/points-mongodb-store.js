import { Point } from "./db.js";
import { User } from "./db.js";
import { db } from "../db.js";

export const pointsStore = {
  // Get      ==================================================================================================================================

  async getAllPoints() {
    const arr = await Point.find().lean();
    // console.log(arr);
    return arr;
  },

  /**
   * Gets points for the user by user id.
   * Returns only the points data for the matching user.
   *
   * Args:
   *   uid: The user id used to look up the user's points.
   *
   * Returns:
   *   An array of points accessable for the specified user.
   */
  async getAllPointsForUserId(uid) {
    const arr = await User.findOne(
      { _id: uid },
      { points: 1, _id: 0 }, // projection. return points without _id
    ).lean(); // get normal js object
    const points = arr["points"];
    let pointsData = [];
    for (let pointId of points) {
      let pointData = await this.getPointDataById(pointId);
      pointsData.push(pointData);
      // console.log(pointData);
    }

    return pointsData;
  },

  async getPointDataById(id) {
    return await Point.findOne({ _id: `${id}` }).lean();
  },

  async getPointById(pid) {
    return Point.findOne({ _id: pid });
  },

  // async getUserById(uid) {
  //   return await User.findOne({"_id": `${uid}`});
  // },

  // Create   ==================================================================================================================================

  async addPoint(pointData) {
    const newPoint = new Point(pointData);
    await newPoint.save();
    const user = await db.usersStore.getUserById(pointData.owner);
    // console.log(user);
    user.points.push(newPoint._id.toString());
    await user.save();
    return newPoint;
  },

  // Update   ==================================================================================================================================
  // Delete   ==================================================================================================================================

  async deletePointById(pid) {
    const point = await Point.findOne({ _id: pid });
    if (point) {
      return await Point.findOneAndDelete({ _id: pid });
    } else {
      return null;
    }
  },

  async deletePointsByCategory(category) {
    const points = await Point.find(
      { "data.categories": category },
    );
    if (!points) {
      console.log("No points found");
      return null;
    } else {
      for (let point of points) {
        await this.deletePointById(point._id.toString());
        console.log("Point ", point._id.toString(), " deleted");
      }
      return points;
    }
  },

  async deletePointsByCategoryForUserId(uid, category) {
    const userPoints = await Point.find(
      { owner: uid },
      { categories: category },
    );
    if (!userPoints) {
      // console.log("No points found");
      return null;
    } else {
      // console.log(userPoints);
      for (let point of userPoints) {
        await this.deletePointById(point._id.toString());
        // console.log("Point ", point._id.toString(), " deleted");
      }
      return userPoints;
    }
  },

  // Checkers ==================================================================================================================================
};
