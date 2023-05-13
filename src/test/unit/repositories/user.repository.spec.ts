import "dotenv/config";
import UserRepository from "../../../repositories/user.repository";
import pool from "../../../db/connection";

describe("UserRepository", () => {
  let userRepository: UserRepository;
//   let connection: any;

  beforeAll(async () => {
    userRepository = new UserRepository();
  });

  afterAll(async () => {
    await pool.end()
  });


  describe("findUserById", () => {
    it("should return the user with the given id", async () => {
      const testName = 'test';
      const testId = 1

      // Call the findUserById method with the test user's id
      const result = await userRepository.findUserById(testName);

      // Verify that the returned user matches the test user
      expect(result).toBeDefined();
      expect(result.nickname).toBe("test");
      expect(result.userId).toBe(testId);
    });
  });

  describe("findUserByToken", () => {
    it("should return the user with the given refresh token", async () => {
        const testName = 'test';
        const testId = 1
        const testToken = 'test'

      // Call the findUserByToken method with the test user's refresh token
      const result = await userRepository.findUserByToken(testToken);

      // Verify that the returned user matches the test user
      expect(result).toBeDefined();
      expect(result.nickname).toBe(testName);
      expect(result.userId).toBe(testId);
    });
  });

  describe('deleteRefreshToken', ()=> {
    it('should delete the refresh token', async ()=> {
        const testName = 'test';
        const testId = 1
        await userRepository.deleteRefreshToken(testId)

        const selectResult = await userRepository.findUserById(testName);
        expect(selectResult.refreshtoken).toBe(null);

    })
  })

  describe("updateRefreshToken", () => {
    it("should update the user's refresh token", async () => {
        const testName = 'test';
        const testId = 1

      // Call the updateRefreshToken method with the test user's id and a new refresh token
      const newRefreshToken = "test";
      await userRepository.updateRefreshToken(newRefreshToken, testId);

      // Verify that the user's refresh token was updated in the database
      const selectResult = await userRepository.findUserByToken(newRefreshToken);
      expect(selectResult.refreshtoken).toBe(newRefreshToken);
    });
  });

})