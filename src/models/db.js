import { connect } from "./mongodb/db.js";
import { usersStore } from "./mongodb/user-mongodb-store.js";

export const db = {
  usersStore: null,

  async init() {
    await connect();
    this.usersStore = usersStore;
  },
};
