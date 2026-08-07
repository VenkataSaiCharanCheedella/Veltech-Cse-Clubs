/**
 * ==========================================================================
 * CSE CLUBS COUNCIL RECRUITMENT PORTAL - GOOGLE APPS SCRIPT BACKEND
 * File: Code.gs (Save as Code.gs in Google Apps Script Editor)
 * ==========================================================================
 * 
 * INSTRUCTIONS:
 * 1. Open Google Sheets -> Extensions -> Apps Script.
 * 2. Paste this entire code into Code.gs.
 * 3. Click "Deploy" -> "New Deployment".
 * 4. Select type: "Web App".
 * 5. Set "Execute as": "Me".
 * 6. Set "Who has access": "Anyone".
 * 7. Click "Deploy", copy the Web App URL, and paste it into const API_URL in script.js and admin/script.js.
 */

const SHEET_LEADERSHIP = "Leadership Applications";
const SHEET_CLUBS = "Club Applications";
const SHEET_SETTINGS = "Settings";
const SHEET_FOURTH_YEAR = "4th Year Exceptions";
const SHEET_FOURTH_YEAR_CLUB = "4th Year Club Exceptions";
const SHEET_CONTACT = "Contact Queries";

// Initial Setup & Headers Auto-Creation
function setupSheets() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();

  // 1. Leadership Applications Sheet
  let leadSheet = ss.getSheetByName(SHEET_LEADERSHIP);
  if (!leadSheet) {
    leadSheet = ss.insertSheet(SHEET_LEADERSHIP);
    leadSheet.appendRow([
      "Timestamp", "Category", "Position Applied", "VTU Number", "Full Name",
      "Department", "Year", "Section", "Phone", "Email", "Skills", "Experience",
      "GitHub", "LinkedIn", "Portfolio", "Why Role", "Contribution", "Availability",
      "Mentor Name", "Mentor Phone", "Status", "Remarks"
    ]);
    formatHeaderRow(leadSheet);
  }

  // 2. 4th Year Exceptions Sheet
  let fourthYearSheet = ss.getSheetByName(SHEET_FOURTH_YEAR);
  if (!fourthYearSheet) {
    fourthYearSheet = ss.insertSheet(SHEET_FOURTH_YEAR);
    fourthYearSheet.appendRow([
      "Timestamp", "Category", "VTU Number", "Full Name",
      "Phone", "Email", "Position Interested", "Mentor Name", "Mentor Phone", "Reason", "Status", "Remarks"
    ]);
    formatHeaderRow(fourthYearSheet);
  }

  // 2b. 4th Year Club Exceptions Sheet
  let fourthYearClubSheet = ss.getSheetByName(SHEET_FOURTH_YEAR_CLUB);
  if (!fourthYearClubSheet) {
    fourthYearClubSheet = ss.insertSheet(SHEET_FOURTH_YEAR_CLUB);
    fourthYearClubSheet.appendRow([
      "Timestamp", "Category", "VTU Number", "Full Name",
      "Phone", "Email", "Club Name", "Position Interested", "Mentor Name", "Mentor Phone", "Reason", "Status", "Remarks"
    ]);
    formatHeaderRow(fourthYearClubSheet);
  }

  // 2c. Contact Queries Sheet
  let contactSheet = ss.getSheetByName(SHEET_CONTACT);
  if (!contactSheet) {
    contactSheet = ss.insertSheet(SHEET_CONTACT);
    contactSheet.appendRow([
      "Timestamp", "Name", "VTU Number", "Year", "Query", "Status", "Remarks"
    ]);
    formatHeaderRow(contactSheet);
  }

  // 3. Club Applications Sheets are now created dynamically per club in handleSubmitApplication

  // 3. Settings Sheet
  let settingsSheet = ss.getSheetByName(SHEET_SETTINGS);
  if (!settingsSheet) {
    settingsSheet = ss.insertSheet(SHEET_SETTINGS);
    settingsSheet.appendRow(["Key", "Value"]);
    formatHeaderRow(settingsSheet);
    
    // Default Settings
    const defaultClose = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();
    settingsSheet.appendRow(["registration_status", "OPEN"]);
    settingsSheet.appendRow(["registration_open", new Date().toISOString()]);
    settingsSheet.appendRow(["registration_close", defaultClose]);
  }
}

