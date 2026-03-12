import { User } from "./db.js";
import { signupSchema } from "../joi-schema.js";

export const usersStore = {
  // Getters  ==================================================================================================================================

  async getAllUsers() {
    return User.find().lean();
  },

  async getUserByEmail(email) {
    return User.findOne({ email }).lean();
  },

  async getUserByUsername(username) {
    return User.findOne({ username }).lean();
  },

  /**
   *
   * @param {String} id takes String if not then tries to stingify
   * @returns JSON user or null
   */
  async getUserById(id) {
    if (!id) return null;
    if (typeof id != String) {
      id = id.toString();
    }
    return User.findById(id);
  },

  async getApiKeyByUserId(userId) {
    const user = await this.getUserById(userId);
    return user.map_api_key;
  },

  // Add      ==================================================================================================================================
  async addUser(userData) {
    const { error, value } = signupSchema.validate(userData);
    if (error) {
      // console.log(error);
      return null;
    };
    const userExist = await this.userExist(value.email, value.username);
    if (userExist) {
      return null;
    }
    const newUser = new User({
      username: value.username,
      email: value.email,
      password: value.password,
      points: [],
    });
    await newUser.save();
    return newUser.toObject();
  },

  async addApiKey(userId, key) {
    await User.updateOne({ _id: userId }, { map_api_key: key });
    const updatedUser = await this.getUserById(userId);
    return updatedUser;
  },
  // Delete   ==================================================================================================================================

  async deleteUserById(id) {
    const result = await User.findOneAndDelete({ _id: id });
    return result != null;
  },

  // Checkers ==================================================================================================================================

  async userExist(email, username) {
    const byEmail = await this.getUserByEmail(email);
    if (byEmail) return byEmail;
    return this.getUserByUsername(username);
  },

  async credentialsCheck(email, username, pass) {
    const user = await this.userExist(email, username);
    if (user && user.password === pass) {
      return user;
    }
    return null;
  },

  async userIsAdmin(uid) {
    const isAdmin = await User.findOne(
      { _id: uid },
      { isAdmin: 1, _id: 0 },
    ).lean();
    return isAdmin["isAdmin"];
  },
};
