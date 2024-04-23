const app = require("./index");
const request = require("supertest");
const { generateRoomId } = require("./room");

//login
describe("Express App Login", () => {
  it("should respond with success message on login with correct credentials", async () => {
    const response = await request(app)
      .post("/api/auth/login")
      .send({ username: "thanhtest", password: "123" });

    expect(response.status).toBe(200);
    expect(response.body.message).toBe("Đăng nhập thành công");
  });

  it("should respond with fail message on login with uncorrect credentials", async () => {
    const response = await request(app)
      .post("/api/auth/login")
      .send({ username: "thanhtest123", password: "123456" });

    expect(response.status).toBe(401);
    expect(response.body.message).toBe("Sai tên đăng nhập hoặc mật khẩu");
  });
});
//register
describe("Express App Register", () => {
  it("should respond with success message on register with correct credentials", async () => {
    const response = await request(app)
      .post("/api/auth/register")
      .send({ username: "tutest2", password: "123", name: "tu" });

    expect(response.status).toBe(200);
    expect(response.body.message).toBe("Đăng ký thành công");
  });

  it("should respond with fall message on register with username already exist", async () => {
    const response = await request(app)
      .post("/api/auth/register")
      .send({ username: "tutest", password: "123", name: "tu" });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Tên đăng nhập đã tồn tại");
  });
});

//roomHandler test
//generate RoomId test
describe("generateRoomId function", () => {
  it("should generate a room ID with correct format", () => {
    const roomId = generateRoomId();
    expect(roomId).toMatch(/^\w{3}-\w{4}$/);
  });
});
