import { expect } from "chai";
import axios from "axios";

const API_URL = "https://api.github.com/search/repositories";
const SEARCH_TERM = "create-react-app";

const RATE_LIMIT_ERR_MSG = "Request failed with status code 403";
const RATE_LIMIT_ERR_STATUS_TEXT = "rate limit exceeded";

describe("GitHub Search API Negative Test Cases", function () {
  // Docs - For unauthenticated requests, the rate limit allows you to make up to 10 requests per minute.
  it("should handle rate limit exceeded", async function () {
    try {
      for (let i = 0; i < 20; i++) {
        await axios.get(`${API_URL}?q=${SEARCH_TERM}`);
      }
      expect.fail(
        "Expected request to fail due to rate limit exceeded, but it succeeded."
      );
    } catch (error) {
      expect(error.message).to.equal(RATE_LIMIT_ERR_MSG);
      expect(error.response.status).to.equal(403);
      expect(error.response.statusText).to.equal(RATE_LIMIT_ERR_STATUS_TEXT);
    }
  });
});
