💜 OpenDeck Twitch Viewer Plugin (xyz.enfalion.twitchviewer)

🇩🇪 Deutsche Anleitung unten | 🇬🇧 English Documentation below | 📦 Maintainer Packaging Guide

🇩🇪 Deutsche Dokumentation

Ein plattformübergreifendes OpenDeck & Stream Deck Plugin speziell für Twitch-Zuschauer (Windows, Linux & macOS). Melde dich mit nur einem Klick mit deinem Twitch-Konto an, lege deine Lieblingsstreamer auf dein Deck und sieh auf einen Blick, wer gerade live ist!

Autor: Enfalion (enfalion.xyz)

Bundle-ID: xyz.enfalion.twitchviewer

GitHub-Repository: https://github.com/Enfalion/Twitch-Viewer-Plugin

✨ Die 5 Kern-Funktionen (v1.3.1)

👤 Favoriten-Streamer (Live-Status & 100% Optionale Overlays)

Zeigt das echte Twitch-Profilbild deines Favoriten direkt auf der Taste an.

Offline: Profilbild wird automatisch in Graustufen dargestellt (inkl. OFF-Badge).

Online (LIVE): Profilbild erstrahlt farbig mit rotem Live-Rahmen (gelber Rahmen, wenn der Streamer gerade frisch online gegangen ist!).

100% Optional: Jedes Overlay-Element (Graustufen bei Offline, Roter Live-Rahmen, Zuschauerzahl, Streamer-Name, aktuelles Spiel/Kategorie) lässt sich einzeln ein- oder ausschalten – auch ein komplett cleaner Modus (nur das Profilbild) ist möglich!

Live-Status im Auswahl-Menü: Direkt im Dropdown siehst du sofort, wer gerade online ist (🟢 LIVE - Streamer (Spiel) vs. ⚫ OFF - Streamer).

🔄 Dynamischer Live-Slot (Auto-Rotierend)

Du folgst 50 Streamern, hast aber nur Platz für 1 bis 3 Tasten? Der Dynamic Live Slot zeigt automatisch immer deine aktuell live streamenden Favoriten an.

