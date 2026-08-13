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
That's it — no separate database server to install.
, deliberate action — the app itself
never does this automatically.)
