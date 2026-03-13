import User from "../../models/userModel/User.js";

const sanitizeUser = (userDoc) => {
  if (!userDoc) return null;
  const user = userDoc.toObject();
  delete user.password;
  delete user.refreshTokens;
  return user;
};

// @desc   Get all users
// @route  GET /api/users
// @access Protected
const getUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password -refreshTokens");
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc   Create a new user
// @route  POST /api/users
// @access Public
const createUser = async (req, res) => {
  try {
    const { name, email, password, age } = req.body;
    const user = new User({ name, email, password, age });
    const savedUser = await user.save();
    res.status(201).json(sanitizeUser(savedUser));
  } catch (error) {
     if (error.code === 11000 && error.keyPattern && error.keyPattern.email) {
      return res.status(400).json({ message: "Email already exists" });
    }
    res.status(400).json({ message: error.message });
  }
};

// @desc   Update a user
// @route  PUT /api/users/:id
// @access Protected
const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const allowedFields = ["name", "email", "age", "password"];
    const updates = {};
    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    });

    const user = await User.findById(id);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (updates.email) {
      const emailOwner = await User.findOne({ email: updates.email });
      if (emailOwner && emailOwner._id.toString() !== id) {
        return res.status(400).json({ message: "Email already exists" });
      }
    }

    Object.assign(user, updates);
    await user.save();

    res.json(sanitizeUser(user));
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc   Delete a user
// @route  DELETE /api/users/:id
// @access Protected
const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findByIdAndDelete(id);
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json({ message: "User deleted" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export { getUsers, createUser, updateUser, deleteUser };
