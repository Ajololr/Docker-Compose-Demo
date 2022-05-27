module.exports = {
  async up(db, client) {
    await db
      .collection("todos")
      .insertMany([{ title: "Read book" }, { title: "Do sports" }]);
  },

  async down(db, client) {
    await db.collection("todos").deleteMany({
      title: {
        $in: ["Read book", "Do sports"],
      },
    });
  },
};
