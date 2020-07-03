

// TODO provide url list + title : https://serpapi.com/sports-results
// TODO get page title  :  document.querySelector("#documentation > div.user-h1-wrap > div > h1")
// TODO document.querySelector(".integrationsMountPoint")
// TODO select language: document.querySelector("#integrationsMountPoint-7348 > div > div.code-header > div.code-links > div")
// TODO click to copy code document.querySelector("#integrationsMountPoint-7348 > div > div:nth-child(2) > ul > li > div > button")

const puppeteer = require('puppeteer');
const fs = require('fs')
const languages = [
  "ruby",
  "java",
  "node",
  "dotnet",
  "go",
  "php"
];

// extract the code from a page.
const getCode = async (url, page) => {
  await page.goto(url, {
    waitUntil: 'networkidle0'
  });
  const ctx = await page.evaluate(() => {
    var ts = []
    document.querySelectorAll('h4').forEach((t) => {
      ts.push(t.innerText);
    })
    var ids = []
    document.querySelectorAll('.integrationsMountPoint').forEach((div) => {
      ids.push(div.id);
    })
    return {
      title: ts,
      ids: ids
    }
  });
  // console.log(ctx)
  for (var id of ctx.ids) {
    group = {}
    group.content = []
    group.language = []
    for (var language of languages) {
      await page.select("#" + id + " > div > div.code-header > div.code-links > div > select", language)
      await page.click("#" + id + " > div > div:nth-child(2) > ul > li > div > button")
      var content = await page.evaluate(`(async () => await navigator.clipboard.readText())()`)
      group.content.push(content)
      group.language.push(language)
    }
    ctx[id] = group
  }
  return ctx
}

// mapping
var db = {
  // google: {
  //   code: {},
  //   url: [
  //     "https://serpapi.com/sports-results"
  //   ]
  // }
};

(async () => {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  const context = await browser.defaultBrowserContext()
  await page.goto("https://serpapi.com/search-api")
  var links = await page.evaluate(() => {
    var links = []
    var examples = document.querySelectorAll(".dashboard-submenu-wrap > li > a")
    for (var example of examples) {
      links.push(example.href)
    }
    return links
  })

  const re = /^https:\/\/serpapi.com\/(youtube|yandex|walmart|ebay|bing|google|baidu|yahoo)/i
  const skip = /^https:\/\/serpapi.com\/(searches|invoices|plan|users|extra-credits|manage-api-key|credit-card|dashboard|change-plan)/i
  for (var link of links) {
    if (skip.test(link)) {
      continue
    }
    var engine = "google"
    var r = re.exec(link)
    if (r) {
      engine = r[1]
    }
    if (db[engine] == null) {
      db[engine] = {
        code: [],
        url: []
      }
    }
    db[engine].url.push(link)
  }
  console.log(db)

  for (var engine of Object.keys(db)) {
    // debug only google
    // if (!/google/.test(engine)) {
    //   continue
    // }
    for (var url of db[engine].url) {
      await context.overridePermissions(url, ['clipboard-read'])
      console.log("scrape " + url);
      var code = await getCode(url, page).catch((err) => {
        console.log(err);
      });
      db[engine].code.push(code)
    }
  }
  // save
  var path = "scrape.json"
  try {
    fs.writeFileSync(path, JSON.stringify(db))
  } catch (err) {
    console.error(err)
  }
  console.log("saved " + path)
  browser.close();
})();
