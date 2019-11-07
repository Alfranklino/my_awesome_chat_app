const queryResolvers = require("./resolvers/query/queryResolvers");
const mutationResolvers = require("./resolvers/mutation/mutationResolvers");
const subscriptionResolvers = require("./resolvers/subscription/subscriptionResolvers");

module.exports = {
  ...queryResolvers,
  ...mutationResolvers,
  ...subscriptionResolvers
};
