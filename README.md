# 💜 OpenDeck Twitch Viewer Plugin (`xyz.enfalion.twitchviewer`)

> 🇩🇪 [**Deutsche Anleitung unten**](#deutsche-dokumentation) | 🇬🇧 [**English Documentation below**](#english-documentation) | 🔑 [**Eigene Client-ID / Admin-Guide**](#custom-client-id-guide) | 📦 [**Maintainer Packaging Guide**](#maintainer-packaging-guide)

---

<a id="deutsche-dokumentation"></a>
## 🇩🇪 Deutsche Dokumentation

Ein plattformübergreifendes **OpenDeck & Stream Deck Plugin** speziell für **Twitch-Zuschauer** (Windows, Linux & macOS). Melde dich mit nur einem Klick mit deinem Twitch-Konto an, lege deine Lieblingsstreamer auf dein Deck und sieh auf einen Blick, wer gerade live ist!

* **Autor:** Enfalion (`enfalion.xyz`)
* **Bundle-ID:** `xyz.enfalion.twitchviewer`
* **Aktuelle Version:** `v1.3.4`
* **GitHub-Repository:** [https://github.com/Enfalion/Twitch-Viewer-Plugin](https://github.com/Enfalion/Twitch-Viewer-Plugin)

### ✨ Die 5 Kern-Funktionen (v1.3.4)

1. **👤 Favoriten-Streamer (Live-Status & 100% Optionale Overlays)**
   * Zeigt das echte Twitch-Profilbild deines Favoriten direkt auf der Taste an.
   * **Offline:** Profilbild wird automatisch in **Graustufen** dargestellt (inkl. `OFF`-Badge).
   * **Online (LIVE):** Profilbild erstrahlt **farbig** mit rotem Live-Rahmen (gelber Rahmen, wenn der Streamer gerade frisch online gegangen ist!).
   * **100% Optional:** Jedes Overlay-Element (*Graustufen bei Offline, Roter Live-Rahmen, Zuschauerzahl, Streamer-Name, aktuelles Spiel/Kategorie*) lässt sich einzeln ein- oder ausschalten – auch ein komplett cleaner Modus (nur das Profilbild) ist möglich!
   * **Live-Status im Auswahl-Menü:** Direkt im Dropdown siehst du sofort, wer gerade online ist (`🟢 LIVE - Streamer (Spiel)` vs. `⚫ OFF - Streamer`).

2. **🔄 Dynamischer Live-Slot (Auto-Rotierend)**
   * Du folgst 50 Streamern, hast aber nur Platz für 1 bis 3 Tasten? Der *Dynamic Live Slot* zeigt automatisch immer deine **aktuell live streamenden Favoriten** an.
   * **Auto-Rotation:** Schaltet auf Wunsch automatisch alle 10 Sekunden durch alle aktuell aktiven Live-Streams (oder lässt sich fest auf Live-Platz `#1`, `#2`, `#3` usw. anpinnen).

3. **⏭ Dynamic Live Switcher (Weiter-Taste)**
   * Zeigt dir live auf der Taste an, **wie viele deiner Favoriten gerade gleichzeitig online sind** (z.B. `6 LIVE`) und wer aktuell auf Platz 1 liegt.
   * Ein kurzer Druck schaltet sofort alle *Dynamic Live Slots* auf deinem Deck einen Streamer weiter.

4. **🥷 Schnell-Chat / `!lurk` (Mit Kanal-Icon)**
   * Zeigt das Profilbild des ausgewählten (oder automatisch des **zuletzt geöffneten/aktiven**) Streamers auf der Taste.
   * Ein **kurzer Tastendruck** sendet sofort `!lurk` (oder deinen eigenen Wunschtext) direkt in den Twitch-Chat – ganz ohne das Browserfenster suchen zu müssen!

5. **📺 MultiTwitch Split-Screen**
   * Perfekt für Turniere, Events oder Koop-Runden: Trage 2 bis 4 Streamer ein (z.B. `gronkh + bonjwa + maxim`) und öffne alle Streams nebeneinander in einem einzigen Split-Screen-Fenster.

### 👆 Kurz drücken vs. ⏳ Lang drücken (>= 500ms)

Jede Streamer- und Live-Slot-Taste ist doppelt belegbar:
* **Kurz drücken (Short Tap):** 🌐 Standard-Browser | 🗔 Rahmenloser Popout-Player | 🚀 Streamlink / VLC / MPV (`streamlink https://twitch.tv/{channel} best`) | 💬 Nur Popout-Chat
* **Lang drücken (Long Hold >= 500ms):** ⏭ Nächster Live-Streamer (Rotation) | 💬 Nur Popout-Chat | 🥷 Sofort `!lurk` senden | 🚀 Streamlink / Externer Player

### 🌍 Dynamische Sprach-Erkennung (DE / EN)

Das Plugin erkennt automatisch die in **OpenDeck / Stream Deck** eingestellte Sprache und stellt alle Menüs, Erklärungen sowie die Tasten-Beschriftungen live auf **Deutsch** oder **Englisch** um (inklusive manuellem `DE | EN` Umschalter im Einstellungs-Menü).

### 🚀 Installation

#### Variante A: Direkt über den OpenDeck Plugin-Store oder GitHub Release
1. Suche im **OpenDeck Store** nach **„Twitch Viewer Deck“** oder lade unter [**Releases**](https://github.com/Enfalion/Twitch-Viewer-Plugin/releases) die neueste Datei `xyz.enfalion.twitchviewer.streamDeckPlugin` (oder `.zip`) herunter.
2. Öffne **OpenDeck** → **Einstellungen** → **Plugins** → **Aus Datei installieren**.
3. Starte OpenDeck einmal neu. *(Voraussetzung auf dem System: Node.js v18 oder v20+).*

#### Variante B: Direkt aus dem Quellcode (GitHub Clone)
```bash
git clone https://github.com/Enfalion/Twitch-Viewer-Plugin.git
cd Twitch-Viewer-Plugin/xyz.enfalion.twitchviewer.sdPlugin
npm install
```
Kopiere anschließend den Ordner `xyz.enfalion.twitchviewer.sdPlugin` in dein OpenDeck-Plugin-Verzeichnis:
* **Linux:** `~/.config/opendeck/plugins/` (oder `~/.local/share/opendeck/plugins/`)
* **Windows:** `%APPDATA%\opendeck\plugins\`
* **macOS:** `~/Library/Application Support/opendeck/plugins/`

### 🔑 1-Klick Twitch Login (Out-of-the-Box & Auto-Refresh!)

Eine offizielle **Public Standard-Client-ID ist bereits vorinstalliert** – du musst **keine** eigene Entwickler-App erstellen, und das Plugin erneuert deinen Login-Schlüssel alle 4 Stunden vollautomatisch im Hintergrund!

1. Ziehe eine beliebige **Twitch Viewer** Taste auf dein Deck.
2. Klicke im Menü direkt auf **„⚡ 1-Klick Twitch Login (mit 8-stelligem Code)“**.
3. Bestätige den angezeigten 8-stelligen Code im geöffneten Browser-Tab auf `twitch.tv/activate` – fertig! Deine gefolgten Kanäle werden sofort geladen.

---

<a id="english-documentation"></a>
## 🇬🇧 English Documentation

A cross-platform **OpenDeck & Stream Deck Plugin** tailored specifically for **Twitch Viewers** (Windows, Linux & macOS). Connect your Twitch account with a single click, place your favorite streamers on your deck, and see who is live at a glance!

* **Author:** Enfalion (`enfalion.xyz`)
* **Bundle ID:** `xyz.enfalion.twitchviewer`
* **Current Version:** `v1.3.4`
* **GitHub Repository:** [https://github.com/Enfalion/Twitch-Viewer-Plugin](https://github.com/Enfalion/Twitch-Viewer-Plugin)

### ✨ The 5 Core Features (v1.3.4)

1. **👤 Favorite Streamer (Live Status & 100% Optional Overlays)**
   * Displays the real Twitch avatar of your favorite streamer right on the key.
   * **Offline:** Avatar is automatically rendered in **grayscale** (with an `OFF` badge).
   * **Online (LIVE):** Avatar turns **full color** with a red live border (yellow border when the streamer just went live!).
   * **100% Optional:** Every single overlay (*Offline Grayscale, Red Live Border, Viewer Count, Streamer Name, Current Game/Category*) can be toggled individually.
   * **Live Status in Dropdown:** The channel selector immediately shows who is online (`🟢 LIVE - Streamer (Game)` vs. `⚫ OFF - Streamer`).

2. **🔄 Dynamic Live Slot (Auto-Rotate)**
   * Automatically displays your **currently live followed channels** and cycles through them every 10 seconds (or pin it to a fixed live rank `#1`, `#2`, `#3`, etc.).

3. **⏭ Dynamic Live Switcher (Next Key)**
   * Shows live on the key **how many of your followed channels are currently online** (e.g., `6 LIVE`) and cycles all *Dynamic Live Slots* on your deck to the next live streamer on press.

4. **🥷 Quick Chat / `!lurk` (With Channel Icon)**
   * Displays the avatar of the selected (or automatically the **last opened/active**) streamer right on the key and sends `!lurk` (or any custom message) to the Twitch chat on a short press.

5. **📺 MultiTwitch Split-Screen**
   * Enter 2 to 4 streamer names (e.g., `shroud + gronkh`) to open all streams side-by-side in a single browser window.

### 👆 Short Press vs. ⏳ Long Press (>= 500ms)

Every Streamer and Dynamic Live Slot key supports dual actions:
* **Short Press (Key Tap):** 🌐 Open in Default Browser | 🗔 Borderless Popout Player | 🚀 Custom Player / Streamlink / VLC (`streamlink https://twitch.tv/{channel} best`) | 💬 Popout Chat Only
* **Long Press (Key Hold >= 500ms):** ⏭ Next Live Streamer (Cycle) | 💬 Popout Chat Only | 🥷 Send `!lurk` to chat | 🚀 Streamlink / External Player

### 🚀 Installation

#### Option A: Via OpenDeck Marketplace or GitHub Releases
1. Search for **"Twitch Viewer Deck"** in the **OpenDeck Marketplace** or download the latest `xyz.enfalion.twitchviewer.streamDeckPlugin` (or `.zip`) from [**Releases**](https://github.com/Enfalion/Twitch-Viewer-Plugin/releases).
2. Open **OpenDeck** → **Settings** → **Plugins** → **Install from file**.
3. Restart OpenDeck once. *(Requires Node.js v18 or v20+ installed on your system).*

#### Option B: From Source (GitHub Clone)
```bash
git clone https://github.com/Enfalion/Twitch-Viewer-Plugin.git
cd Twitch-Viewer-Plugin/xyz.enfalion.twitchviewer.sdPlugin
npm install
```
Copy the `xyz.enfalion.twitchviewer.sdPlugin` folder into your OpenDeck plugins directory:
* **Linux:** `~/.config/opendeck/plugins/` (or `~/.local/share/opendeck/plugins/`)
* **Windows:** `%APPDATA%\opendeck\plugins\`
* **macOS:** `~/Library/Application Support/opendeck/plugins/`

### 🔑 1-Click Twitch Login (Pre-configured Public Client-ID & Auto-Refresh!)

An official **Public Twitch Client-ID is pre-installed** – no developer console setup required, and your `access_token` is automatically refreshed every 4 hours in the background!

1. Drag any **Twitch Viewer** action onto your deck.
2. Click **"⚡ 1-Click Twitch Login (with 8-digit Code)"** in the Property Inspector.
3. Confirm the 8-digit code in your browser at `twitch.tv/activate` – done!

---

<a id="custom-client-id-guide"></a>
## 🛠️ Eigene Twitch App / Client-ID hinterlegen (Admin & Developer Guide | DE / EN)

🇩🇪 **Deutsch:** Obwohl eine öffentliche Standard-Client-ID vorinstalliert ist, können Administratoren, Entwickler oder Forks jederzeit ihre **eigene Twitch-App** (`Client-ID` & optionales `Client-Secret`) verwenden:
1. Öffne die [Twitch Developer Console (`dev.twitch.tv/console/apps`)](https://dev.twitch.tv/console/apps) und klicke auf **„Anwendung registrieren“**.
2. Vergib einen Namen (z.B. `MeinOpenDeckViewer`) und trage als **OAuth-Weiterleitungs-URL** `http://localhost:3000` ein.
3. Wähle als Kategorie **„Application Integration“**.
4. **Wichtig – Client-Typ:** Wähle **„Öffentlich (Public)“**. *(Öffentliche Apps erneuern das Token alle 4 Stunden automatisch ohne Client-Secret. Falls du stattdessen „Vertraulich / Confidential“ wählst, musst du zusätzlich dein `Client-Secret` im Plugin eintragen).*
5. Öffne in OpenDeck bei einer Taste unten das Aufklappmenü **„⚙️ Erweiterte Login-Optionen / Eigene Client-ID“**, trage deine `Client-ID` (und ggf. dein `Client-Secret`) ein und klicke auf **„🔑 Zugangsdaten speichern & Code-Login starten“**.

🇬🇧 **English:** While a default Public Client-ID is pre-installed, administrators and developers can optionally use their **own custom Twitch Application** (`Client-ID` & optional `Client-Secret`):
1. Open the [Twitch Developer Console (`dev.twitch.tv/console/apps`)](https://dev.twitch.tv/console/apps) and click **"Register Your Application"**.
2. Enter a name (e.g., `MyOpenDeckViewer`) and set the **OAuth Redirect URL** to `http://localhost:3000`.
3. Select **"Application Integration"** as the category.
4. **Important – Client Type:** Select **"Public"**. *(Public apps allow automatic background token refresh every 4 hours without a secret. If you select "Confidential" instead, you must also enter your `Client-Secret` in the plugin).*
5. In OpenDeck, expand **"⚙️ Advanced Login Options / Custom Client-ID"** in the Property Inspector, enter your `Client-ID` (and optional `Client-Secret`), and click **"🔑 Save Credentials & Start Code Login"**.

---

## 📸 Screenshots & Preview

### 1. Twitch Login Options
<img width="2237" height="384" alt="Twitch Login Options" src="https://github.com/user-attachments/assets/1f572575-6828-457d-acff-9f9ac74a4920" />

### 2. Streamer aussuchen | Select your Streamer
<img width="789" height="811" alt="Select your Streamer" src="https://github.com/user-attachments/assets/9d1c2111-754e-4d4d-a465-8065d26a0216" />

### 3. Optionen | Overlay & Press Options
<img width="759" height="354" alt="Plugin Options" src="https://github.com/user-attachments/assets/f2c1a91f-0a11-4905-96b1-b8e19be6f284" />

---

<a id="maintainer-packaging-guide"></a>
## 📦 Maintainer Guide: Building `.zip` / `.streamDeckPlugin` & MD5 Checksums (v1.3.4)

```bash
# 1. Install production dependencies inside the plugin folder
cd xyz.enfalion.twitchviewer.sdPlugin
npm install --omit=dev
cd ..

# 2. Package clean release archive (excludes personal local token backups & logs!)
zip -r xyz.enfalion.twitchviewer.sdPlugin-v1.3.4.zip xyz.enfalion.twitchviewer.sdPlugin -x "*.git*" "*.DS_Store*" "*auth-backup.json*" "*.log*"

# 3. Create .streamDeckPlugin bundle
cp xyz.enfalion.twitchviewer.sdPlugin-v1.3.4.zip xyz.enfalion.twitchviewer.streamDeckPlugin

# 4. Generate MD5 checksum file
md5sum xyz.enfalion.twitchviewer.sdPlugin-v1.3.4.zip > xyz.enfalion.twitchviewer.sdPlugin-v1.3.4.zip.md5
```

---

## 📄 License

Published under the [MIT License](./LICENSE) – Copyright (c) 2026 Enfalion.
