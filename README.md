# 💜 OpenDeck Twitch Viewer Plugin (v1.3.0)

[![Version](https://img.shields.io/badge/version-1.3.0-9146FF?style=for-the-badge&logo=twitch&logoColor=white)](#)
[![Platform](https://img.shields.io/badge/platform-Windows%20%7C%20Linux%20%7C%20macOS-10b981?style=for-the-badge)](#)
[![Language](https://img.shields.io/badge/i18n-Deutsch%20%7C%20English-3b82f6?style=for-the-badge)](#)
[![License](https://img.shields.io/badge/license-MIT-f59e0b?style=for-the-badge)](./LICENSE)

> 🇩🇪 **[Deutsche Anleitung unten](#-deutsche-dokumentation)** | 🇬🇧 **[English Documentation below](#-english-documentation)** | 📦 **[Release Packaging & MD5 Guide](#-maintainer-guide-building-zip--md5-checksums)**

---

## 🇩🇪 Deutsche Dokumentation

Ein plattformübergreifendes **OpenDeck & Stream Deck Plugin** speziell für **Twitch-Zuschauer** (Windows, Linux & macOS). Melde dich einfach mit deinem Twitch-Konto an, lege deine Lieblingsstreamer auf dein Deck und sieh auf einen Blick, wer gerade live ist!

### ✨ Die 5 Kern-Funktionen (v1.3.0)

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

---

### 👆 Kurz drücken vs. ⏳ Lang drücken (>= 500ms)
Jede Streamer- und Live-Slot-Taste ist doppelt belegbar:
* **Kurz drücken (Short Tap):**
  * 🌐 Stream im Standard-Browser öffnen
  * 🗔 Rahmenlosen Twitch Popout-Player starten
  * 🚀 Eigenen Player starten (z.B. **Streamlink / VLC / MPV** über `streamlink https://twitch.tv/{channel} best`)
  * 💬 Nur Popout-Chat öffnen
* **Lang drücken (Long Hold >= 500ms):**
  * ⏭ Sofort zum nächsten Live-Streamer weiterschalten (Rotation)
  * 💬 Nur Popout-Chat öffnen
  * 🥷 Sofort `!lurk` Nachricht in den Chat senden
  * 🚀 Streamlink / Externen Player starten

---

### 🚀 Installation (Für Nutzer)

#### Variante A: Über eine fertige `.zip` / `.streamDeckPlugin` Release-Datei
1. Lade unter **[Releases](../../releases)** die neueste Datei `com.community.twitchviewer.streamDeckPlugin` (oder `.zip`) herunter.
2. Öffne **OpenDeck** &rarr; Klicke in den Einstellungen auf **Plugins** &rarr; **Aus Datei installieren** (oder entpacke den Ordner `com.community.twitchviewer.sdPlugin` direkt in dein OpenDeck `plugins`-Verzeichnis).
3. Starte OpenDeck einmal neu. *(Voraussetzung auf dem System: Node.js v18 oder v20+).*

#### Variante B: Direkt aus dem Quellcode (GitHub Clone)
```bash
git clone https://github.com/DEIN_GITHUB_NAME/DEIN_REPO_NAME.git
cd DEIN_REPO_NAME/com.community.twitchviewer.sdPlugin
npm install
```
Kopiere anschließend den Ordner `com.community.twitchviewer.sdPlugin` in dein OpenDeck-Plugin-Verzeichnis:
* **Linux:** `~/.config/opendeck/plugins/` (oder `~/.local/share/opendeck/plugins/`)
* **Windows:** `%APPDATA%\opendeck\plugins\`
* **macOS:** `~/Library/Application Support/opendeck/plugins/`

---

### 🔑 Einrichtung & 1-Klick Twitch Login (30 Sekunden)
Aus Sicherheitsgründen nutzt das Plugin den offiziellen **Twitch Device-Code Flow (`twitch.tv/activate`)** ohne geheimes Passwort:
1. Ziehe eine beliebige **Twitch Viewer** Taste auf dein Deck und klappe unten im Menü **„⚙️ Erweiterte Login-Optionen / Eigene Client-ID“** auf.
2. Öffne [dev.twitch.tv/console/apps](https://dev.twitch.tv/console/apps) und klicke auf **„Anwendung registrieren“**:
   * **Name:** z.B. `MeinOpenDeckViewer`
   * **OAuth-Weiterleitungs-URL:** `http://localhost`
   * **Kategorie:** `Application Integration`
   * **Client-Typ:** `Öffentlich (Public)`
3. Kopiere die angezeigte **Client-ID** in das Feld im Plugin und klicke auf **„⚡ 1-Klick Twitch Login (mit 8-stelligem Code)“**.
4. Bestätige den 8-stelligen Code im geöffneten Browser-Tab – fertig! Deine gefolgten Kanäle werden sofort geladen. Über den roten **Logout-Button** kannst du das Konto jederzeit wieder trennen.

---
---

## 🇬🇧 English Documentation

A cross-platform **OpenDeck & Stream Deck Plugin** tailored specifically for **Twitch Viewers** (Windows, Linux & macOS). Connect your Twitch account, place your favorite streamers on your deck, and see who is live at a glance!

### ✨ The 5 Core Features (v1.3.0)

1. **👤 Favorite Streamer (Live Status & 100% Optional Overlays)**
   * Displays the real Twitch avatar of your favorite streamer right on the key.
   * **Offline:** Avatar is automatically rendered in **grayscale** (with an `OFF` badge).
   * **Online (LIVE):** Avatar turns **full color** with a red live border (yellow border when the streamer just went live!).
   * **100% Optional:** Every single overlay (*Offline Grayscale, Red Live Border, Viewer Count, Streamer Name, Current Game/Category*) can be toggled individually – allowing a 100% clean avatar-only look if desired!
   * **Live Status in Dropdown:** The channel selector immediately shows who is online (`🟢 LIVE - Streamer (Game)` vs. `⚫ OFF - Streamer`).

2. **🔄 Dynamic Live Slot (Auto-Rotate)**
   * Following 50+ channels but only have 1 to 3 keys to spare? The *Dynamic Live Slot* automatically displays your **currently live followed channels**.
   * **Auto-Rotation:** Automatically cycles through all currently live streamers every 10 seconds (or pin it to a fixed live rank `#1`, `#2`, `#3`, etc.).

3. **⏭ Dynamic Live Switcher (Next Key)**
   * Shows live on the key **how many of your followed channels are currently online** (e.g., `6 LIVE`) and who is currently shown.
   * A short press immediately cycles all *Dynamic Live Slots* on your deck to the next live streamer.

4. **🥷 Quick Chat / `!lurk` (With Channel Icon)**
   * Displays the avatar of the selected (or automatically the **last opened/active**) streamer right on the key.
   * A **short press** immediately sends `!lurk` (or any custom message) to the Twitch chat without having to switch windows!

5. **📺 MultiTwitch Split-Screen**
   * Perfect for tournaments or co-op streams: Enter 2 to 4 streamer names (e.g., `shroud + gronkh`) to open all streams side-by-side in a single browser window.

---

### 👆 Short Press vs. ⏳ Long Press (>= 500ms)
Every Streamer and Dynamic Live Slot key supports dual actions:
* **Short Press (Key Tap):**
  * 🌐 Open stream in default browser
  * 🗔 Launch borderless Twitch Popout Player
  * 🚀 Run custom player command (e.g., **Streamlink / VLC / MPV** via `streamlink https://twitch.tv/{channel} best`)
  * 💬 Open Popout Chat only
* **Long Press (Key Hold >= 500ms):**
  * ⏭ Cycle to next Live Streamer immediately
  * 💬 Open Popout Chat only
  * 🥷 Send `!lurk` message to chat
  * 🚀 Launch Streamlink / External Player

---

### 🚀 Installation (For Users)

1. Download the latest `com.community.twitchviewer.streamDeckPlugin` (or `.zip`) from the **[Releases](../../releases)** page.
2. Open **OpenDeck** &rarr; Go to **Settings -> Plugins -> Install from file** (or extract the `com.community.twitchviewer.sdPlugin` folder directly into your OpenDeck `plugins` directory).
3. Restart OpenDeck. *(Requires Node.js v18 or v20+ installed on your system).*

---

### 🔑 Setup & 1-Click Twitch Login (30 Seconds)
This plugin uses the official, serverless **Twitch OAuth Device-Code Flow (`twitch.tv/activate`)**:
1. Drag any **Twitch Viewer** action onto your deck and expand **"⚙️ Advanced Login Options / Custom Client-ID"** in the Property Inspector.
2. Open [dev.twitch.tv/console/apps](https://dev.twitch.tv/console/apps) and click **"Register Your Application"**:
   * **Name:** e.g. `MyOpenDeckViewer`
   * **OAuth Redirect URL:** `http://localhost`
   * **Category:** `Application Integration`
   * **Client Type:** `Public`
3. Copy the generated **Client-ID** into the plugin field and click **"⚡ 1-Click Twitch Login (with 8-digit Code)"**.
4. Confirm the 8-digit code in your browser – done! You can disconnect your account anytime using the red **Logout** button.

---
---

## 📦 Maintainer Guide: Building `.zip` / `.streamDeckPlugin` & MD5 Checksums

*(DE / EN Anleitung für dich als Entwickler, um ein fertiges Release-Paket inkl. MD5-Prüfsumme für GitHub Releases und den OpenDeck Store zu schnüren).*

### 1. Vorbereitung: `node_modules` im Plugin-Ordner installieren
> **Wichtig:** Wenn Nutzer dein Plugin als `.zip` oder `.streamDeckPlugin` in OpenDeck installieren, sollte der Ordner `node_modules` (mit dem `ws`-Paket) bereits **im Paket enthalten** sein, damit Endnutzer nicht selbst `npm install` im Terminal tippen müssen!
> *(Auf GitHub im Quellcode wird `node_modules` durch die `.gitignore` ignoriert – aber in das fertige Release-Zip packen wir ihn mit hinein!)*

Öffne dein Terminal im Hauptordner, in dem der Ordner `com.community.twitchviewer.sdPlugin` liegt:

```bash
cd com.community.twitchviewer.sdPlugin
npm install --omit=dev
cd ..
```

---

### 2. Das `.zip` und `.streamDeckPlugin` Paket erstellen
*(Hinweis: Eine `.streamDeckPlugin`-Datei ist technisch gesehen **exakt eine normale `.zip`-Datei**, die lediglich die Dateiendung `.streamDeckPlugin` trägt! OpenDeck akzeptiert beim Installieren sowohl `.zip` als auch `.streamDeckPlugin`).*

#### 🐧 Unter Linux & 🍎 macOS:
Führe im übergeordneten Ordner (außerhalb von `com.community.twitchviewer.sdPlugin`) folgende Befehle aus:
```bash
# 1. Als .zip Archiv packen:
zip -r com.community.twitchviewer.sdPlugin-v1.3.0.zip com.community.twitchviewer.sdPlugin -x "*.git*" "*.DS_Store*"

# 2. Als offizielle .streamDeckPlugin Datei kopieren:
cp com.community.twitchviewer.sdPlugin-v1.3.0.zip com.community.twitchviewer.streamDeckPlugin
```

#### 🪟 Unter Windows (PowerShell):
Führe in der PowerShell (im Ordner oberhalb von `com.community.twitchviewer.sdPlugin`) folgende Befehle aus:
```powershell
# 1. Als .zip Archiv packen:
Compress-Archive -Path .\com.community.twitchviewer.sdPlugin -DestinationPath .\com.community.twitchviewer.sdPlugin-v1.3.0.zip -Force

# 2. Als offizielle .streamDeckPlugin Datei kopieren:
Copy-Item .\com.community.twitchviewer.sdPlugin-v1.3.0.zip .\com.community.twitchviewer.streamDeckPlugin
```

---

### 3. MD5- & SHA256-Datei (Prüfsumme / Hash) erzeugen
Viele Paket-Stores und Nutzer prüfen anhand einer `.md5`- oder `.sha256`-Datei, ob der Download unbeschädigt und unverändert ist.

#### 🐧 Unter Linux:
```bash
# Erstellt automatisch die .md5 Textdatei passend zum Archiv:
md5sum com.community.twitchviewer.sdPlugin-v1.3.0.zip > com.community.twitchviewer.sdPlugin-v1.3.0.zip.md5
md5sum com.community.twitchviewer.streamDeckPlugin > com.community.twitchviewer.streamDeckPlugin.md5

# Optional auch SHA256:
sha256sum com.community.twitchviewer.streamDeckPlugin > com.community.twitchviewer.streamDeckPlugin.sha256
```

#### 🪟 Unter Windows (PowerShell):
```powershell
# MD5-Hash berechnen und direkt als .md5 Datei speichern:
(Get-FileHash .\com.community.twitchviewer.sdPlugin-v1.3.0.zip -Algorithm MD5).Hash.ToLower() + "  com.community.twitchviewer.sdPlugin-v1.3.0.zip" | Out-File -Encoding ascii .\com.community.twitchviewer.sdPlugin-v1.3.0.zip.md5

(Get-FileHash .\com.community.twitchviewer.streamDeckPlugin -Algorithm MD5).Hash.ToLower() + "  com.community.twitchviewer.streamDeckPlugin" | Out-File -Encoding ascii .\com.community.twitchviewer.streamDeckPlugin.md5
```

#### 🍎 Unter macOS:
```bash
md5 -r com.community.twitchviewer.sdPlugin-v1.3.0.zip > com.community.twitchviewer.sdPlugin-v1.3.0.zip.md5
md5 -r com.community.twitchviewer.streamDeckPlugin > com.community.twitchviewer.streamDeckPlugin.md5
```

---

## 📄 License
Published under the [MIT License](./LICENSE). Free to fork, modify, and share!
