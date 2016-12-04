'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// {
//     chatToken: '12345678',
//     user: 'd71jd81223'
// }

var ChatTokenSchema = new Schema({
  chatToken:{
     require:true,
     type:String,
     index:true
  },
  linkedinId:{
    type:String,
    require:true
  },
  _user: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'User',
    unique:true
  }
}, { timestamps: true });


module.exports = mongoose.model('ChatToken', ChatTokenSchema);