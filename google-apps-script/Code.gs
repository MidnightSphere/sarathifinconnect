const SHEET_NAME = "Enquiries";

function doGet() {
  return HtmlService.createHtmlOutput(
    "Apps Script is deployed. Website enquiries are submitted with POST.",
  );
}

function authorizeAndTest() {
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  if (!spreadsheet) {
    throw new Error("This script is not attached to the enquiry spreadsheet.");
  }
  const sheet = spreadsheet.getSheetByName(SHEET_NAME);
  if (!sheet) {
    throw new Error('Create a sheet tab named "Enquiries" first.');
  }
  console.log('Authorization successful. Ready to write to "' + SHEET_NAME + '".');
}

function doPost(event) {
  const parameters = event && event.parameter ? event.parameter : {};
  const nonce = parameters.nonce || "";

  try {
    if (!/^[a-f0-9-]{36}$/i.test(nonce)) {
      throw new Error("Invalid submission token.");
    }
    if (parameters.company) {
      return responsePage(nonce, true);
    }

    const name = readField(parameters.name, "name", 200);
    const phone = readField(parameters.phone, "phone", 20);
    const email = readField(parameters.email, "email", 320);
    const loanLabel = readField(parameters.loanLabel, "loan label", 200);
    const amount = readField(parameters.amount, "amount", 100);
    const city = readField(parameters.city, "city", 200);
    const message = readField(parameters.message, "message", 4000);

    if (name.length < 2 || !/^\+91[6-9]\d{9}$/.test(phone)) {
      throw new Error("Please check the name and mobile number.");
    }
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      throw new Error("Please check the email address.");
    }

    const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = spreadsheet && spreadsheet.getSheetByName(SHEET_NAME);
    if (!sheet) {
      throw new Error('Create a sheet tab named "Enquiries" first.');
    }

    sheet.appendRow([
      name,
      phone,
      email,
      loanLabel,
      amount,
      city,
      message,
      new Date(),
    ].map(safeCellValue));

    return responsePage(nonce, true);
  } catch (error) {
    console.error("Enquiry submission failed: " + error.message);
    return responsePage(nonce, false);
  }
}

function readField(value, field, maxLength) {
  if (value === undefined || value === null) return "";
  if (typeof value !== "string" || value.length > maxLength) {
    throw new Error("Invalid " + field + ".");
  }
  return value.trim();
}

function safeCellValue(value) {
  return typeof value === "string" && /^[=+\-@]/.test(value)
    ? "'" + value
    : value;
}

function responsePage(nonce, success) {
  const result = JSON.stringify({
    nonce: nonce,
    success: success,
    error: success ? "" : "Unable to save your enquiry. Please try again.",
  });
  const html = '<!doctype html><html><body><script>' +
    'window.parent.postMessage(' + result + ', "*");' +
    '</script></body></html>';

  return HtmlService.createHtmlOutput(html)
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}
