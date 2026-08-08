/**
 * ==========================================================================
 * CSE CLUBS COUNCIL - RAW DATA BACKUP SCRIPT
 * ==========================================================================
 * 
 * INSTRUCTIONS:
 * 1. Open Google Sheets -> Extensions -> Apps Script.
 * 2. Paste this entire code into Code.gs (replacing everything).
 * 3. Click "Deploy" -> "New Deployment".
 * 4. Select type: "Web App", Execute as "Me", Access "Anyone".
 * 5. Copy the Web App URL and add it to Vercel Environment Variables as GOOGLE_SCRIPT_URL.
 */

const SHEET_RAW = "Raw Data Backup";

function setupSheet() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(SHEET_RAW);
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_RAW);
    sheet.appendRow([
      "Timestamp", "Category", "Club/Role", "VTU Number", "Full Name",
      "Department", "Year", "Section", "Phone", "Email", "Applying As", "Skills", 
      "Experience/WhyJoin", "GitHub", "LinkedIn", "Mentor Name", "Mentor Phone", "Reason"
    ]);
    const headerRange = sheet.getRange(1, 1, 1, sheet.getLastColumn());
    headerRange.setFontWeight("bold");
    headerRange.setBackground("#1e293b");
    headerRange.setFontColor("#ffffff");
  }
  return sheet;
}

function doPost(e) {
  try {
    const sheet = setupSheet();
    const postData = JSON.parse(e.postData.contents);
    const data = postData.data || postData;
    
    // Support ping check
    if (postData.action === "ping") {
        return ContentService.createTextOutput(JSON.stringify({ status: "success" })).setMimeType(ContentService.MimeType.JSON);
    }
    
    const timestamp = new Date().toLocaleString();
    
    sheet.appendRow([
      timestamp,
      data.category || "",
      data.clubName || data.position || data.role || "",
      data.vtu || "",
      data.name || "",
      data.dept || "",
      data.year || "",
      data.section || "",
      data.phone || "",
      data.email || "",
      data.applyingAs || "",
      data.skills || "",
      data.whyJoin || data.experience || data.exp || "",
      data.github || "",
      data.linkedin || "",
      data.mentorName || "",
      data.mentorPhone || "",
      data.reason || data.query || ""
    ]);

    return ContentService.createTextOutput(JSON.stringify({ status: "success", message: "Backup recorded" }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ status: "error", message: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet(e) {
  return ContentService.createTextOutput(JSON.stringify({ status: "success", message: "Raw Data Backup API Active" }))
    .setMimeType(ContentService.MimeType.JSON);
}
