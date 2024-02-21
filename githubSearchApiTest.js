import { expect } from "chai";
import axios from "axios";

describe("GitHub Search API Test", function () {
  it("should perform a search on 'create-react-app' and assert the repo description and license from the first result of the response", async function () {
    const url = "https://api.github.com/search/repositories";
    const searchQuery = "create-react-app";

    const response = await axios.get(`${url}?q=${searchQuery}`);
    const firstResult = response.data.items[0];

    // console.log("Response Object:", response);
    // console.log("Response Object:", response.request);
    // console.log("Response Object:", response.request.path);
    // console.log("Response Object:", response.data.items);
    // console.log("Response Object:", response.data.items.length);
    // console.log("Response Object:", response.data.items[0]);
    // console.log("Response Object:", response.data.items[0].description);
    // console.log("Response Object:", response.data.items[0].license);

    expect(response.status).to.equal(200);
    expect(response.statusText).to.equal("OK");
    expect(response.request.path).contains(searchQuery);
    expect(response.data.items).to.be.an("array");
    expect(response.data.items.length).to.be.lessThanOrEqual(100);
    expect(firstResult.description).to.be.an("string");
    expect(firstResult.description).to.not.be.empty;
    expect(firstResult.license).to.be.an("object");
    expect(firstResult.license).to.not.be.empty;
  });
});
