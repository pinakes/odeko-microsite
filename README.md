# Odeko-microsite
## Google Script
This micro CMS is powered by a google doc, and a script makes the google doc available to be processed by the frontend JS
Here's the google script:
```
// Replace with your actual Google Doc ID
const DOC_ID = 'CUSTOMER_DOC_ID';

/**
 * Entry point for JSONP / JSON
 * Usage:
 *   https://…/exec?section=Config&callback=handleConfig
 *   https://…/exec?section=Socials&callback=handleSocials
 *   https://…/exec?section=Posts&callback=handlePosts
 */
function doGet(e) {
  const params  = (e && e.parameter) ? e.parameter : {};
  const section = (params.section || 'Config').toLowerCase();
  const doc     = DocumentApp.openById(DOC_ID);
  const tables  = doc.getBody().getTables();
  let data;

  switch (section) {
    case 'config':
      data = parseKeyValueTable(tables[0]);
      break;
    case 'socials':
      data = parseRows(tables[1]);
      break;
    case 'actions':
      data = parseRows(tables[2]);
      break;
    case 'posts':
      data = parseRows(tables[3]);
      break;
    default:
      data = { error: 'Unknown section' };
  }

  const json = JSON.stringify(data);
  if (params.callback) {
    // JSONP response
    return ContentService
      .createTextOutput(`${params.callback}(${json});`)
      .setMimeType(ContentService.MimeType.JAVASCRIPT);
  } else {
    // Plain JSON fallback
    return ContentService
      .createTextOutput(json)
      .setMimeType(ContentService.MimeType.JSON);
  }
}

/** Parse a 2-column table (key | value) into an object */
function parseKeyValueTable(table) {
  const out = {};
  for (let r = 1; r < table.getNumRows(); r++) {
    const key = table.getCell(r, 0).getText().trim();
    const val = table.getCell(r, 1).getText().trim();
    out[key] = val;
  }
  return out;
}

/** 
 * Parse any table with a header row into an array of objects
 * Now reads each header cell individually to avoid splitting issues.
 */
function parseRows(table) {
  const numCols = table.getRow(0).getNumCells();
  // 1) Read headers
  const headers = [];
  for (let c = 0; c < numCols; c++) {
    headers.push(table.getRow(0).getCell(c).getText().trim());
  }
  // 2) Read data rows
  const data = [];
  for (let r = 1; r < table.getNumRows(); r++) {
    const obj = {};
    for (let c = 0; c < numCols; c++) {
      obj[headers[c]] = table.getCell(r, c).getText().trim();
    }
    data.push(obj);
  }
  return data;
}
```
## Google Doc Template
Here's the google doc template to power the microsite:

**Config**
_(Insert a 2-column table under this heading with headers “key” and “value”)_

| key | value |
| --- | --- |
| heroImageUrl | https://example.com/hero.jpg |
| logoUr l| https://example.com/logo.png |
| siteTitle | Caffè Rosso|
| siteSubtitle | Espresso. Dolce vita. |

[Lost Draft example](https://docs.google.com/document/d/1_leREEVIsV2zrhAt8f7PfHWG3sBh9APctgvRd4VNPnc/edit?tab=t.0)
