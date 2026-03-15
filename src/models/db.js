import { connect } from "./mongodb/db.js";
import { usersStore } from "./mongodb/user-mongodb-store.js";
import { pointsStore } from "./mongodb/points-mongodb-store.js"

export const db = {
  usersStore: null,

  async init() {
    let res = false;
    while (!res) {
      res = await connect();
    }
    this.usersStore = usersStore;
    this.pointsStore = pointsStore;
  },
};
