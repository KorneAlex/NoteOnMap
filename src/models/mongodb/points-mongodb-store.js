import { Point } from "./db.js";

export const pointsStore = {
    async getAllPoints() {
        const arr = await Point.find().lean();
        console.log(arr);
        return arr;
    },

    async getAllPointsForUserId(userName) {
        const arr = await Point.find({owner: userName }).lean();
        console.log(arr);
        return arr;
    }
}