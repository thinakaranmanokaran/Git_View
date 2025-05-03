const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const Projects = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    relation: {
      type: String,
      required: true,
    },
    stack: {
      type: String,
      required: true,
    },
    img: {
      type: String, // Storing image URLs
      required: true,
    },
    code: {
      type: String, // GitHub or other repo links
      default: "",
    },
    link: {
      type: String, // Live project link
      default: "",
    },
  },
  { timestamps: true }
);

module.exports = {
  Project: mongoose.model("Project", Projects),
};
