# Scan2Gift — Final Client Setup Guide 🇱🇰

මේ version එක කලින් ZIP එකට වඩා complete client-ready version එකක්.

## මේ version එකේ තියෙන upgrades

- User Register / Login
- Password hashing
- Session token
- User තමන්ගේ gifts විතරක් dashboard එකෙන් බලනවා
- Gift creation authentication
- PIN protected gift
- Gift views
- Scan logging
- Analytics dashboard
- Template gallery
- Printable QR card
- Print → Save as PDF
- Premium payment link support
- Admin protection
- Photo URL
- Video URL
- Music URL
- Responsive mobile UI
- GitHub Pages hosting
- Google Sheets database
- Google Apps Script API

## 01 — Google Sheet

Google Sheet එකක් හදන්න.

Tabs:

Users
Gifts
Scans
Settings

## 02 — Apps Script

Google Sheet:

Extensions → Apps Script

`google-apps-script/Code.gs` සම්පූර්ණ code එක paste කරන්න.

`setupSheets()` Run කරන්න.

Authorization Allow කරන්න.

## 03 — Deploy

Deploy → New deployment → Web app

Execute as:
Me

Who has access:
Anyone

Deploy.

`/exec` URL එක copy කරන්න.

## 04 — config.js

Open:

assets/js/config.js

මේ line එකට Apps Script URL එක දාන්න:

API_URL: "YOUR_EXEC_URL"

Premium payment එකක් තියෙනවා නම්:

PREMIUM_PAYMENT_URL: "YOUR_PAYMENT_LINK"

### Payment links

Stripe Payment Link හෝ PayHere checkout URL එකක් use කරන්න පුළුවන්.

**Secret API keys GitHub එකේ දාන්න එපා.**

Automatic payment → premium plan update ඕනේ නම් secure webhook/backend එකක් ඕන.

## 05 — GitHub

GitHub → New repository

Example:

scan2gift

සියලු files upload කරන්න.

Settings → Pages

Source:
Deploy from branch

Branch:
main

Folder:
/ root

Save.

## 06 — First admin account

මුලින් `register.html` එකෙන් account එකක් create කරන්න.

ඊට පස්සේ Google Sheet → Users tab එකට යන්න.

ඔයාගේ account එකේ:

plan

column එක:

Free

වෙනුවට:

Admin

කරන්න.

ඊට පස්සේ logout/login කරන්න.

Admin page:

/admin/

open කරන්න.

## 07 — User flow

Client/user:

Register
↓
Login
↓
Create Gift
↓
Choose Occasion
↓
Choose Template
↓
Enter recipient
↓
Enter message
↓
Optional photo/video/music
↓
Optional PIN
↓
Create
↓
Unique QR
↓
Share / Print

## 08 — Gift recipient flow

Recipient QR scan කරනවා.

↓

Gift page

↓

Beautiful animation

↓

Photo

↓

Message

↓

Video

↓

Music

↓

Gift complete ❤️

## 09 — Analytics

Dashboard → Analytics

Track:

- Views
- Scan events
- Last scan
- Basic referrer information
- Time of scans

මේක privacy-friendly basic analytics.

## 10 — Printable card

Dashboard එකෙන් gift එකකට:

Print

click කරන්න.

ඊට පස්සේ:

Print / Save as PDF

browser option එකෙන් PDF save කරන්න.

ඒ PDF physical birthday/anniversary card එකකට print කරන්න පුළුවන්.

## 11 — Media

දැනට:

Photo URL
Video URL
Music URL

support කරනවා.

Large file upload එක Google Sheet එකට දාන්න එපා.

Client version එකේ large images/videos සඳහා:

Cloudinary
හෝ
Supabase Storage

use කරන්න.

## 12 — Payment

Pricing page තියෙනවා.

Payment සඳහා:

Stripe Payment Link
හෝ
PayHere

use කරන්න පුළුවන්.

Frontend එකට payment secret keys දාන්න එපා.

Production payment automation සඳහා:

Payment provider
↓
Webhook
↓
Secure API
↓
Google Sheet / Database

architecture එක use කරන්න.

