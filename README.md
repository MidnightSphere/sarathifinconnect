# Sarathi FinConnect

## Send form submissions to Google Sheets with Apps Script

Both the contact form and loan application forms submit to the Apps Script web
app in [`google-apps-script/Code.gs`](./google-apps-script/Code.gs). It appends
each submission to the `Enquiries` tab. No Google Cloud project, service
account, or paid Sheets API setup is needed.

### One-time setup

1. **Create a spreadsheet.** Go to [Google Sheets](https://sheets.google.com)
   and create a spreadsheet. Name the first tab `Enquiries`.
2. **Add the column headings** in row 1, in this order:

   `Name | Phone | Email | Loan Type | Amount | City | Message | Submitted At`

3. **Open Apps Script.** In the spreadsheet, click **Extensions → Apps Script**.
   In the editor, open `Code.gs`, remove its starter code, then copy and paste
   the full contents of this project's
   [`Code.gs`](./google-apps-script/Code.gs). Click **Save**.
4. **Authorize spreadsheet access.** In the Apps Script editor, select
   `authorizeAndTest` from the function dropdown and click **Run**. Review and
   allow the Google authorization prompt. Confirm the execution log says it is
   ready to write to `Enquiries`.
5. **Deploy the script.** Click **Deploy → New deployment**. Click the gear
   beside “Select type” and choose **Web app**. Set:
   - **Execute as:** Me
   - **Who has access:** Anyone

   Click **Deploy**. The web app must
   be accessible to anyone so website visitors can submit without signing in.
   Keep the spreadsheet itself private; do not share it publicly.
6. **Copy the web app URL.** It looks like
   `https://script.google.com/macros/s/.../exec`. Treat it as public; it is not
   a password.
7. **Configure the website endpoint.** The current Apps Script URL is already
   the website's default. If you create a different web app deployment, open
   **Settings → Environment Variables** in Vercel and add:
   - Name: `VITE_ENQUIRY_ENDPOINT`
   - Value: the Apps Script web app URL you copied
   - Environment: **Production** (and **Preview** if you test preview links)

   Save it, then redeploy the site so the new setting is included. The
   `.env.example` file is only an example and is not automatically loaded by
   Vercel.
8. **Send a test enquiry.** Submit one from the website and check that a new
   row appears in the `Enquiries` tab. Test a loan form too; both form types
   use the same sheet.

### Updating the script later

After changing `Code.gs`, click **Deploy → Manage deployments**, edit the
deployment, select **New version**, and deploy it. Keep the same web app URL in
Vercel unless you create a new deployment.

This uses Google Sheets and Apps Script quotas, which are generally sufficient
for a small enquiry form at no additional charge. Google may apply account and
usage limits. The web app URL is public, so keep the spreadsheet private and
review the sheet for unwanted submissions.

## Configure the site chatbot

The site chatbot uses Google's `gemini-3.1-flash-lite` model through the
server-side `/api/chat` function. The Gemini API key is only read by that
function; never add it to a `VITE_` variable or commit it to the repository.

1. Create a Gemini API key in [Google AI Studio](https://aistudio.google.com/app/apikey).
2. For local development, set `GEMINI_API_KEY` in an uncommitted `.env.local`
   file, then run `npm run dev`. The Vite development server exposes the chat
   function locally without requiring the Vercel CLI.
3. In Vercel, add `GEMINI_API_KEY` under **Settings → Environment Variables** for
   Production and Preview. Redeploy after saving the variable.
4. Open the chat bubble and ask a loan-services question to verify the setup.

The assistant uses general company information and editable FAQs in
`src/data/chatbot-knowledge.js`, plus loan-service information in
`src/data/loan-services-data.js`. Add or update public-facing company answers in
the chatbot knowledge file. It provides general information only; rates and
eligibility are not guaranteed, and visitors should not share sensitive personal
or financial information in chat.
