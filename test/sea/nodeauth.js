import Zen from '../../index.js';
import expect from '../expect.js';
import http from 'http';
import '../../lib/promise.js';
let gunClient, server;

// MOVED TO SEA!!!!!!!

describe("SEA node client auth", () => {
  it("should  start server", done => {
    server = http.createServer().listen(8765, done);

    let gunConfig = {
      web: server
    };

    Zen(gunConfig);
    gunClient = Zen({
      file: "radataclient",
      peers: ["http://localhost:8765/gun"]
    });
  });

  it("should create user", done => {
    gunClient.user().create("gun", "password", res => {
      //console.log({ res });
      expect(res.err).to.equal(undefined);
      done();
    });
  });

  it("should not create new user when exists", done => {
    gunClient2 = Zen({
      file: "radataclient2",
      peers: ["http://localhost:8765/gun"]
    });
    gunClient2.user().create("gun", "password", res => {
      expect(res.err).to.equal("User already created!");
      done();
    });
  });

  it("should auth user", done => {
    gunClient.user().auth("gun", "password", res => {
      expect(res.err).to.equal(undefined);
      done();
    });
  });

  it("should not stuck on null node", async () => {
    const r1 = await gunClient
      .user()
      //.once(console.log)
      .get("test")
      .promPut({ z: 1 });

    const r2 = await gunClient
      .user()
      .get("test")
      .promPut(null);
    const res = await gunClient
      .user()
      .get("test")
      .get("w");
  });

  after(() => {
    server.close(() => {});
    process.exit(-1);
  });
});
