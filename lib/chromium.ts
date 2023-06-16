import core from "puppeteer-core";
// @ts-ignore
import chrome from "chrome-aws-lambda";

const exePath =
  process.platform === "win32"
    ? "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe"
    : process.platform === "linux"
    ? "/usr/bin/google-chrome"
    : "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";

let _page: core.Page;

async function getPage() {
  if (_page) {
    return _page;
  }
  const browser = await core.launch({
    args: chrome.args,
    executablePath:
      process.env.NODE_ENV === "production"
        ? await chrome.executablePath
        : exePath,
    headless: process.env.NODE_ENV === "production" ? chrome.headless : true,
  });
  _page = await browser.newPage();
  return _page;
}

export async function getScreenshot(url: string) {
  const page = await getPage();
  await page.setViewport({ width: 1200, height: 630 });
  await page.goto(url, {
    waitUntil: "networkidle0",
  });
  const element = await page.$("body");
  return await element?.screenshot({ type: "png" });
}
