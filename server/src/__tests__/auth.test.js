import supertest from "supertest";
import app from "../app.js";
import * as AuthService from "../services/auth.service.js";

const testUser = {
  username: "username",
  password: "password",
};

describe("/register", () => {
  describe("given the username and password are valid", () => {
    it("should return 201 status code", async () => {
      const getByUsernameMock = jest
        .spyOn(AuthService, "getByUsername")
        .mockReturnValueOnce(null);

      const createUserMock = jest
        .spyOn(AuthService, "createUser")
        .mockResolvedValue(undefined);

      const { statusCode, body } = await supertest(app)
        .post("/api/register")
        .send(testUser);

      expect(statusCode).toBe(201);
      expect(getByUsernameMock).toHaveBeenCalledWith(testUser.username);
      expect(createUserMock).toHaveBeenCalledTimes(1);
    });
  });
});

describe("/login", () => {
  describe("given the username and password are valid", () => {
    it("should return an accessToken & refreshToken in a set-cookie header", async () => {
      const getByUsernameMock = jest
        .spyOn(AuthService, "getByUsername")
        .mockReturnValueOnce(testUser);

      jest.spyOn(AuthService, "comparePassword").mockReturnValueOnce(true);

      const { statusCode, headers } = await supertest(app)
        .post("/api/login")
        .send(testUser);

      expect(statusCode).toBe(200);
      expect(headers["set-cookie"]).toBeDefined();

      const cookies = headers['set-cookie']
      expect(cookies.some((cookie) => cookie.includes("accessToken="))).toBe(true);
      expect(cookies.some((cookie) => cookie.includes("refreshToken="))).toBe(true);
    });
  });
});
