import { expect } from "chai";
import axios from "axios";

describe("GitHub Search API Test", function () {
  it("should perform a search on 'create-react-app' and assert the repo description and license from the first result of the response", async function () {
    const apiUrl = "https://api.github.com/search/repositories";
    const searchTerm = "create-react-app";

    const response = await axios.get(`${apiUrl}?q=${searchTerm}`);
    const firstResult = response.data.items[0];

    expect(response.status).to.equal(200);
    expect(response.statusText).to.equal("OK");

    expect(response.request.path).contains(searchTerm);

    expect(response.data.items).to.be.an("array");
    expect(response.data.items.length).to.be.lessThanOrEqual(100);

    expect(firstResult.description).to.be.a("string").and.not.empty;
    expect(firstResult.description).to.equal(
      "Set up a modern web app by running one command."
    );

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
