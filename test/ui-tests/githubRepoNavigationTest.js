import { expect } from "chai";
import { Builder, Capabilities } from "selenium-webdriver";

const GITHUB_URL = "https://github.com";
const REPO_NAME = "facebook/create-react-app";
const REPO_OWNER = "facebook";
const REPO_PROJ_NAME = "create-react-app";
const NON_EXISTENT_REPO_NAME = "facebook/reactive";
const PAGE_TITLE =
  "GitHub - facebook/create-react-app: Set up a modern web app by running one command.";
const PAGE_TITLE_OWNER_ONLY = "Meta · GitHub";
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
    this.timeout(5000);
    await driver.get(`${GITHUB_URL}/${REPO_NAME}`);

    // check page title
    const pageTitle = await driver.getTitle();
    expect(pageTitle).to.equal(PAGE_TITLE);

    // check header container
    const pageHeaderContainerElement = await driver.findElement({
      className: "position-relative js-header-wrapper",
    });
    expect(await pageHeaderContainerElement.isDisplayed()).to.be.true;

    // check main container
    const pageMainContainerElement = await driver.findElement({
      className: "application-main",
    });
    expect(await pageMainContainerElement.isDisplayed()).to.be.true;

    // check repo container header
    const repoContainerHeaderElement = await driver.findElement({
      id: "repository-container-header",
    });
    expect(await repoContainerHeaderElement.isDisplayed()).to.be.true;
    expect(await repoContainerHeaderElement.getText()).to.contain(REPO_OWNER);
    expect(await repoContainerHeaderElement.getText()).to.contain(
      REPO_PROJ_NAME
    );

    // check green code button
    const greenCodeButtonElement = await driver.findElement({
      id: ":R2il5:",
    });
    expect(await greenCodeButtonElement.isDisplayed()).to.be.true;

    // check folders and files table
    const foldersAndFilesTableElement = await driver.findElement({
      className: "Box-sc-g0xbh4-0 iXWA-dl",
    });
    expect(await foldersAndFilesTableElement.isDisplayed()).to.be.true;

    // check readme section
    const readMeSectionElement = await driver.findElement({
      className: "Box-sc-g0xbh4-0 ehcSsh",
    });
    expect(await readMeSectionElement.isDisplayed()).to.be.true;

    // check sidebar container
    const pageSideBarContainerElement = await driver.findElement({
      className: "Layout-sidebar",
    });
    expect(await pageSideBarContainerElement.isDisplayed()).to.be.true;

    // check footer container
    const pageFooterContainerElement = await driver.findElement({
      className: "footer",
    });
    expect(await pageFooterContainerElement.isDisplayed()).to.be.true;

    // check page url
    const pageUrl = await driver.getCurrentUrl();
    expect(pageUrl).to.equal(`${GITHUB_URL}/${REPO_NAME}`);
  });

  it("should navigate repository owner", async function () {
    await driver.get(`${GITHUB_URL}/${REPO_OWNER}`);

    // check page title
    const pageTitle = await driver.getTitle();
    expect(pageTitle).to.equal(PAGE_TITLE_OWNER_ONLY);

    // check page url
    const pageUrl = await driver.getCurrentUrl();
    expect(pageUrl).to.equal(`${GITHUB_URL}/${REPO_OWNER}`);
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

    // check page url
    const pageUrl = await driver.getCurrentUrl();
    expect(pageUrl).to.equal(`${GITHUB_URL}/${NON_EXISTENT_REPO_NAME}`);
  });
});
