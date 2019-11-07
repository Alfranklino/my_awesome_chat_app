const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const Promise = require("bluebird");

// var salt = bcrypt.genSaltSync(10);
module.exports = {
  Query: {
    async test(parent, args, context, info) {
      return "Hello World x3";
    },

    async getUsers(parent, args, { postgres, authUtil, app, req }, info) {
      try {
        const query = {
          text: "SELECT * FROM chatwithme.users"
        };

        const result = await postgres.query(query);
        return result.rows;
      } catch (error) {
        console.log("Error:", error.detail);
      }
    },

    async getUserInfo(parent, { input }, { postgres, app, autUtil, req }, info) {
      try {
        const query = {
          text: "SELECT * FROM chatwithme.users AS users WHERE users.id = $1",
          values: [input.userId]
        };

        const result = await postgres.query(query);
        return result ? (result.rows ? result.rows[0] : null) : null;
      } catch (error) {
        console.log("Error:", error.detail);
      }
    },

    async getGroups(parent, args, { postgres, authUtil, app, req }, info) {
      try {
        const query = {
          text: "SELECT * FROM chatwithme.groups"
        };
        const result = await postgres.query(query);
        return result.rows;
      } catch (error) {
        console.log("Error:", error.detail);
      }
    },

    async getMessages(parent, args, { postgres, app, authUtil, req }, info) {
      try {
        const query = {
          text: "SELECT * FROM chatwithme.messages"
        };
        const result = await postgres.query(query);
        return result.rows;
      } catch (error) {
        console.log("Error:", error.detail);
      }
    },

    async getSessions(parent, args, { postgres, app, authUtil, req }, info) {
      try {
        const query = {
          text: "SELECT * FROM chatwithme.usersessions",
          values: []
        };

        const result = await postgres.query(query);
        return result ? result.rows : null;
      } catch (error) {
        console.log("Error:", error.detail);
      }
    }
  },

  User: {
    async groups(parent, args, { postgres, app, authUtil, req }, info) {
      try {
        const query = {
          text:
            "SELECT groups.* FROM chatwithme.groups AS groups INNER JOIN chatwithme.groupsmembers AS groupsmembers ON groups.id = groupsmembers.group_id WHERE groupsmembers.member_id = $1",
          values: [parent.id]
        };

        // console.log("QUERY:", query);

        const result = await postgres.query(query);
        return result ? result.rows : null;
      } catch (error) {
        console.log("Error:", error.detail);
      }
    },
    async messagesSent(parent, args, { postgres, app, authUtil, req }, info) {
      try {
        const query = {
          text: "SELECT * FROM chatwithme.messages AS msgs WHERE msgs.from_user = $1",
          values: [parent.id]
        };
        const result = await postgres.query(query);

        return result ? (result.rows ? result.rows : null) : null;
      } catch (error) {
        console.log("Error:", error.detail);
      }
    },
    async messagesReceived(parent, args, { postgres, app, authUtil, req }, info) {
      try {
        const query = {
          text: "SELECT * FROM chatwithme.messages AS msgs WHERE msgs.to_user = $1",
          values: [parent.id]
        };
        const result = await postgres.query(query);

        return result ? (result.rows ? result.rows : null) : null;
      } catch (error) {
        console.log("Error:", error.detail);
      }
    },
    async sessions(parent, args, { postgres, app, authUtil, req }, info) {
      try {
        const query = {
          text:
            "SELECT sessions.* FROM chatwithme.usersessions AS sessions WHERE sessions.user_id = $1",
          values: [parent.id]
        };

        result = await postgres.query(query);

        return result ? result.rows : null;
      } catch (error) {
        console.log("Error:", error.detail);
      }
    },
    async currentSession(parent, args, { postgres, app, authUtil, req }, info) {
      try {
        const query = {
          text:
            "SELECT sessions.* FROM chatwithme.usersessions AS sessions WHERE sessions.time_start = (SELECT MAX(time_start) FROM chatwithme.usersessions) WHERE sessions.user_id = $1 AND sessions.status = 'CONNECTED'",
          values: [parent.id]
        };

        result = await postgres.query(query);

        return result ? (result.rows ? result.rows[0] : null) : null;
      } catch (error) {
        console.log("Error:", error.detail);
      }
    }
  },

  Group: {
    async members(parent, args, { postgres, app, authUtil, req }, info) {
      try {
        const query = {
          text:
            "SELECT users.* FROM chatwithme.users AS users INNER JOIN chatwithme.groupsmembers AS groupsmembers ON users.id = groupsmembers.member_id WHERE groupsmembers.group_id = $1 ",
          values: [parent.id]
        };
        console.log("Query:", query);
        const result = await postgres.query(query);

        return result ? result.rows : null;
      } catch (error) {
        console.log("Error:", error.detail);
      }
    },
    async messages(parent, args, { postgres, app, autUtil, req }, info) {
      try {
        const query = {
          text:
            "SELECT messages.* FROM chatwithme.messages AS messages WHERE messages.to_group = $1 ",
          values: [parent.id]
        };
        console.log("Query:", query);
        const result = await postgres.query(query);

        return result ? result.rows : null;
      } catch (error) {
        console.log("Error:", error.detail);
      }
    }
  },

  Message: {
    async from_user(parent, args, { postgres, authUtil, app, req }, info) {
      try {
        const query = {
          text: "SELECT * FROM chatwithme.users AS users WHERE users.id = $1", //Normally I should use the memberId as the sender.
          values: [parent.from_user]
        };
        const result = await postgres.query(query);
        return result.rows[0];
      } catch {
        console.log("Error:", error.detail);
      }
    },
    async to_user(parent, args, { postgres, app, authUtil, req }, info) {
      try {
        const query = {
          text: "SELECT * FROM chatwithme.users AS users WHERE users.id = $1",
          values: [parent.to_user]
        };
        const result = await postgres.query(query);

        return result.rows ? result.rows[0] : null;
      } catch (error) {
        console.log("Error:", error.detail);
      }
    },
    async to_group(parent, args, { postgres, app, authUtil, req }, info) {
      try {
        const query = {
          text: "SELECT * FROM chatwithme.groups AS groups WHERE groups.id = $1",
          values: [parent.to_group]
        };
        const result = await postgres.query(query);

        return result.rows ? result.rows[0] : null;
      } catch (error) {
        console.log("Error:", error.detail);
      }
    }
  },
  Session: {
    async user(parent, args, { postgres, app, authUtil, req }, info) {
      try {
        const query = {
          text:
            "SELECT users.* FROM chatwithme.users AS users INNER JOIN chatwithme.usersessions AS sessions ON users.id = $1",
          values: [parent.user_id]
        };
        const result = await postgres.query(query);

        return result.rows ? result.rows[0] : null;
      } catch (error) {
        console.log("Error:", error.detail);
      }
    }
  }
};
