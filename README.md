# Glammash-Up
Glam Mash-Up — Outfit Randomizer (with a real backend)
A girly, glam "slot machine" for mixing outfits — spin reels for Tops,
Bottoms, Jewellery, and Shoes on the main page, plus a separate Dress
Mode page. Upload your own real clothing photos into any reel; they're
saved on a real server + database and stay there — across refreshes,
browser restarts, even a different device hitting the same server —
until you delete them yourself with the × button. Viewing a photo
always displays it on the page; it never triggers a "save file" download.
Requirements
Node.js version 18 or newer
Setup
cd glam-app
npm install
npm start
​
Then open http://localhost:3000 in your browser.
That's it — no separate database server to install. SQLite lives in a
single file the app creates automatically at data/glam.db.
Project structure
glam-app/
├── server.js          Backend: Express server + SQLite database (photos stored as BLOBs)
├── package.json        Dependency list (express, multer, better-sqlite3)
├── data/                Created automatically — holds glam.db (the ONLY place photos live)
├── public/               Everything the browser loads
│   ├── index.html          Main page: Tops / Bottoms / Jewellery / Shoes
│   ├── dresses.html        Separate page: Dress Mode (its own reel + theme)
│   ├── style.css           Shared styling for both pages
│   ├── shapes.js            SVG placeholder icon library (used until you upload real photos)
│   └── app.js                Shared client logic: talks to the backend, runs the
│                              spin machine, renders galleries, handles delete
└── README.md            this file
​
How the persistence actually works
This is the part that's different from a plain HTML/JS version:
Uploading: when you pick a photo under a reel, the browser sends
it to the server as a file (POST /api/items). The server reads the
image straight into memory and inserts it as a row in the items
table inside data/glam.db — the actual image bytes go into a
BLOB column, alongside which category it belongs to, its display
name, and when it was added. Nothing is written as a loose file
anywhere on disk — the database file is the only place the photo
exists.
Loading: every time a page loads, it asks the server
GET /api/items?category=tops (and the same for each other
category) and gets back exactly what's saved — so your uploads are
still there even after closing the tab, restarting your computer, or
opening the site from a different browser on the same machine.
Displaying (not downloading): each photo is shown via
GET /api/items/:id/photo, which streams the image bytes straight
out of the database with the header Content-Disposition: inline.
That header is what tells the browser "render this in the page,"
as opposed to attachment, which would prompt a save-file dialog.
That's why viewing an uploaded photo — in a reel or in its gallery
thumbnail — just displays it, never downloads it.
Deleting: every uploaded photo shows up as a small thumbnail
with its own × button underneath its reel. Clicking it calls
DELETE /api/items/:id, which removes that row — bytes and all —
from the database. This is the only thing that removes a photo;
nothing expires automatically.
API reference
Method
Route
What it does
GET
/api/items?category=tops
List every saved photo for a category (metadata only)
GET
/api/items/:id/photo
Stream the actual image bytes, served inline so it displays instead of downloading
POST
/api/items
Upload a photo (multipart/form-data: category, name, photo)
DELETE
/api/items/:id
Delete one photo (removes its row — and its bytes — from the database)
Valid category values: tops, bottoms, jewellery, shoes, dresses.
Pages
index.html ("Separates") — Tops, Bottoms, Jewellery, and Shoes
reels side by side, plus a "Today's Look Board" that collects
whatever you've stopped/locked so far.
dresses.html ("Dress Mode") — its own page with a different
background theme and a single larger reel, just for dresses. Linked
from the nav bar at the top of both pages.
Both pages share the same style.css and app.js, and talk to the
same backend — a dress you upload shows up in Dress Mode's database
table (category = 'dresses') exactly the same way a top you upload
shows up under Tops.
Customizing
Colors / fonts: edit the :root variables and font links in
public/style.css / the <head> of the HTML files.
Add a category (e.g. Bags): add a small set of shape functions to
public/shapes.js, add 'bags' to the CATEGORIES array in
server.js (so the server knows to create an uploads/bags/
folder and accept it), then add one more object to the categories
array passed into GlamApp.init(...) in whichever HTML page you want
it on.
Photo limit per category: change the 10 in
Array.from(fileList).slice(0, 10 - uploaded[key].length) inside
public/app.js.
Max upload file size: change limits: { fileSize: 8 * 1024 * 1024 }
(currently 8MB) in server.js.
Resetting everything
To wipe all uploaded photos and start fresh, stop the server and
delete the data/ folder — it'll be recreated empty the next time you
run npm start. (This is a manual, deliberate action — the app itself
never does this automatically.)
