'use strict';

module.exports = (mongoose, createSchema, update) => {
  const UserRoleRuleSchema = createSchema({
    // Becaues MongoDB doesn’t support transactions properly, have to
    // use data structures to imitate them. To do an update to
    // UserRoleRule, first insert a new inactive
    // UserRoleRuleCommit. Then insert a bunch of UserRoleRule
    // referencing it. Then mark the UserRoleRuleCommit active. To
    // load, first find the most recent (sort by _id)
    // UserRoleRuleCommit and load all UserRoleRules matching it.
    _userRoleRuleCommit: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'UserRoleRuleCommit',
    },
    weight: {
      type: Number,
      required: true
    },
    emailRegex: {
      type: String,
      required: true,
      validate: require('./validators/regexp'),
    },
    isAdmin: {
      type: Boolean,
      default: null,
    },
    isUserRuleAdmin: {
      type: Boolean,
      default: null,
    },
    requireProvider: {
      type: String,
      default: null,
    },
  }, {
    // https://stackoverflow.com/q/13133911
    toObject: {
      virtuals: true,
    },
    toJSON: {
      virtuals: true,
    },
  });

  UserRoleRuleSchema.virtual('hardcoded').get(function () {
    return false;
  });

  UserRoleRuleSchema.index({
    _userRoleRuleCommit: 1,
    weight: 1,
  }, {
    unique: true,
  });

  return mongoose.model('UserRoleRule', UserRoleRuleSchema);
};
