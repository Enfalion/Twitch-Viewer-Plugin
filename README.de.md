# 💜 OpenDeck Twitch Viewer Plugin (`xyz.enfalion.twitchviewer`)

> 🌐 **Sprache wählen / Select Language:** 🇩🇪 **Deutsch (Aktuell)** | 🇬🇧 [**English (Click here)**](./README.md) | 📦 [**Maintainer Packaging Guide**](#maintainer-guide)

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

<a id="custom-client-id-guide"></a>
## 🛠️ Eigene Twitch App / Client-ID hinterlegen (Admin & Developer Guide | DE / EN)

🇩🇪 **Deutsch:** Obwohl eine öffentliche Standard-Client-ID vorinstalliert ist, können Administratoren, Entwickler oder Forks jederzeit ihre **eigene Twitch-App** (`Client-ID` & optionales `Client-Secret`) verwenden:
1. Öffne die [Twitch Developer Console (`dev.twitch.tv/console/apps`)](https://dev.twitch.tv/console/apps) und klicke auf **„Anwendung registrieren“**.
2. Vergib einen Namen (z.B. `MeinOpenDeckViewer`) und trage als **OAuth-Weiterleitungs-URL** `http://localhost:3000` ein.
3. Wähle als Kategorie **„Application Integration“**.
4. **Wichtig – Client-Typ:** Wähle **„Öffentlich (Public)“**. *(Öffentliche Apps erneuern das Token alle 4 Stunden automatisch ohne Client-Secret. Falls du stattdessen „Vertraulich / Confidential“ wählst, musst du zusätzlich dein `Client-Secret` im Plugin eintragen).*
5. Öffne in OpenDeck bei einer Taste unten das Aufklappmenü **„⚙️ Erweiterte Login-Optionen / Eigene Client-ID“**, trage deine `Client-ID` (und ggf. dein `Client-Secret`) ein und klicke auf **„🔑 Zugangsdaten speichern & Code-Login starten“**.

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
