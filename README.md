# Scan2Gift — Client-ready GitHub Pages + Google Sheets

This upgraded version adds:
- User registration/login with hashed passwords and session tokens
- User-scoped gifts (users only see their own dashboard data)
- Authenticated create-gift API
- PIN-protected gifts
- Gift views + scan events
- Privacy-friendly analytics page
- Premium-ready template gallery
- Printable QR gift card with browser "Print / Save as PDF"
- QR customization hooks
- Photo/video/music URL support
- Premium payment-link configuration
- Admin API protection using an Admin plan
- Responsive premium UI
- GitHub Pages + Google Apps Script + Google Sheets architecture

## Deployment
1. Create a Google Sheet.
2. Add tabs: Users, Gifts, Scans, Settings.
3. Open Extensions > Apps Script.
4. Replace Code.gs with google-apps-script/Code.gs.
5. Run setupSheets() once.
6. Deploy as Web app, Execute as Me, Who has access: Anyone.
7. Copy /exec URL into assets/js/config.js.
8. Optionally set PREMIUM_PAYMENT_URL to a Stripe Payment Link / PayHere checkout URL.
9. Upload the project to GitHub and enable GitHub Pages.

## First admin
Register a normal account. In the Users sheet, change that account's `plan` value from `Free` to `Admin`. Sign out/in again. The admin dashboard API will then allow access.

## Payment security
Never put Stripe secret keys, PayHere secrets, Google service account JSON, or other private credentials in GitHub Pages. For a true automated payment-to-plan flow, use a trusted server/webhook or a payment provider checkout that redirects to a secure backend/API.

## Media storage
The current builder accepts public media URLs. For direct uploads, add Cloudinary/Supabase Storage or Google Drive through a separate upload endpoint. Do not store large binary files inside Google Sheets.

## Scale
Google Sheets is intentionally used here because it is cheap and simple for a small client deployment. If the project grows significantly, migrate the API/database to Supabase/Firebase or a proper backend.
