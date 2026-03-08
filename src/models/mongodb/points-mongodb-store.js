import { Point } from "./db.js";
import { User } from "./db.js";

export const pointsStore = {
  async getAllPoints() {
    const arr = await Point.find().lean();
    console.log(arr);
    return arr;
  },

  /**
   * Gets points for the user by username.
   * Returns only the points data for the matching user.
   *
   * Args:
   *   userName: The username used to look up the user's points.
   *
   * Returns:
   *   An array of points accessable for the specified user.
   */
  async getAllPointsForUserId(userName) {
    const arr = await User.findOne(
      { username: userName },
      { points: 1, _id: 0 }, // projection. return points without _id
    ).lean(); // get normal js object
    const points = arr['points'];
    let pointsData = [];
    for (let pointId of points) {
        let pointData = await this.getPointDataById(pointId)
        pointsData.push(pointData)
        console.log(pointData);
    }

    return pointsData;
  },

  async getPointDataById(id) {
    return await Point.findOne({"_id": `${id}`}).lean();
  }
};
