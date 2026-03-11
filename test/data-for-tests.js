export const testData = [{
  // Users
    testUser: {
      username: "DevTest",
      email: "user1@test1.com",
      password: "123123",
    },
  // Points
    testPointCorrect1 : {
      time: {
        created: new Date(),
      },
      pos: {
        lat: 52,
        lon: -7,
      },
      data: {
        name: "Test1",
        description: "Test1",
        categories: ["DevTest", "test1", "test11"],
      },
    },
    testPointCorrect2 : {
      owner: "Test1",
      time: {
        created: new Date(),
      },
      pos: {
        lat: 52,
        lon: -7,
      },
      data: {
        name: "Test1",
        categories: ["DevTest", "test1", "test11"],
      },
    },
    testPointWrong1 : {
      time: {
        created: new Date(),
      },
      pos: {
        lat: 52,
        lon: -7,
      },
      data: {
        name: "Test1",
        description: "Test1",
        categories: ["DevTest", "test1", "test11"],
      },
    },
    testPointWrong2 : {
      time: {
        created: new Date(),
      },
      pos: {
        lat: 52,
        lon: -7,
      },
      data: {
        name: "Test1",
        description: "Test1",
        categories: ["DevTest", "test1", "test11"],
      },
    },
}];