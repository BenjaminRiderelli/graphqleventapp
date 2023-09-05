import { User } from "../../models/user.js";
import bcrypt from "bcryptjs";



export const authResolver = {
    createUser: async (args) => {
        try {
          const existingUser = await User.findOne({ email: args.userInput.email });
          if (existingUser) {
            throw new Error("user already exists!");
          }
          const hashedPassword = await bcrypt.hash(args.userInput.password, 12);
          const user = new User({
            email: args.userInput.email,
            password: hashedPassword,
          });
          const userResult = await user.save();
          return { ...userResult._doc, password: null };
        } catch (err) {
          throw err;
        }
      },
}