## 13 — Custom domain

GitHub:

Settings → Pages → Custom domain

උදාහරණ:

scan2gift.com

DNS records client domain provider එකෙන් configure කරන්න.

## 14 — Legal

Client launch එකට කලින්:

Privacy Policy
Terms
Refund Policy
Contact
Cookie/analytics disclosure

final legal text එක client/company details අනුව update කරන්න.

## 15 — IMPORTANT security

Google Sheet එක Public කරන්න එපා.

Apps Script Web App එක:

Anyone

වෙන්න පුළුවන්.

Google Sheet:

Restricted

වෙන්න ඕන.

GitHub repository එක public නම්:

- passwords
- API secret keys
- payment secret keys
- service account JSON
- database passwords

කිසිම එකක් commit කරන්න එපා.

## 16 — Production recommendation

Small client launch:

GitHub Pages
+
Google Apps Script
+
Google Sheets

හොඳයි.

Traffic එක වැඩි වුණොත්:

GitHub Pages
+
Supabase/Firebase
+
Storage
+
proper authentication

වෙත migrate කරන්න.

## 17 — Final launch checklist

[ ] Google Sheet created
[ ] setupSheets() run
[ ] Apps Script deployed
[ ] config.js API URL added
[ ] GitHub Pages working
[ ] Register tested
[ ] Login tested
[ ] Gift creation tested
[ ] QR tested on real phone
[ ] PIN tested
[ ] Analytics tested
[ ] Printable card tested
[ ] Admin tested
[ ] Payment link tested
[ ] Custom domain tested
[ ] Privacy Policy updated
[ ] Terms updated
[ ] Contact email updated
[ ] Google Sheet backup configured

# Final architecture

Visitor
↓
GitHub Pages
↓
HTML / CSS / JS
↓
Google Apps Script
↓
Google Sheets

QR scan:

Phone
↓
gift.html
↓
Apps Script
↓
Gift data
↓
Beautiful gift experience ❤️


# 🚨 Login / Sign-up "API returned invalid JSON" fix

මේ error එක සාමාන්‍යයෙන් frontend code එකෙන් නෙවෙයි.
Google Apps Script URL එක HTML/login page එකක් return කරනකොට මේ error එක එනවා.

### 1. Apps Script deployment එක check කරන්න

Google Sheet → Extensions → Apps Script

ඊට පස්සේ:

Deploy → Manage deployments

Web app deployment එක open කරන්න.

Settings:

Execute as:
**Me**

Who has access:
**Anyone**

ඊට පස්සේ Deploy / Update කරන්න.

### 2. `/exec` URL එකම use කරන්න

Correct:

`https://script.google.com/macros/s/XXXXXXXX/exec`

Wrong:

`https://script.google.com/macros/d/...`

හෝ Apps Script editor URL එක.

### 3. Browser test

`API_URL` එක browser address bar එකට paste කරන්න.

JSON එකක් වගේ:

`{"ok":true,"service":"Scan2Gift API"...}`

පේන්න ඕන.

HTML login page එකක් එනවා නම් deployment access එක `Anyone` නෙවෙයි.

### 4. config.js

`assets/js/config.js`

```text
API_URL: "https://script.google.com/macros/s/XXXXXXXX/exec"
```

### 5. Important

URL එක change කළාම GitHub Pages cache නිසා hard refresh කරන්න:

Windows:
`Ctrl + F5`

### 6. Google Sheet

Apps Script එක **Google Sheet එකෙන් Extensions → Apps Script** open කරලා bind කරලා තියෙනවා නම් `SPREADSHEET_ID` blank තියාගන්න පුළුවන්.

Standalone Apps Script එකක් නම් `SPREADSHEET_ID` එකට Sheet ID එක දාන්න.

### 7. Test order

1. Open `/`
2. Open `/login.html`
3. Register account
4. Google Sheet → Users row එක බලන්න
5. Login
6. Dashboard
7. Create Gift
8. Open generated gift URL
9. Scan QR from phone
10. Analytics check

මේ order එකෙන් test කළොත් problem එක ඉක්මනට identify කරන්න පුළුවන්.