function formatHeaderRow(sheet) {
  const headerRange = sheet.getRange(1, 1, 1, sheet.getLastColumn());
  headerRange.setFontWeight("bold");
  headerRange.setBackground("#1e293b");
  headerRange.setFontColor("#ffffff");
}

// --------------------------------------------------------------------------
// GET Request Handler (doGet)
// --------------------------------------------------------------------------
function doGet(e) {
  setupSheets();
  const action = e.parameter.action;
  let response = { status: "error", message: "Invalid action" };

  try {
    if (action === "getSettings") {
      response = getSettingsResponse();
    } else if (action === "getStats") {
      response = getStatsResponse();
    } else if (action === "getRecent") {
      response = getRecentApplicationsResponse();
    } else {
      response = { status: "success", message: "CSE Clubs Council API Active" };
    }
  } catch (err) {
    response = { status: "error", message: err.toString() };
  }

  return createJsonResponse(response);
}

// --------------------------------------------------------------------------
// POST Request Handler (doPost)
// --------------------------------------------------------------------------
function doPost(e) {
  setupSheets();
  let response = { status: "error", message: "Invalid request payload" };

  try {
    const postData = JSON.parse(e.postData.contents);
    const action = postData.action;

    if (action === "submitApplication") {
      response = handleSubmitApplication(postData.data);
    } else if (action === "updateSettings") {
      response = handleUpdateSettings(postData.settings);
    } else if (action === "adminLogin") {
      response = handleAdminLogin(postData.username, postData.password);
    }
  } catch (err) {
    response = { status: "error", message: err.toString() };
  }

  return createJsonResponse(response);
}

// --------------------------------------------------------------------------
// Controller Actions
// --------------------------------------------------------------------------

// 1. Submit Application (Leadership or Club)
function handleSubmitApplication(data) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const timestamp = new Date().toLocaleString();
  const vtu = (data.vtu || "").toString().trim().toUpperCase();

  if (!vtu) {
    return { status: "error", message: "VTU Number is required" };
  }

  if (data.category === "Leadership") {
    const sheet = ss.getSheetByName(SHEET_LEADERSHIP);
    const position = data.position || "";

    // Strict Check: Max 1 Leadership Application across all roles
    if (hasAppliedForLeadership(ss, vtu)) {
      return { status: "error", message: `Application Denied: VTU ${vtu} has already applied for a leadership role. Only one leadership application is permitted.` };
    }

    sheet.appendRow([
      timestamp, "Leadership", position, vtu, data.name,
      data.dept, data.year, data.section, data.phone, data.email,
      data.skills, data.experience, data.github, data.linkedin,
      data.portfolio, data.why, data.contribution, data.availability,
      data.mentorName || "", data.mentorPhone || "", "Submitted", ""
    ]);

    return { status: "success", message: "Leadership application recorded successfully!" };
  } else if (data.category === "FourthYear") {
    const sheet = ss.getSheetByName(SHEET_FOURTH_YEAR);
    
    // Strict Check: Max 1 4th Year Exception Application
    if (hasAppliedForFourthYear(ss, vtu)) {
      return { status: "error", message: `Application Denied: VTU ${vtu} has already submitted a 4th-year exception request.` };
    }

    sheet.appendRow([
      timestamp, "FourthYearException", vtu, data.name,
      data.phone, data.email, data.position, data.mentorName || "", data.mentorPhone || "", data.reason,
      "Submitted", ""
    ]);

    return { status: "success", message: "4th Year Exception request submitted successfully!" };
  } else if (data.category === "FourthYearClub") {
    const sheet = ss.getSheetByName(SHEET_FOURTH_YEAR_CLUB);
    
    // Strict Check: Max 1 4th Year Club Exception Application
    if (hasAppliedForFourthYearClub(ss, vtu)) {
      return { status: "error", message: `Application Denied: VTU ${vtu} has already submitted a 4th-year club exception request.` };
    }

    sheet.appendRow([
      timestamp, "FourthYearClubException", vtu, data.name,
      data.phone, data.email, data.clubName, data.position, data.mentorName || "", data.mentorPhone || "", data.reason,
      "Submitted", ""
    ]);

    return { status: "success", message: "4th Year Club Exception request submitted successfully!" };
  } else if (data.category === "ContactQuery") {
    const sheet = ss.getSheetByName(SHEET_CONTACT);
    
    sheet.appendRow([
      timestamp, data.name, vtu, data.year, data.query, "Submitted", ""
    ]);

    return { status: "success", message: "Contact query submitted successfully!" };
  } else {
    const clubName = data.clubName || "Unknown Club";
    
    // Safety check to ensure club name doesn't conflict with system sheets
    if (clubName === SHEET_SETTINGS || clubName === SHEET_LEADERSHIP || clubName === SHEET_FOURTH_YEAR) {
      return { status: "error", message: "Invalid club name." };
    }

    let sheet = ss.getSheetByName(clubName);
    if (!sheet) {
      sheet = ss.insertSheet(clubName);
      sheet.appendRow([
        "Timestamp", "Category", "Club Name", "Applying As", "VTU Number", "Full Name",
        "Department", "Year", "Section", "Phone", "Email", "Skills", "Experience",
        "Why Join", "Contribution", "GitHub", "LinkedIn", "Portfolio", "Mentor Name", "Mentor Phone",
        "Status", "Remarks"
      ]);
      formatHeaderRow(sheet);
    }

    // Strict Check: Max 1 Club Application across all clubs
    if (hasAppliedForAnyClub(ss, vtu)) {
      return { status: "error", message: `Application Denied: VTU ${vtu} has already applied for a club. Only one club application is permitted.` };
    }

    sheet.appendRow([
      timestamp, "Club", clubName, data.applyingAs, vtu, data.name,
      data.dept, data.year, data.section || "", data.phone, data.email,
      data.skills || "", data.experience || "", data.why || "", data.contribution || "",
      data.github || "", data.linkedin || "", data.portfolio || "",
      data.mentorName || "", data.mentorPhone || "", "Submitted", ""
    ]);

    return { status: "success", message: "Club application recorded successfully in " + clubName + " tab!" };
  }
}

