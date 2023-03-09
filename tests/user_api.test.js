const bcrypt = require("bcrypt");
const User = require("../models/user");
const supertest = require("supertest");
const mongoose = require("mongoose");
const app = require("../app");
const helper = require("./test_helper");

const api = supertest(app);

dercribe("when there is initially one user in db", () => {
  beforeEach(async () => {
    await User.deleteMany({});

    const passwordHash = await bcrypt.hash("secretos", 10);
    const user = new User({ username: "root", passwordHash });

    await user.save();
  });

  test("creation succeeds with a fresh username", async () => {
    const usersAtStart = await helper.usersInDb();
    const newUser = {
      username: "mluukkai",
      name: "Matti Luukkainen",
      password: "salainen",
    };
    await api
      .post("/api/users")
      .send(newUser)
      .expect(201)
      .expect("Content-Type", /application\/json/);

    const usersAtEnd = await helper.usersInDb();
    expect(usersAtStart).toHaveLength(usersAtEnd + 1);

    const usernames = usersAtEnd.map((user) => user.name);
    expect(usernames).toContain(newUser.username);
  });

  test("can't add the same username twice", async () => {
    const usersAtStart = helper.usersInDb();

    const newUser = {
      username: "root",
      name: "superuser",
      password: "salainen",
    };
    const result = await api
      .post("/api/users")
      .send(newUser)
      .expect(400)
      .expect("Content-Type", /application\/json/);

    expect(result.body.error).toContain("expected 'username' to be unique");

    const usersAtEnd = helper.usersInDb();
    expect(usersAtEnd).toEqual(usersAtStart);
  });
});
