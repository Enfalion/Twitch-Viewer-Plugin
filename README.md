# 💜 OpenDeck Twitch Viewer Plugin (`xyz.enfalion.twitchviewer`)

> 🌐 **Select Language / Sprache wählen:** 🇬🇧 **English (Current)** | 🇩🇪 [**Deutsch (Hier klicken)**](./README.de.md) | 📦 [**Maintainer Packaging Guide**](#maintainer-guide)

A cross-platform **OpenDeck & Stream Deck Plugin** tailored specifically for **Twitch Viewers** (Windows, Linux & macOS). Connect your Twitch account with a single click, place your favorite streamers on your deck, and see who is live at a glance!

* **Author:** Enfalion (`enfalion.xyz`)
* **Bundle ID:** `xyz.enfalion.twitchviewer`
* **Latest Version:** `v1.3.4`
* **GitHub Repository:** [https://github.com/Enfalion/Twitch-Viewer-Plugin](https://github.com/Enfalion/Twitch-Viewer-Plugin)

---

## ✨ The 5 Core Features (v1.3.4)

1. **👤 Favorite Streamer (Live Status & 100% Optional Overlays)**
   * Displays the real Twitch avatar of your favorite streamer right on the key.
   * **Offline:** Avatar is automatically rendered in **grayscale** (with an `OFF` badge).
   * **Online (LIVE):** Avatar turns **full color** with a red live border (yellow border when the streamer just went live!).
   * **100% Optional:** Every single overlay (*Offline Grayscale, Red Live Border, Viewer Count, Streamer Name, Current Game/Category*) can be toggled individually – including a clean avatar-only mode!
   * **Live Status in Dropdown:** The channel selector immediately shows who is online (`🟢 LIVE - Streamer (Game)` vs. `⚫ OFF - Streamer`).

2. **🔄 Dynamic Live Slot (Auto-Rotate)**
   * Following 50+ streamers but only have room for 1 to 3 keys? The *Dynamic Live Slot* automatically displays your **currently live followed channels** and cycles through them every 10 seconds (or pin it to a fixed live rank `#1`, `#2`, `#3`, etc.).

3. **⏭ Dynamic Live Switcher (Next Key)**
   * Shows live on the key **how many of your followed channels are currently online** (e.g., `6 LIVE`) and who is currently #1.
   * A short press immediately cycles all *Dynamic Live Slots* on your deck to the next live streamer.

4. **🥷 Quick Chat / `!lurk` (With Channel Icon)**
   * Displays the avatar of the selected (or automatically the **last opened/active**) streamer right on the key.
   * A **short key press** immediately sends `!lurk` (or any custom message) directly to the Twitch chat without having to search for your browser window!

5. **📺 MultiTwitch Split-Screen**
   * Perfect for tournaments, events, or co-op streams: Enter 2 to 4 streamer names (e.g., `shroud + gronkh`) to open all streams side-by-side in a single split-screen window.

---

## 👆 Short Press vs. ⏳ Long Press (>= 500ms)

Every Streamer and Dynamic Live Slot key supports dual actions:
* **Short Press (Key Tap):** 🌐 Open in Default Browser | 🗔 Borderless Popout Player | 🚀 Custom Player / Streamlink / VLC (`streamlink https://twitch.tv/{channel} best`) | 💬 Popout Chat Only
* **Long Press (Key Hold >= 500ms):** ⏭ Next Live Streamer (Cycle) | 💬 Popout Chat Only | 🥷 Send `!lurk` to chat | 🚀 Streamlink / External Player

---

## 🌍 Dynamic Language Detection (EN / DE)

The plugin automatically detects the language configured in **OpenDeck / Stream Deck** and dynamically switches all menus, hints, and key labels between **English** and **German** (including a manual `DE | EN` toggle in the Property Inspector).

---

## 📸 Screenshots

**1. Twitch Login Options:**
<img width="2237" height="384" alt="Twitch Login Options" src="https://github.com/user-attachments/assets/1f572575-6828-457d-acff-9f9ac74a4920" />

**2. Select your Streamer (with Live Indicator):**
<img width="789" height="811" alt="Select your Streamer" src="https://github.com/user-attachments/assets/9d1c2111-754e-4d4d-a465-8065d26a0216" />

**3. 100% Optional Icon Overlays & Actions:**
<img width="759" height="354" alt="Overlay Options" src="https://github.com/user-attachments/assets/f2c1a91f-0a11-4905-96b1-b8e19be6f284" />

---

## 🚀 Installation

### Option A: Via OpenDeck Marketplace or GitHub Releases
1. Search for **"Twitch Viewer Deck"** in the **OpenDeck Marketplace** or download the latest `xyz.enfalion.twitchviewer.streamDeckPlugin` (or `.zip`) from [**Releases**](https://github.com/Enfalion/Twitch-Viewer-Plugin/releases).
2. Open **OpenDeck** → **Settings** → **Plugins** → **Install from file**.
3. Restart OpenDeck once. *(Requires Node.js v18 or v20+ installed on your system).*

### Option B: From Source (GitHub Clone)
```bash
git clone https://github.com/Enfalion/Twitch-Viewer-Plugin.git
cd Twitch-Viewer-Plugin/xyz.enfalion.twitchviewer.sdPlugin
npm install
```
Copy the `xyz.enfalion.twitchviewer.sdPlugin` folder into your OpenDeck plugins directory:
* **Linux:** `~/.config/opendeck/plugins/` (or `~/.local/share/opendeck/plugins/`)
* **Windows:** `%APPDATA%\opendeck\plugins\`
* **macOS:** `~/Library/Application Support/opendeck/plugins/`

---

## 🔑 1-Click Twitch Login & Developer Custom App Guide

An official **Public Twitch Client-ID (`nglaah171uy4d4p4fbogi2au3w3oj7`) is pre-installed** – no developer console setup required!
1. Drag any **Twitch Viewer** action onto your deck.
2. Click **"⚡ 1-Click Twitch Login (with 8-digit Code)"** in the Property Inspector.
3. Confirm the 8-digit code in your browser at `twitch.tv/activate` – done! The plugin automatically refreshes your token in the background every 4 hours.

### ⚙️ Optional for Admins / Developers: Using Your Own Twitch Client-ID
If you want to use your own custom Twitch Application, expand **"⚙️ Advanced Login Options / Custom Client-ID"** in the Property Inspector:
1. Open [`dev.twitch.tv/console/apps`](https://dev.twitch.tv/console/apps) and click **"Register Your Application"**.
2. **Name:** e.g. `MyOpenDeckViewer` | **OAuth Redirect URL:** `http://localhost:3000`
3. **Category:** `Application Integration`
4. **Client Type:** Select **`Public`** (recommended – enables automatic token refresh without a secret). If you choose `Confidential`, also enter your *Client Secret* in the optional field in the Property Inspector.

---

## Maintainer Guide

📦 To build the `.zip`, `.streamDeckPlugin`, and `.md5` checksum files for a new release:

```bash
cd xyz.enfalion.twitchviewer.sdPlugin
npm install --omit=dev
cd ..
zip -r xyz.enfalion.twitchviewer.sdPlugin-v1.3.4.zip xyz.enfalion.twitchviewer.sdPlugin -x "*.git*" "*.DS_Store*" "*auth-backup.json*" "*.log*"
cp xyz.enfalion.twitchviewer.sdPlugin-v1.3.4.zip xyz.enfalion.twitchviewer.streamDeckPlugin
md5sum xyz.enfalion.twitchviewer.sdPlugin-v1.3.4.zip > xyz.enfalion.twitchviewer.sdPlugin-v1.3.4.zip.md5
```

## 📄 License

Published under the [MIT License](./LICENSE) – Copyright (c) 2026 Enfalion.