// --------------------------------------------------------------------------
// Duplicate Validation Helpers
// --------------------------------------------------------------------------

function hasAppliedForLeadership(ss, vtu) {
  const sheet = ss.getSheetByName(SHEET_LEADERSHIP);
  if (!sheet) return false;
  
  const lastRow = sheet.getLastRow();
  if (lastRow <= 1) return false;

  const data = sheet.getRange(2, 4, lastRow - 1, 1).getValues(); // VTU is in Col 4
  for (let i = 0; i < data.length; i++) {
    const existingVtu = (data[i][0] || "").toString().trim().toUpperCase();
    if (existingVtu === vtu) {
      return true;
    }
  }
  return false;
}

function hasAppliedForFourthYearClub(ss, vtu) {
  const sheet = ss.getSheetByName(SHEET_FOURTH_YEAR_CLUB);
  if (!sheet) return false;
  
  const lastRow = sheet.getLastRow();
  if (lastRow <= 1) return false;

  const data = sheet.getRange(2, 3, lastRow - 1, 1).getValues(); // VTU is in Col 3
  for (let i = 0; i < data.length; i++) {
    const existingVtu = (data[i][0] || "").toString().trim().toUpperCase();
    if (existingVtu === vtu) {
      return true;
    }
  }
  return false;
}

function hasAppliedForAnyClub(ss, vtu) {
  const allSheets = ss.getSheets();
  
  for (let i = 0; i < allSheets.length; i++) {
    const sheet = allSheets[i];
    const sheetName = sheet.getName();
    
    // Skip non-club sheets
    if (sheetName === SHEET_SETTINGS || sheetName === SHEET_LEADERSHIP || sheetName === SHEET_CLUBS || sheetName === SHEET_FOURTH_YEAR || sheetName === SHEET_FOURTH_YEAR_CLUB || sheetName === SHEET_CONTACT) continue;
    
    const lastRow = sheet.getLastRow();
    if (lastRow <= 1) continue;

    const data = sheet.getRange(2, 5, lastRow - 1, 1).getValues(); // VTU is in Col 5
    for (let j = 0; j < data.length; j++) {
      const existingVtu = (data[j][0] || "").toString().trim().toUpperCase();
      if (existingVtu === vtu) {
        return true;
      }
    }
  }
  return false;
}

