import { User } from "./db.js";

export const usersStore = {
  async getAllUsers() {
    return User.find().lean();
  },

  async getUserByEmail(email) {
    return User.findOne({ email }).lean();
  },

  async getUserByUsername(username) {
    return User.findOne({ username }).lean();
  },

  async getUserById(id) {
    if (!id) return null;
    return User.findById(id).lean();
  },

  async addUser(input) {
    const userExist = await this.userExist(input.email, input.username);
    if (userExist) {
      return null;
    }
    const newUser = new User({
      username: input.username,
      email: input.email,
      password: input.password,
    });
    await newUser.save();
    return newUser.toObject();
  },

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

  async deleteUserById(id) {
    const result = await User.findByIdAndDelete(id);
    return result != null;
  },
};
