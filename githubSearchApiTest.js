// move this file into test folder?
import { expect } from "chai";
import axios from "axios";

const API_URL = "https://api.github.com/search/repositories";
const SEARCH_TERM = "create-react-app";
const INVALID_SEARCH_TERM = "";

// Positive test cases
describe("GitHub Search API Positive Test Cases", function () {
  it("should perform a search on 'create-react-app' and assert the repo description and license from the first result of the response", async function () {
    const response = await axios.get(`${API_URL}?q=${SEARCH_TERM}`);
    const firstResult = response.data.items[0];

    expect(response.status).to.equal(200);
    expect(response.statusText).to.equal("OK");

    expect(response.request.path).contains(SEARCH_TERM);

    expect(response.data.items).to.be.an("array");
    expect(response.data.items.length).to.be.lessThanOrEqual(100);

    expect(firstResult.description).to.be.a("string").and.not.empty;

    expect(firstResult.license).to.be.an("object").and.not.empty;
    expect(firstResult.license).to.have.property("key").to.be.a("string").and
      .not.empty;
    expect(firstResult.license).to.have.property("name").to.be.a("string").and
      .not.empty;
    expect(firstResult.license).to.have.property("spdx_id").to.be.a("string")
      .and.not.empty;
    expect(firstResult.license).to.have.property("url").to.be.a("string").and
      .not.empty;
    expect(firstResult.license).to.have.property("node_id").to.be.a("string")
      .and.not.empty;
  });
});

// Negative test cases
describe("GitHub Search API Negative Test Cases", function () {
  // Invalid search term
  it("should handle invalid search terms", async function () {
    try {
      const response = await axios.get(`${API_URL}?q=${INVALID_SEARCH_TERM}`);
      expect.fail("Expected request to fail due to invalid search term.");
    } catch (error) {
      expect(error.message).to.equal("Request failed with status code 422");
      expect(error.response.status).to.equal(422);
      expect(error.response.statusText).to.equal("Unprocessable Entity");
    }
  });

  // Rate limiting
  it("should handle API rate limit exceeded", async function () {
    try {
      for (let i = 0; i < 100; i++) {
        await axios.get(`${API_URL}?q=${SEARCH_TERM}`);
      }
      expect.fail("Expected request to fail due to API rate limit exceeded.");
    } catch (error) {
      expect(error.message).to.equal("Request failed with status code 403");
      expect(error.response.status).to.equal(403);
      expect(error.response.statusText).to.equal("rate limit exceeded");
    }
  });
});