Auto-Rotation: Schaltet auf Wunsch automatisch alle 10 Sekunden durch alle aktuell aktiven Live-Streams (oder lässt sich fest auf Live-Platz #1, #2, #3 usw. anpinnen).

⏭ Dynamic Live Switcher (Weiter-Taste)

Zeigt dir live auf der Taste an, wie viele deiner Favoriten gerade gleichzeitig online sind (z.B. 6 LIVE) und wer aktuell auf Platz 1 liegt.

Ein kurzer Druck schaltet sofort alle Dynamic Live Slots auf deinem Deck einen Streamer weiter.

🥷 Schnell-Chat / !lurk (Mit Kanal-Icon)

Zeigt das Profilbild des ausgewählten (oder automatisch des zuletzt geöffneten/aktiven) Streamers auf der Taste.

Ein kurzer Tastendruck sendet sofort !lurk (oder deinen eigenen Wunschtext) direkt in den Twitch-Chat – ganz ohne das Browserfenster suchen zu müssen!

📺 MultiTwitch Split-Screen

Perfekt für Turniere, Events oder Koop-Runden: Trage 2 bis 4 Streamer ein (z.B. gronkh + bonjwa + maxim) und öffne alle Streams nebeneinander in einem einzigen Split-Screen-Fenster.

👆 Kurz drücken vs. ⏳ Lang drücken (>= 500ms)

Jede Streamer- und Live-Slot-Taste ist doppelt belegbar:

Kurz drücken (Short Tap): 🌐 Standard-Browser | 🗔 Rahmenloser Popout-Player | 🚀 Streamlink / VLC / MPV (streamlink https://twitch.tv/{channel} best) | 💬 Nur Popout-Chat

Lang drücken (Long Hold >= 500ms): ⏭ Nächster Live-Streamer (Rotation) | 💬 Nur Popout-Chat | 🥷 Sofort !lurk senden | 🚀 Streamlink / Externer Player

🌍 Dynamische Sprach-Erkennung (DE / EN)

Das Plugin erkennt automatisch die in OpenDeck / Stream Deck eingestellte Sprache und stellt alle Menüs, Erklärungen sowie die Tasten-Beschriftungen live auf Deutsch oder Englisch um (inklusive manuellem DE | EN Umschalter im Einstellungs-Menü).

🚀 Installation

Variante A: Direkt über den OpenDeck Plugin-Store oder GitHub Release

Suche im OpenDeck Store nach „Twitch Viewer Deck“ oder lade unter Releases die neueste Datei xyz.enfalion.twitchviewer.streamDeckPlugin (oder .zip) herunter.

Öffne OpenDeck → Einstellungen → Plugins → Aus Datei installieren.

Starte OpenDeck einmal neu. (Voraussetzung auf dem System: Node.js v18 oder v20+).

Variante B: Direkt aus dem Quellcode (GitHub Clone)

git clone https://github.com/Enfalion/Twitch-Viewer-Plugin.git
cd Twitch-Viewer-Plugin/xyz.enfalion.twitchviewer.sdPlugin
npm install


Kopiere anschließend den Ordner xyz.enfalion.twitchviewer.sdPlugin in dein OpenDeck-Plugin-Verzeichnis:

Linux: ~/.config/opendeck/plugins/ (oder ~/.local/share/opendeck/plugins/)

Windows: %APPDATA%\opendeck\plugins\

macOS: ~/Library/Application Support/opendeck/plugins/

🔑 1-Klick Twitch Login (Out-of-the-Box!)

Eine offizielle Standard-Client-ID ist bereits vorinstalliert – du musst keine eigene Entwickler-App erstellen!

Ziehe eine beliebige Twitch Viewer Taste auf dein Deck.

Klicke im Menü direkt auf „⚡ 1-Klick Twitch Login (mit 8-stelligem Code)“.

Bestätige den angezeigten 8-stelligen Code im geöffneten Browser-Tab auf twitch.tv/activate – fertig! Deine gefolgten Kanäle werden sofort geladen. (Über die erweiterten Optionen kannst du auf Wunsch jederzeit eine eigene Client-ID hinterlegen oder dich per Logout-Button wieder abmelden).

🇬🇧 English Documentation

A cross-platform OpenDeck & Stream Deck Plugin tailored specifically for Twitch Viewers (Windows, Linux & macOS). Connect your Twitch account with a single click, place your favorite streamers on your deck, and see who is live at a glance!

Author: Enfalion (enfalion.xyz)

Bundle ID: xyz.enfalion.twitchviewer

GitHub Repository: https://github.com/Enfalion/Twitch-Viewer-Plugin

✨ The 5 Core Features (v1.3.1)

👤 Favorite Streamer (Live Status & 100% Optional Overlays)

Displays the real Twitch avatar of your favorite streamer right on the key.

Offline: Avatar is automatically rendered in grayscale (with an OFF badge).

Online (LIVE): Avatar turns full color with a red live border (yellow border when the streamer just went live!).

100% Optional: Every single overlay (Offline Grayscale, Red Live Border, Viewer Count, Streamer Name, Current Game/Category) can be toggled individually.

Live Status in Dropdown: The channel selector immediately shows who is online (🟢 LIVE - Streamer (Game) vs. ⚫ OFF - Streamer).

🔄 Dynamic Live Slot (Auto-Rotate)

Automatically displays your currently live followed channels and cycles through them every 10 seconds (or pin it to a fixed live rank #1, #2, #3, etc.).

⏭ Dynamic Live Switcher (Next Key)

Shows live on the key how many of your followed channels are currently online (e.g., 6 LIVE) and cycles all Dynamic Live Slots on your deck to the next live streamer on press.

🥷 Quick Chat / !lurk (With Channel Icon)

Displays the avatar of the selected (or automatically the last opened/active) streamer right on the key and sends !lurk (or any custom message) to the Twitch chat on a short press.

📺 MultiTwitch Split-Screen

Enter 2 to 4 streamer names (e.g., shroud + gronkh) to open all streams side-by-side in a single browser window.

👆 Short Press vs. ⏳ Long Press (>= 500ms)

Every Streamer and Dynamic Live Slot key supports dual actions:

Short Press (Key Tap): 🌐 Open in Default Browser | 🗔 Borderless Popout Player | 🚀 Custom Player / Streamlink / VLC (streamlink https://twitch.tv/{channel} best) | 💬 Popout Chat Only

Long Press (Key Hold >= 500ms): ⏭ Next Live Streamer (Cycle) | 💬 Popout Chat Only | 🥷 Send !lurk to chat | 🚀 Streamlink / External Player

🚀 Installation

Option A: Via OpenDeck Marketplace or GitHub Releases

Search for "Twitch Viewer Deck" in the OpenDeck Marketplace or download the latest xyz.enfalion.twitchviewer.streamDeckPlugin (or .zip) from Releases.

Open OpenDeck → Settings → Plugins → Install from file.

Restart OpenDeck once. (Requires Node.js v18 or v20+ installed on your system).

Option B: From Source (GitHub Clone)

git clone https://github.com/Enfalion/Twitch-Viewer-Plugin.git
cd Twitch-Viewer-Plugin/xyz.enfalion.twitchviewer.sdPlugin
npm install


Copy the xyz.enfalion.twitchviewer.sdPlugin folder into your OpenDeck plugins directory:

Linux: ~/.config/opendeck/plugins/ (or ~/.local/share/opendeck/plugins/)

Windows: %APPDATA%\opendeck\plugins\

macOS: ~/Library/Application Support/opendeck/plugins/

🔑 1-Click Twitch Login (Pre-configured Client-ID!)

A default Twitch Client-ID is pre-installed – no developer console setup required!

Drag any Twitch Viewer action onto your deck.

Click "⚡ 1-Click Twitch Login (with 8-digit Code)" in the Property Inspector.

Confirm the 8-digit code in your browser at twitch.tv/activate – done! (Advanced users can optionally provide a custom Client-ID under Advanced Login Options).

📦 Maintainer Guide: Building .zip / .streamDeckPlugin & MD5 Checksums

cd xyz.enfalion.twitchviewer.sdPlugin
npm install --omit=dev
cd ..
zip -r xyz.enfalion.twitchviewer.sdPlugin-v1.3.1.zip xyz.enfalion.twitchviewer.sdPlugin -x "*.git*" "*.DS_Store*"
cp xyz.enfalion.twitchviewer.sdPlugin-v1.3.1.zip xyz.enfalion.twitchviewer.streamDeckPlugin
md5sum xyz.enfalion.twitchviewer.sdPlugin-v1.3.1.zip > xyz.enfalion.twitchviewer.sdPlugin-v1.3.1.zip.md5

Twitch Login Options:

<img width="2237" height="384" alt="image" src="https://github.com/user-attachments/assets/1f572575-6828-457d-acff-9f9ac74a4920" />

Streamer aussuchen | Select your Streamer

<img width="789" height="811" alt="Bildschirmfoto_20261019_012112" src="https://github.com/user-attachments/assets/9d1c2111-754e-4d4d-a465-8065d26a0216" />

Optionen:

<img width="759" height="354" alt="Bildschirmfoto_20261019_012254" src="https://github.com/user-attachments/assets/f2c1a91f-0a11-4905-96b1-b8e19be6f284" />



📄 License

Published under the MIT License – Copyright (c) 2026 Enfalion.
