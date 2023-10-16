const mongoose = require("mongoose");
const { Schema } = mongoose;

const replysSchema = new Schema({
  text: String,
  created_on: Date,
  bumped_on: Date,
  reported: Boolean,
  delete_password: String,
  
});

const threadsSchema = new Schema({
  text: String,
  created_on: Date,
  bumped_on: Date,
  reported: Boolean,
  delete_password: String,
  replies: [replysSchema],
  replyCount:Number,
});

const boardSchema = new Schema({
  name: String,
  threads: [threadsSchema],
});

const Boards = mongoose.model('Board', boardSchema);
const Threads = mongoose.model('Thread', threadsSchema);
const Replys = mongoose.model('Reply', replysSchema);

exports.Boards = Boards;
exports.Threads = Threads;
exports.Replys = Replys;
