import { Point } from "./db.js";
import { User } from "./db.js";

export const pointsStore = {
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
    const points = arr['points'];
    let pointsData = [];
    for (let pointId of points) {
        let pointData = await this.getPointDataById(pointId)
        pointsData.push(pointData)
        // console.log(pointData);
    }

    return pointsData;
  },

  async getPointDataById(id) {
    return await Point.findOne({"_id": `${id}`}).lean();
  },

  async addPoint(pointData) {
    const newPoint = new Point(pointData);
    await newPoint.save();
    const user = await this.getUserById(pointData.owner);
    user.points.push(newPoint._id.toString());
    await user.save();
    return newPoint;
  },

  async getUserById(uid) {
    return await User.findOne({"_id": `${uid}`});
  }
};
