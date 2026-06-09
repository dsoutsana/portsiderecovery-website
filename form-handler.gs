// Portside Recovery — Contact Form Handler
// Deploy as Web App: Deploy → New deployment → Web app → Execute as "me" → Who has access: "Anyone"

function doPost(e) {
  try {
    var data;
    try {
      data = JSON.parse(e.postData.contents);
    } catch (err) {
      return jsonResponse({ success: false, error: "Invalid request format" });
    }

    var name = (data.name || "").trim();
    var company = (data.company || "").trim();
    var email = (data.email || "").trim();
    var message = (data.message || "").trim();

    if (!name) return jsonResponse({ success: false, error: "Name is required" });
    if (!email || email.indexOf("@") === -1) return jsonResponse({ success: false, error: "Valid email is required" });
    if (!message) return jsonResponse({ success: false, error: "Message is required" });

    var timestamp = new Date().toLocaleString("en-AU", { timeZone: "Australia/Sydney" });

    var subject = "New enquiry: " + company + " — " + name;
    var body = [
      "New Portside Recovery website enquiry",
      "",
      "Name:     " + name,
      "Company:  " + company,
      "Email:    " + email,
      "Time:     " + timestamp + " AEST",
      "",
      sanitize(message),
      "",
      "— sent from portsiderecovery.com"
    ].join("\n");

    MailApp.sendEmail({
      to: "claims@portsiderecovery.com",
      replyTo: email,
      subject: subject,
      body: body
    });

    // Confirmation to submitter (non-critical)
    try {
      MailApp.sendEmail({
        to: email,
        subject: "Received: " + subject,
        body: [
          "Hi " + name + ",",
          "",
          "Thanks for reaching out. We've received your enquiry and will review",
          "the details. You'll hear back within 24 hours.",
          "",
          "Regards,",
          "Daniel Soutsana",
          "Portside Recovery",
          "claims@portsiderecovery.com"
        ].join("\n")
      });
    } catch (e2) {}

    return jsonResponse({ success: true });

  } catch (err) {
    return jsonResponse({ success: false, error: "Server error. Please try again." });
  }
}

function doGet(e) {
  return jsonResponse({ status: "ok", message: "Portside Recovery form endpoint" });
}

function jsonResponse(data) {
  return ContentService
    .createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}

function sanitize(str) {
  return str.replace(/<[^>]*>/g, "");
}