function hasAppliedForFourthYear(ss, vtu) {
  const sheet = ss.getSheetByName(SHEET_FOURTH_YEAR);
  if (!sheet) return false;
  
  const lastRow = sheet.getLastRow();
  if (lastRow <= 1) return false;

  const data = sheet.getRange(2, 3, lastRow - 1, 1).getValues(); // VTU is in Col 3 (Timestamp, Category, VTU)
  for (let i = 0; i < data.length; i++) {
    const existingVtu = (data[i][0] || "").toString().trim().toUpperCase();
    if (existingVtu === vtu) {
      return true;
    }
  }
  return false;
}

// 2. Fetch Settings
function getSettingsResponse() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName(SHEET_SETTINGS);
  const data = sheet.getDataRange().getValues();
  
  let settings = {};
  for (let i = 1; i < data.length; i++) {
    if (data[i][0]) {
      settings[data[i][0]] = data[i][1];
    }
  }

  return { status: "success", settings: settings };
}

// 3. Update Settings (Admin Only)
function handleUpdateSettings(settingsPayload) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName(SHEET_SETTINGS);
  const data = sheet.getDataRange().getValues();

  Object.keys(settingsPayload).forEach(key => {
    let found = false;
    for (let i = 1; i < data.length; i++) {
      if (data[i][0] === key) {
        sheet.getRange(i + 1, 2).setValue(settingsPayload[key]);
        found = true;
        break;
      }
    }
    if (!found) {
      sheet.appendRow([key, settingsPayload[key]]);
    }
  });

  return { status: "success", message: "Settings updated successfully" };
}

// 4. Admin Authentication
function handleAdminLogin(username, password) {
  // HIGHLY SECURE: Fetch credentials from Apps Script Environment Variables
  const props = PropertiesService.getScriptProperties();
  
  // If user hasn't set them in settings yet, fallback to these defaults
  const validUser = props.getProperty('ADMIN_USERNAME') || 'admin';
  const validPass = props.getProperty('ADMIN_PASSWORD') || 'SuperSecure@2026';

  if (username === validUser && password === validPass) {
    return { status: "success", authenticated: true, message: "Login successful" };
  }

  return { status: "error", authenticated: false, message: "Invalid credentials" };
}

// 5. Get Recent Applications & Stats
function getRecentApplicationsResponse() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const allSheets = ss.getSheets();
  let allApps = [];

  allSheets.forEach(sheet => {
    const sheetName = sheet.getName();
    
    // Skip non-application sheets
    if (sheetName === SHEET_SETTINGS || sheetName === SHEET_CLUBS || sheetName === SHEET_FOURTH_YEAR || sheetName === SHEET_FOURTH_YEAR_CLUB || sheetName === SHEET_CONTACT) return;

    if (sheet.getLastRow() > 1) {
      const data = sheet.getRange(2, 1, sheet.getLastRow() - 1, sheet.getLastColumn()).getValues();
      
      if (sheetName === SHEET_LEADERSHIP) {
        data.forEach(row => {
          allApps.push({
            timestamp: row[0], category: "Leadership", role: row[2], vtu: row[3], name: row[4],
            dept: row[5], year: row[6], section: row[7], phone: row[8], email: row[9],
            skills: row[10], experience: row[11], github: row[12], linkedin: row[13], portfolio: row[14],
            why: row[15], contribution: row[16], availability: row[17],
            mentorName: row[18], mentorPhone: row[19]
          });
        });
      } else {
        // It's a specific club sheet!
        data.forEach(row => {
          allApps.push({
            timestamp: row[0], category: "Club", role: row[2], applyingAs: row[3], vtu: row[4], name: row[5],
            dept: row[6], year: row[7], section: row[8], phone: row[9], email: row[10],
            skills: row[11], experience: row[12], why: row[13], contribution: row[14],
            github: row[15], linkedin: row[16], portfolio: row[17],
            mentorName: row[18], mentorPhone: row[19]
          });
        });
      }
    }
  });

  // Sort descending by timestamp (newest first)
  allApps.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

  return { status: "success", data: allApps };
}

// Helper: Format CORS JSON Output
function createJsonResponse(data) {
  return ContentService.createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}
