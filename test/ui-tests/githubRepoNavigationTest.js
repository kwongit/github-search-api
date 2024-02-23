import { expect } from "chai";
import { Builder, Capabilities } from "selenium-webdriver";

const GITHUB_URL = "https://github.com";
const REPO_NAME = "facebook/create-react-app";
const NON_EXISTENT_REPO_NAME = "invaliduser/invalid-repo";
const PAGE_TITLE =
  "GitHub - facebook/create-react-app: Set up a modern web app by running one command.";
const NOT_FOUND_PAGE_TITLE = "Page not found · GitHub · GitHub";

describe("GitHub Repo UI Navigation Tests", function () {
  let driver;

  before(async function () {
    driver = await new Builder()
      .withCapabilities(Capabilities.chrome())
      .build();
  });

  after(async function () {
    await driver.quit();
  });

  // Positive test cases
  it("should navigate directly to the GitHub repository page", async function () {
    await driver.get(`${GITHUB_URL}/${REPO_NAME}`);

    // check page title
    const pageTitle = await driver.getTitle();
    expect(pageTitle).to.equal(PAGE_TITLE);

    // check main container
    const pageMainContainerElement = await driver.findElement({
      id: "js-repo-pjax-container",
    });
    expect(await pageMainContainerElement.isDisplayed()).to.be.true;

    // check page url
    const pageUrl = await driver.getCurrentUrl();
    expect(pageUrl).to.equal(`${GITHUB_URL}/${REPO_NAME}`);
  });

  // Negative test cases
  it("should handle 404 error for non-existent repo", async function () {
    await driver.get(`${GITHUB_URL}/${NON_EXISTENT_REPO_NAME}`);

    // check page title
    const pageTitle = await driver.getTitle();
    expect(pageTitle).to.equal(NOT_FOUND_PAGE_TITLE);

    // check main container
    const pageMainContainerElement = await driver.findElement({
      className: "font-mktg",
    });
    expect(await pageMainContainerElement.isDisplayed()).to.be.true;
  });
});
