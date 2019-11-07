module.exports = {
  Subscription: {
    count: {
      async subscribe(parent, args, { postgres, app, req, pubsub }, info) {
        let count = 0;

        setInterval(() => {
          count++;
          pubsub.publish("count", {
            count: count
          });
        }, 1000);
        return pubsub.asyncIterator("count");
      }
    },
    listenMessage: {
      async subscribe(parent, { subscribeMessageInfo }, { postgres, app, req, pubsub }, info) {
        let myAsyncIterator;

        subscribeMessageInfo.destination === "USER"
          ? (myAsyncIterator = pubsub.asyncIterator(
              `messageToUser ${subscribeMessageInfo.to_user}`
            ))
          : (myAsyncIterator = pubsub.asyncIterator(
              `messageToGroup ${subscribeMessageInfo.to_group}`
            ));

        return myAsyncIterator;
      }
    }
  }
};
