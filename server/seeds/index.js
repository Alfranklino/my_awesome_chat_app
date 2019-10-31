const { Pool } = require("pg");
const squel = require("squel").useFlavour("postgres");
const config = require("../config/default.json");

const usersSeeds = [
  {
    fullname: "Alcom",
    email: "alcom@gmail.com",
    password: "1234"
  },
  {
    fullname: "Bill",
    email: "bill@gmail.com",
    password: "abcd"
  },
  {
    fullname: "Gina",
    email: "gina@gmail.com",
    password: "1234"
  },
  {
    fullname: "John",
    email: "john@gmail.com",
    password: "abcd"
  }
];

const messagesSeeds = [
  {
    content: "Here is the first message",
    user_from: 1,
    user_to: 2,
    time_created: "2019-10-31 10:00:00"
  },
  {
    content: "Here is the second message",
    user_from: 3,
    group_to: 1,
    time_created: "2019-10-31 11:10:00"
  },
  {
    content: "Here is the third message",
    user_from: 1,
    user_to: 2,
    time_created: "2019-10-31 12:00:00"
  },
  {
    content: "Here is the fourth message",
    user_from: 1,
    user_to: 2,
    time_created: "2019-10-31 11:15:00"
  },
  {
    content: "Here is the fifth message",
    user_from: 2,
    group_to: 1,
    time_created: "2019-10-31 10:30:00"
  },
  {
    content: "Here is the sixth message",
    user_from: 1,
    user_to: 3,
    time_created: "2019-10-31 10:45:00"
  },
  {
    content: "Here is the seventh message",
    user_from: 2,
    user_to: 1,
    time_created: "2019-10-31 12:10:00"
  }
];

const groupsSeeds = [
  {
    created_by: 1,
    group_title: "This a our first group!",
    time_created: "2019-10-31 09:00:00"
  }
];

const groupsMembersSeeds = [
  {
    member_id: 1,
    group_id: 1,
    time_added: "2019-10-31 09:00:00"
  },
  {
    member_id: 2,
    group_id: 1,
    time_added: "2019-10-31 09:00:00"
  },
  {
    member_id: 3,
    group_id: 1,
    time_added: "2019-10-31 09:00:00"
  }
];

const seed = async () => {
  const pg = await new Pool(config.db).connect();
  try {
    await pg.query("BEGIN");

    // Users Seeds
    console.log("Seeding Users...");
    await Promise.all(
      usersSeeds.map(usersSeed =>
        pg.query(
          squel
            .insert()
            .into("chatwithme.users")
            .setFields(usersSeed)
            .toParam()
        )
      )
    );
    console.log("Seeding Users... [DONE]");

    // Messages Seeds
    console.log("Seeding Messages...");
    await Promise.all(
      messagesSeeds.map(messagesSeed =>
        pg.query(
          squel
            .insert()
            .into("chatwithme.messages")
            .setFields(messagesSeed)
            .toParam()
        )
      )
    );
    console.log("Seeding Messages... [DONE]");

    // Groups Seeds
    console.log("Seeding Groups...");
    await Promise.all(
      groupsSeeds.map(groupsSeed =>
        pg.query(
          squel
            .insert()
            .into("chatwithme.groups")
            .setFields(groupsSeed)
            .toParam()
        )
      )
    );
    console.log("Seeding Groups... [DONE]");

    // Groups Seeds
    console.log("Seeding GroupsMembers...");
    await Promise.all(
      groupsMembersSeeds.map(groupsMembersSeed =>
        pg.query(
          squel
            .insert()
            .into("chatwithme.groupsmembers")
            .setFields(groupsMembersSeed)
            .toParam()
        )
      )
    );
    console.log("Seeding GroupsMembers... [DONE]");

    await pg.query("COMMIT");
  } catch (e) {
    await pg.query("ROLLBACK"); //Reverses the changes in case of an error
    throw e;
  } finally {
    pg.release();
  }
};
seed().catch(e => {
  setImmediate(() => {
    throw e;
  });
});
