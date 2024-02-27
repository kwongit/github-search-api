import { expect } from "chai";
import axios from "axios";
import MockAdapter from "axios-mock-adapter";

const API_URL = "https://api.github.com/search/repositories";
const SEARCH_TERM = "create-react-app";
const EMPTY_SEARCH_TERM = "";
const EMPTY_SEARCH_TERM_ERR_MSG = "Request failed with status code 422";
const EMPTY_SEARCH_TERM_ERR_STATUS_TEXT = "Unprocessable Entity";
const EMPTY_SEARCH_TERM_ERR_RESP_MSG = "Validation Failed";
let UNDEFINED_SEARCH_TERM;
const NON_MATCH_SEARCH_TERM = "vzXRvql9Hb";
const SPECIAL_CHAR_SEARCH_TERM = "~!@%23$%^%26*()_+-=";
const SPECIAL_CHAR_SEARCH_TERM_ERR_MSG = "Request failed with status code 400";
const SPECIAL_CHAR_SEARCH_TERM_ERR_STATUS_TEXT = "Bad Request";
const MOCKED_304_ERR_MSG = "Request failed with status code 304";
const MOCKED_304_ERR_TXT = "Not modified";
const MOCKED_503_ERR_MSG = "Request failed with status code 503";
const MOCKED_503_ERR_TXT = "Service unavailable";

async function searchRepositories(searchTerm) {
  const response = await axios.get(`${API_URL}/?q=${searchTerm}`);
  return response;
}

// Positive test cases
describe("GitHub Search API Positive Test Cases", function () {
  // valid string
  it("should handle valid search term", async function () {
    // const response = await axios.get(`${API_URL}?q=${SEARCH_TERM}`);
    const response = searchRepositories(SEARCH_TERM);

    expect(response.status).to.equal(200);
    expect(response.statusText).to.equal("OK");
    expect(response.request.path).contains(SEARCH_TERM);
    expect(response.data.items).to.be.an("array");
    expect(response.data.items.length).to.be.greaterThanOrEqual(30); // Docs - Default: 30

    const firstResult = response.data.items[0];

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
  // empty string
  it("should handle empty search term", async function () {
    try {
      // const response = await axios.get(`${API_URL}?q=${EMPTY_SEARCH_TERM}`);
      const response = searchRepositories(EMPTY_SEARCH_TERM);
      expect.fail(
        "Expected request to fail due to empty search term, but it succeeded."
      );
    } catch (error) {
      expect(error.message).to.equal(EMPTY_SEARCH_TERM_ERR_MSG);
      expect(error.response.status).to.equal(422);
      expect(error.response.statusText).to.equal(
        EMPTY_SEARCH_TERM_ERR_STATUS_TEXT
      );
      expect(error.response.data.message).to.equal(
        EMPTY_SEARCH_TERM_ERR_RESP_MSG
      );
      expect(error.response.data.errors).to.be.an("array").and.not.empty;
      expect(error.response.data.errors[0]).to.be.an("object").and.not.empty;
      expect(error.response.data.errors[0])
        .to.have.property("resource")
        .and.to.equal("Search");
      expect(error.response.data.errors[0])
        .to.have.property("field")
        .and.to.equal("q");
      expect(error.response.data.errors[0])
        .to.have.property("code")
        .and.to.equal("missing");
    }
  });

  // undefined
  it("should handle undefined search term", async function () {
    // const response = await axios.get(`${API_URL}?q=${UNDEFINED_SEARCH_TERM}`);
    const response = searchRepositories(UNDEFINED_SEARCH_TERM);

    expect(response.status).to.equal(200);
    expect(response.statusText).to.equal("OK");
    expect(response.request.path).contains(UNDEFINED_SEARCH_TERM);
    expect(response.data.items).to.be.an("array");
    expect(response.data.items.length).to.be.greaterThanOrEqual(30); // Docs - Default: 30
  });

  // random string
  it("should handle non-match search term", async function () {
    // const response = await axios.get(`${API_URL}?q=${NON_MATCH_SEARCH_TERM}`);
    const response = searchRepositories(NON_MATCH_SEARCH_TERM);

    expect(response.status).to.equal(200);
    expect(response.statusText).to.equal("OK");
    expect(response.request.path).contains(NON_MATCH_SEARCH_TERM);

    expect(response.data).to.be.an("object").and.not.empty;
    expect(response.data).to.have.property("total_count").and.to.equal(0);
    expect(response.data)
      .to.have.property("incomplete_results")
      .and.to.equal(false);
    expect(response.data).to.have.property("items").and.empty;
  });

  // special characters
  it("should handle special character search term", async function () {
    try {
      // const response = await axios.get(
      //   `${API_URL}?q=${SPECIAL_CHAR_SEARCH_TERM}`
      // );
      const response = searchRepositories(SPECIAL_CHAR_SEARCH_TERM);
      expect.fail(
        "Expected request to fail due to special characters search term, but it succeeded."
      );
    } catch (error) {
      expect(error.message).to.equal(SPECIAL_CHAR_SEARCH_TERM_ERR_MSG);
      expect(error.response.status).to.equal(400);
      expect(error.response.statusText).to.equal(
        SPECIAL_CHAR_SEARCH_TERM_ERR_STATUS_TEXT
      );
      expect(error.response.data).to.be.empty;
    }
  });

  // 304 - Not modified
  it("should handle 304 response", async function () {
    const mock = new MockAdapter(axios);
    mock.onGet(`${API_URL}?q=${SEARCH_TERM}`).reply(304, MOCKED_304_ERR_TXT);

    try {
      // const response = await axios.get(`${API_URL}?q=${SEARCH_TERM}`);
      const response = searchRepositories(SEARCH_TERM);
      expect.fail(
        "Expected request to fail due to mocked 304 response, but it succeeded."
      );
    } catch (error) {
      expect(error.message).to.equal(MOCKED_304_ERR_MSG);
      expect(error.response.status).to.equal(304);
      expect(error.response.data).to.equal(MOCKED_304_ERR_TXT);
    }
  });

  // 503 - Service unavaible
  it("should handle 503 response", async function () {
    const mock = new MockAdapter(axios);
    mock.onGet(`${API_URL}?q=${SEARCH_TERM}`).reply(503, MOCKED_503_ERR_TXT);

    try {
      // const response = await axios.get(`${API_URL}?q=${SEARCH_TERM}`);
      const response = searchRepositories(SEARCH_TERM);
      expect.fail(
        "Expected request to fail due to mocked 503 response, but it succeeded."
      );
    } catch (error) {
      expect(error.message).to.equal(MOCKED_503_ERR_MSG);
      expect(error.response.status).to.equal(503);
      expect(error.response.data).to.equal(MOCKED_503_ERR_TXT);
    }
  });
});
