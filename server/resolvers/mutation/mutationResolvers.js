const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const Promise = require("bluebird");

// This Salt is randomly generated each time;
var salt = bcrypt.genSaltSync(10);
module.exports = {
  Mutation: {
    // This Mutation is a combination of a signup + a login from the cookie resulted
    async createNewUser(parent, { userInfo }, { postgres, app, authUtil, req }, info) {
      try {
        const query = {
          text:
            "INSERT INTO chatwithme.users (fullname, password, email) VALUES ($1,$2,$3) RETURNING *",
          values: [userInfo.fullname, userInfo.password, userInfo.email]
        };

        const result = await postgres.query(query);
        return result.rows[0];
      } catch (error) {
        console.log("Error:", error.detail);
      }
    },
    async createNewGroup(parent, args, { postgres, app, authUtil, req }, info) {
      try {
        const query = {
          text: "",
          values: []
        };
        const result = await postgres.query(query);
        return result;
      } catch (error) {
        console.log("Error:", error.detail);
      }
    },
    async sendNewMessage(parent, { messageInfo }, { postgres, app, authUtil, req, pubsub }, info) {
      try {
        let queryText =
          messageInfo.destination === "USER"
            ? "INSERT INTO chatwithme.messages (content, from_user, to_user) VALUES ($1, $2, $3) RETURNING * "
            : "INSERT INTO chatwithme.messages (content, from_user, to_group) VALUES ($1, $2, $3) RETURNING * ";
        let queryValues =
          messageInfo.destination === "USER"
            ? [messageInfo.content, messageInfo.from_user, messageInfo.to_user]
            : [messageInfo.content, messageInfo.from_user, messageInfo.to_group];

        const query = {
          text: queryText,
          values: queryValues
        };
        const result = await postgres.query(query);

        // Implement the subscription here...
        messageInfo.destination === "USER"
          ? (console.log("Message:", result.rows[0]),
            await pubsub.publish(`messageToUser ${messageInfo.to_user}`, {
              listenMessage: result.rows[0]
            }))
          : await pubsub.publish(`messageToGroup ${messageInfo.to_group}`, {
              listenMessage: result.rows[0]
            });
        return result.rows[0];
      } catch (error) {
        console.log("Error:", error.detail);
      }
    },
    async addMemberToGroup(parent, args, { postgres, app, authUtil, req }, info) {
      try {
        const query = {
          text: "",
          values: []
        };
        const result = await postgres.query(query);
        return result;
      } catch (error) {
        console.log("Error:", error.detail);
      }
    },
    async openSession(parent, { openSessionInfo }, { postgres, app, authUtil, req }, info) {
      try {
        const query = {
          text: "INSERT INTO chatwithme.usersessions (user_id, status) VALUES ($1, $2) RETURNING *",
          values: [openSessionInfo.userId, "CONNECTED"]
        };
        const result = await postgres.query(query);
        return result.rows[0];
      } catch (error) {
        console.log("Error:", error.detail);
      }
    },
    async closeSession(parent, { closeSessionInfo }, { postgres, app, authUtil, req }, info) {
      try {
        const query = {
          text:
            "UPDATE chatwithme.usersessions SET status = 'DISCONNECTED', time_end = NOW() WHERE id = $1 RETURNING * ",
          values: [closeSessionInfo.sessionId]
        };

        const result = await postgres.query(query);
        return result.rows[0];
      } catch (error) {
        console.log("Error:", error.detail);
      }
    }
  }
};
