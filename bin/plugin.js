#!/usr/bin/env node
/**
 * ============================================================================
 * OPENDECK TWITCH VIEWER PLUGIN v1.3.4 - MAIN BACKEND (bin/plugin.js)
 * Author: Enfalion (https://github.com/Enfalion/Twitch-Viewer-Plugin)
 * Bundle-ID: xyz.enfalion.twitchviewer
 *
 * DE: Hauptprogramm des Plugins (v1.3.4):
 *     - Offizielle Public Client-ID (nglaah171uy4d4p4fbogi2au3w3oj7) für
 *       vollautomatischen OAuth2 Token-Refresh alle 4 Stunden ohne Secret.
 *     - Unterstützt optional eigene Entwickler-Client-IDs & Client-Secrets.
 *     - Lokales Token-Backup & 12s Fetch-Timeouts gegen Netzwerk-Aussetzer.
 *
 * EN: Main backend of the plugin (v1.3.4):
 *     - Official Public Client-ID (nglaah171uy4d4p4fbogi2au3w3oj7) enabling
 *       seamless OAuth2 refresh_token rotation without a client secret.
 *     - Supports optional custom developer Client-IDs & Client-Secrets.
 *     - Local token persistence & 12s fetch timeouts for rock-solid stability.
 * ============================================================================
 */

import WebSocket from 'ws';
import { exec } from 'child_process';
import os from 'os';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PLUGIN_ROOT = path.resolve(__dirname, '..');
const AUTH_BACKUP_PATH = path.join(PLUGIN_ROOT, 'auth-backup.json');

const DEFAULT_CLIENT_ID = 'nglaah171uy4d4p4fbogi2au3w3oj7';
const LEGACY_CONFIDENTIAL_CLIENT_ID = 'swyl7vd2qbrbq3hj8nuo8zkrywtyga';
const DEFAULT_CLIENT_SECRET = '';
const HOLD_THRESHOLD_MS = 500;
const POLL_INTERVAL_MS = 45000;
const FETCH_TIMEOUT_MS = 12000;

let ws = null;
let pluginUUID = null;
let activeDevicePollTimer = null;
let appLanguage = 'de';
let isRefreshingToken = false;
let isPolling = false;

const I18N_BACKEND = {
    de: {
        waitingForLive: 'Warte auf Live...',
        activeStream: 'Aktiver Stream',
        nextBtn: '⚡ WEITER ⏭',
        nowPrefix: 'Jetzt',
        noneOnline: 'Keiner online',
        missingClientId: 'Bitte unten unter "Erweiterte Login-Optionen" einmalig deine Twitch Client-ID eintragen!',
        invalidClientId: 'Ungültige Client-ID! Bitte prüfe deine Twitch Client-ID.'
    },
    en: {
        waitingForLive: 'Waiting for Live...',
        activeStream: 'Active Stream',
        nextBtn: '⚡ NEXT ⏭',
        nowPrefix: 'Now',
        noneOnline: 'None online',
        missingClientId: 'Please enter your Twitch Client-ID once under "Advanced Login Options" below!',
        invalidClientId: 'Invalid Client-ID! Please check your Twitch Client-ID.'
    }
};

function t(key) {
    const dict = I18N_BACKEND[appLanguage] || I18N_BACKEND.en;
    return dict[key] || I18N_BACKEND.en[key] || key;
}

let globalSettings = {
    clientId: DEFAULT_CLIENT_ID,
    clientSecret: DEFAULT_CLIENT_SECRET,
    accessToken: '',
    refreshToken: '',
    userId: '',
    userLogin: '',
    languageOverride: ''
};

function normalizeClientId(cid) {
    const trimmed = (cid || '').trim();
    if (!trimmed || trimmed === LEGACY_CONFIDENTIAL_CLIENT_ID) {
        return DEFAULT_CLIENT_ID;
    }
    return trimmed;
}

function saveLocalAuthBackup() {
    try {
        fs.writeFileSync(AUTH_BACKUP_PATH, JSON.stringify(globalSettings, null, 2), 'utf8');
    } catch (e) {}
}

function loadLocalAuthBackup() {
    try {
        if (fs.existsSync(AUTH_BACKUP_PATH)) {
            const raw = fs.readFileSync(AUTH_BACKUP_PATH, 'utf8');
            const parsed = JSON.parse(raw);
            if (parsed && typeof parsed === 'object') {
                if (parsed.clientId === LEGACY_CONFIDENTIAL_CLIENT_ID) {
                    parsed.clientId = DEFAULT_CLIENT_ID;
                    parsed.accessToken = '';
                    parsed.refreshToken = '';
                    parsed.userId = '';
                    parsed.userLogin = '';
                } else {
                    parsed.clientId = normalizeClientId(parsed.clientId);
                }
                return parsed;
            }
        }
    } catch (e) {}
    return null;
}

function getEffectiveClientId() {
    return normalizeClientId(globalSettings.clientId);
}

function getEffectiveClientSecret() {
    return (globalSettings.clientSecret && globalSettings.clientSecret.trim() !== '')
        ? globalSettings.clientSecret.trim()
        : DEFAULT_CLIENT_SECRET;
}

const visibleContexts = new Map();
const activeKeyTimers = new Map();
let followedChannelsCache = [];
const avatarBase64Cache = new Map();

let dynamicLiveOffset = 0;
let lastActiveChannelLogin = '';

async function fetchWithTimeout(url, options = {}, timeoutMs = FETCH_TIMEOUT_MS) {
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), timeoutMs);
    try {
        const res = await fetch(url, { ...options, signal: controller.signal });
        clearTimeout(id);
        return res;
    } catch (err) {
        clearTimeout(id);
        throw err;
    }
}

function launchStreamOrPlayer(channelLogin, mode = 'browser', customCmd = '') {
    if (!channelLogin) return;
    lastActiveChannelLogin = channelLogin.toLowerCase();
    renderAllVisibleKeys();

    if (mode === 'streamlink') {
        const template = (customCmd && customCmd.trim() !== '')
            ? customCmd
            : 'streamlink https://twitch.tv/{channel} best';
        const safeChannel = channelLogin.replace(/[^a-zA-Z0-9_]/g, '');
        const finalCommand = template
            .replace(/\{channel\}/g, safeChannel)
            .replace(/\{url\}/g, `https://www.twitch.tv/${safeChannel}`);

        exec(finalCommand, (err) => {
            if (err) console.error('[OS-Launcher] Custom command error:', err.message);
        });
        return;
    }

    let targetUrl = `https://www.twitch.tv/${channelLogin}`;
    if (mode === 'popout') {
        targetUrl = `https://player.twitch.tv/?channel=${channelLogin}&parent=twitch.tv`;
    } else if (mode === 'chat') {
        targetUrl = `https://www.twitch.tv/popout/${channelLogin}/chat?popout=`;
    }

    openUrlInDefaultBrowser(targetUrl);
}

function openUrlInDefaultBrowser(url) {
    const platform = os.platform();
    if (platform === 'win32') {
        exec(`start "" "${url}"`);
    } else if (platform === 'darwin') {
        exec(`open "${url}"`);
    } else {
        exec(`xdg-open "${url}"`);
    }
}

async function getAvatarBase64(avatarUrl) {
    if (!avatarUrl) return null;
    if (avatarBase64Cache.has(avatarUrl)) {
        return avatarBase64Cache.get(avatarUrl);
    }
    try {
        const res = await fetchWithTimeout(avatarUrl, {}, 8000);
        const arrayBuffer = await res.arrayBuffer();
        const base64 = Buffer.from(arrayBuffer).toString('base64');
        const mime = res.headers.get('content-type') || 'image/jpeg';
        const dataUri = `data:${mime};base64,${base64}`;
        avatarBase64Cache.set(avatarUrl, dataUri);
        return dataUri;
    } catch (err) {
        return null;
    }
}

function escapeXml(unsafe = '') {
    return String(unsafe)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&apos;');
}

function renderStreamerKeySvg(streamer, settings = {}, topRightPill = null) {
    if (!streamer) {
        const emptySlotSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="144" height="144" viewBox="0 0 144 144">
            <rect width="144" height="144" fill="#121215"/>
            <rect x="8" y="8" width="128" height="128" rx="16" fill="none" stroke="#27272a" stroke-width="2" stroke-dasharray="6,6"/>
            <text x="72" y="64" text-anchor="middle" fill="#a1a1aa" font-family="sans-serif" font-weight="bold" font-size="13">${escapeXml(topRightPill || 'LIVE-SLOT')}</text>
            <text x="72" y="86" text-anchor="middle" fill="#52525b" font-family="sans-serif" font-size="11">${escapeXml(t('waitingForLive'))}</text>
        </svg>`;
        return `data:image/svg+xml;base64,${Buffer.from(emptySlotSvg).toString('base64')}`;
    }

    const showName = settings.showName !== false;
    const showViewers = settings.showViewers !== false;
    const showGame = settings.showGame === true;
    const showLiveBorder = settings.showLiveBorder !== false;
    const grayscaleOffline = settings.grayscaleOffline !== false;

    const isLive = Boolean(streamer.live);
    const applyGrayscale = !isLive && grayscaleOffline;

    const viewersFormatted = streamer.viewers >= 1000
        ? (streamer.viewers / 1000).toFixed(1) + 'K'
        : String(streamer.viewers || 0);

    const initials = (streamer.displayName || 'TW').slice(0, 2).toUpperCase();

    const filterDef = `
        <defs>
            <filter id="offlineGray">
                <feColorMatrix type="matrix" values="0.33 0.33 0.33 0 0  0.33 0.33 0.33 0 0  0.33 0.33 0.33 0 0  0 0 0 1 0"/>
            </filter>
            <linearGradient id="bottomFade" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stop-color="#000000" stop-opacity="0"/>
                <stop offset="50%" stop-color="#000000" stop-opacity="0.82"/>
                <stop offset="100%" stop-color="#000000" stop-opacity="0.96"/>
            </linearGradient>
        </defs>
    `;

    const bgLayer = streamer.avatarBase64
        ? `<image href="${streamer.avatarBase64}" x="0" y="0" width="144" height="144" preserveAspectRatio="xMidYMid slice" ${applyGrayscale ? 'filter="url(#offlineGray)" opacity="0.55"' : ''}/>`
        : `<rect width="144" height="144" fill="${isLive ? '#9146FF' : '#27272a'}"/>
           <text x="72" y="82" text-anchor="middle" fill="#ffffff" font-family="sans-serif" font-weight="bold" font-size="36">${escapeXml(initials)}</text>`;

    let bottomOverlay = '';
    if (showName || showGame) {
        const nameY = showGame ? 115 : 126;
        const gameText = isLive ? (streamer.game || 'Live').slice(0, 18) : 'OFFLINE';
        bottomOverlay = `
            <rect x="0" y="76" width="144" height="68" fill="url(#bottomFade)"/>
            ${showName ? `<text x="72" y="${nameY}" text-anchor="middle" fill="${isLive ? '#ffffff' : '#a1a1aa'}" font-family="sans-serif" font-weight="bold" font-size="15">${escapeXml((streamer.displayName || '').slice(0, 13))}</text>` : ''}
            ${showGame ? `<text x="72" y="133" text-anchor="middle" fill="${isLive ? '#d4d4d8' : '#71717a'}" font-family="sans-serif" font-size="11">${escapeXml(gameText)}</text>` : ''}
        `;
    }

    let borderOverlay = '';
    if (isLive && showLiveBorder) {
        const borderColor = streamer.justWentLive ? '#facc15' : '#ef4444';
        borderOverlay = `<rect x="3" y="3" width="138" height="138" rx="14" fill="none" stroke="${borderColor}" stroke-width="6"/>`;
    }

    let topLeftBadge = '';
    if (isLive && showViewers) {
        topLeftBadge = `
            <rect x="10" y="10" width="68" height="22" rx="6" fill="#000000" fill-opacity="0.82"/>
            <circle cx="21" cy="21" r="4" fill="#ef4444"/>
            <text x="30" y="25" fill="#ffffff" font-family="sans-serif" font-weight="bold" font-size="12">${escapeXml(viewersFormatted)}</text>
        `;
    } else if (!isLive) {
        topLeftBadge = `
            <rect x="10" y="10" width="42" height="20" rx="5" fill="#18181b" fill-opacity="0.88"/>
            <text x="31" y="24" text-anchor="middle" fill="#71717a" font-family="sans-serif" font-weight="bold" font-size="10">OFF</text>
        `;
    }

    let topRightBadge = '';
    if (topRightPill) {
        topRightBadge = `
            <rect x="92" y="10" width="42" height="20" rx="5" fill="#f59e0b"/>
            <text x="113" y="24" text-anchor="middle" fill="#000000" font-family="sans-serif" font-weight="bold" font-size="11">${escapeXml(topRightPill)}</text>
        `;
    }

    const svgString = `<svg xmlns="http://www.w3.org/2000/svg" width="144" height="144" viewBox="0 0 144 144">
        ${filterDef}
        ${bgLayer}
        ${bottomOverlay}
        ${borderOverlay}
        ${topLeftBadge}
        ${topRightBadge}
    </svg>`;

    return `data:image/svg+xml;base64,${Buffer.from(svgString).toString('base64')}`;
}

function renderQuickChatWithAvatarSvg(streamer, customLabel = '') {
    const accentColor = '#10b981';
    const badgeText = '💬 CHAT';
    const defaultTitle = customLabel || '!lurk';
    const targetName = streamer ? streamer.displayName : t('activeStream');

    const bgLayer = (streamer && streamer.avatarBase64)
        ? `<image href="${streamer.avatarBase64}" x="0" y="0" width="144" height="144" preserveAspectRatio="xMidYMid slice" opacity="0.65"/>`
        : `<rect width="144" height="144" fill="#0f291e"/>`;

    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="144" height="144" viewBox="0 0 144 144">
        <defs>
            <linearGradient id="actFade" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stop-color="#000000" stop-opacity="0.15"/>
                <stop offset="55%" stop-color="#000000" stop-opacity="0.80"/>
                <stop offset="100%" stop-color="#000000" stop-opacity="0.96"/>
            </linearGradient>
        </defs>
        ${bgLayer}
        <rect width="144" height="144" fill="url(#actFade)"/>
        <rect x="3" y="3" width="138" height="138" rx="14" fill="none" stroke="${accentColor}" stroke-width="5"/>
        <rect x="10" y="10" width="76" height="22" rx="6" fill="${accentColor}"/>
        <text x="48" y="25" text-anchor="middle" fill="#000000" font-family="sans-serif" font-weight="bold" font-size="11">${escapeXml(badgeText)}</text>
        <text x="72" y="108" text-anchor="middle" fill="#ffffff" font-family="sans-serif" font-weight="bold" font-size="15">${escapeXml(defaultTitle.slice(0, 13))}</text>
        <text x="72" y="128" text-anchor="middle" fill="${accentColor}" font-family="sans-serif" font-weight="bold" font-size="11">@${escapeXml(targetName.slice(0, 14))}</text>
    </svg>`;

    return `data:image/svg+xml;base64,${Buffer.from(svg).toString('base64')}`;
}

function renderLiveSwitcherKeySvg(liveStreamers, currentOffset) {
    const count = liveStreamers.length;
    const currentTop = liveStreamers[currentOffset % Math.max(count, 1)];
    const subLine = currentTop
        ? `${t('nowPrefix')}: ${currentTop.displayName.slice(0, 11)}`
        : t('noneOnline');

    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="144" height="144" viewBox="0 0 144 144">
        <rect width="144" height="144" fill="#18181b"/>
        <rect x="4" y="4" width="136" height="136" rx="14" fill="none" stroke="#f59e0b" stroke-width="4"/>
        <circle cx="34" cy="36" r="7" fill="${count > 0 ? '#ef4444' : '#52525b'}"/>
        <text x="80" y="42" text-anchor="middle" fill="#ffffff" font-family="sans-serif" font-weight="bold" font-size="18">${count} LIVE</text>
        <text x="72" y="82" text-anchor="middle" fill="#f59e0b" font-family="sans-serif" font-weight="bold" font-size="13">${escapeXml(t('nextBtn'))}</text>
        <text x="72" y="118" text-anchor="middle" fill="#d4d4d8" font-family="sans-serif" font-size="11">${escapeXml(subLine)}</text>
    </svg>`;

    return `data:image/svg+xml;base64,${Buffer.from(svg).toString('base64')}`;
}

function renderMultiTwitchKeySvg(channelsStr = '') {
    const list = channelsStr.split(/[\s,+]+/).filter(Boolean);
    const label = list.length >= 2 ? `${list[0].slice(0, 6)} + ${list[1].slice(0, 6)}` : 'Split-Screen';
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="144" height="144" viewBox="0 0 144 144">
        <rect width="144" height="144" fill="#1e1b4b"/>
        <rect x="4" y="4" width="136" height="136" rx="14" fill="none" stroke="#818cf8" stroke-width="4"/>
        <rect x="22" y="28" width="46" height="36" rx="4" fill="#312e81" stroke="#a5b4fc" stroke-width="2"/>
        <rect x="76" y="28" width="46" height="36" rx="4" fill="#312e81" stroke="#a5b4fc" stroke-width="2"/>
        <text x="72" y="96" text-anchor="middle" fill="#ffffff" font-family="sans-serif" font-weight="bold" font-size="14">MultiTwitch</text>
        <text x="72" y="118" text-anchor="middle" fill="#a5b4fc" font-family="sans-serif" font-size="11">${escapeXml(label)}</text>
    </svg>`;
    return `data:image/svg+xml;base64,${Buffer.from(svg).toString('base64')}`;
}

async function validateAndProactivelyRefreshToken() {
    if (!globalSettings.accessToken) return false;
    try {
        const res = await fetchWithTimeout('https://id.twitch.tv/oauth2/validate', {
            headers: { 'Authorization': `OAuth ${globalSettings.accessToken}` }
        });
        if (res.status === 200) {
            const data = await res.json();
            if (data.client_id === LEGACY_CONFIDENTIAL_CLIENT_ID) {
                globalSettings.accessToken = '';
                globalSettings.refreshToken = '';
                globalSettings.userId = '';
                globalSettings.userLogin = '';
                saveGlobalSettings();
                return false;
            }
            const expiresIn = data.expires_in || 0;
            if (expiresIn < 1800 && globalSettings.refreshToken) {
                await refreshTwitchAccessToken();
            }
            return true;
        } else {
            return await refreshTwitchAccessToken();
        }
    } catch (err) {
        return false;
    }
}

async function refreshTwitchAccessToken() {
    if (isRefreshingToken) return false;
    const cid = getEffectiveClientId();
    const csecret = getEffectiveClientSecret();
    if (!cid || !globalSettings.refreshToken) return false;

    isRefreshingToken = true;
    try {
        const params = new URLSearchParams();
        params.append('client_id', cid);
        if (csecret) {
            params.append('client_secret', csecret);
        }
        params.append('grant_type', 'refresh_token');
        params.append('refresh_token', globalSettings.refreshToken);

        const res = await fetchWithTimeout('https://id.twitch.tv/oauth2/token', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: params.toString()
        });
        const data = await res.json();

        if (res.ok && data.access_token) {
            globalSettings.accessToken = data.access_token;
            if (data.refresh_token) {
                globalSettings.refreshToken = data.refresh_token;
            }
            saveGlobalSettings();
            isRefreshingToken = false;
            return true;
        }
    } catch (err) {}
    isRefreshingToken = false;
    return false;
}

async function twitchHelixFetch(url, options = {}) {
    const cid = getEffectiveClientId();
    const makeHeaders = () => ({
        ...(options.headers || {}),
        'Client-ID': cid,
        'Authorization': `Bearer ${globalSettings.accessToken}`
    });

    let res = await fetchWithTimeout(url, { ...options, headers: makeHeaders() });
    if (res.status === 401 && globalSettings.refreshToken) {
        const refreshed = await refreshTwitchAccessToken();
        if (refreshed) {
            res = await fetchWithTimeout(url, { ...options, headers: makeHeaders() });
        }
    }
    return res;
}

async function startTwitchDeviceAuth(clientIdInput, clientSecretInput, piContext) {
    const clientId = normalizeClientId(clientIdInput || getEffectiveClientId());
    globalSettings.clientId = clientId;
    if (clientSecretInput !== undefined) {
        globalSettings.clientSecret = clientSecretInput.trim();
    }
    if (!clientId) {
        sendToPropertyInspector(piContext, {
            event: 'authError',
            message: t('missingClientId')
        });
        return;
    }

    if (activeDevicePollTimer) {
        clearInterval(activeDevicePollTimer);
        activeDevicePollTimer = null;
    }

    try {
        const scopes = encodeURIComponent('user:read:follows user:write:chat');
        const res = await fetchWithTimeout('https://id.twitch.tv/oauth2/device', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: `client_id=${encodeURIComponent(clientId)}&scopes=${scopes}`
        });
        const data = await res.json();

        if (!data.device_code) {
            sendToPropertyInspector(piContext, {
                event: 'authError',
                message: data.message || t('invalidClientId')
            });
            return;
        }

        openUrlInDefaultBrowser(data.verification_uri);

        sendToPropertyInspector(piContext, {
            event: 'deviceCodeReady',
            userCode: data.user_code,
            verificationUri: data.verification_uri
        });

        activeDevicePollTimer = setInterval(async () => {
            try {
                const tokenRes = await fetchWithTimeout('https://id.twitch.tv/oauth2/token', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                    body: `client_id=${encodeURIComponent(clientId)}&device_code=${encodeURIComponent(data.device_code)}&grant_type=urn:ietf:params:oauth:grant-type:device_code`
                });
                const tokenData = await tokenRes.json();

                if (tokenData.access_token) {
                    clearInterval(activeDevicePollTimer);
                    activeDevicePollTimer = null;

                    globalSettings.clientId = clientId;
                    globalSettings.accessToken = tokenData.access_token;
                    globalSettings.refreshToken = tokenData.refresh_token || '';

                    await fetchCurrentTwitchUser();
                    saveGlobalSettings();
                    await refreshTwitchDataAndRenderAll();

                    sendInspectorState(piContext, 'authSuccess');
                }
            } catch (e) {}
        }, (data.interval || 5) * 1000);
    } catch (err) {
        sendToPropertyInspector(piContext, { event: 'authError', message: err.message });
    }
}

function logoutTwitchAccount(piContext) {
    if (activeDevicePollTimer) {
        clearInterval(activeDevicePollTimer);
        activeDevicePollTimer = null;
    }

    globalSettings.clientId = normalizeClientId(globalSettings.clientId);
    globalSettings.accessToken = '';
    globalSettings.refreshToken = '';
    globalSettings.userId = '';
    globalSettings.userLogin = '';
    followedChannelsCache = [];
    lastActiveChannelLogin = '';

    saveGlobalSettings();
    renderAllVisibleKeys();

    sendInspectorState(piContext, 'loggedOut');
}

async function fetchCurrentTwitchUser() {
    try {
        const res = await twitchHelixFetch('https://api.twitch.tv/helix/users');
        const json = await res.json();
        if (json.data && json.data[0]) {
            globalSettings.userId = json.data[0].id;
            globalSettings.userLogin = json.data[0].display_name;
        }
    } catch (err) {}
}

async function refreshTwitchDataAndRenderAll() {
    if (isPolling) return;
    const cid = getEffectiveClientId();
    if (!cid || !globalSettings.accessToken) {
        renderAllVisibleKeys();
        return;
    }

    isPolling = true;
    try {
        if (!globalSettings.userId) {
            await fetchCurrentTwitchUser();
            if (!globalSettings.userId) {
                isPolling = false;
                renderAllVisibleKeys();
                return;
            }
        }

        const followedRes = await twitchHelixFetch(
            `https://api.twitch.tv/helix/channels/followed?user_id=${globalSettings.userId}&first=100`
        );
        if (!followedRes.ok) {
            isPolling = false;
            renderAllVisibleKeys();
            return;
        }
        const followedJson = await followedRes.json();
        const followedList = followedJson.data || [];

        if (followedList.length === 0) {
            isPolling = false;
            return;
        }

        const broadcasterIds = followedList.map(c => c.broadcaster_id);

        const userQuery = broadcasterIds.slice(0, 100).map(id => `id=${id}`).join('&');
        const usersRes = await twitchHelixFetch(`https://api.twitch.tv/helix/users?${userQuery}`);
        const usersJson = await usersRes.json();
        const userMap = new Map((usersJson.data || []).map(u => [u.id, u]));

        const streamQuery = broadcasterIds.slice(0, 100).map(id => `user_id=${id}`).join('&');
        const streamsRes = await twitchHelixFetch(`https://api.twitch.tv/helix/streams?${streamQuery}`);
        const streamsJson = await streamsRes.json();
        const liveMap = new Map((streamsJson.data || []).map(s => [s.user_id, s]));

        const previousLiveIds = new Set(followedChannelsCache.filter(c => c.live).map(c => c.id));

        const updatedCache = [];
        for (const item of followedList) {
            const u = userMap.get(item.broadcaster_id);
            const liveStream = liveMap.get(item.broadcaster_id);
            const isNowLive = Boolean(liveStream);
            const justWentLive = isNowLive && previousLiveIds.size > 0 && !previousLiveIds.has(item.broadcaster_id);

            const avatarBase64 = u ? await getAvatarBase64(u.profile_image_url) : null;

            updatedCache.push({
                id: item.broadcaster_id,
                login: item.broadcaster_login,
                displayName: item.broadcaster_name,
                avatarBase64,
                live: isNowLive,
                viewers: liveStream ? liveStream.viewer_count : 0,
                game: liveStream ? liveStream.game_name : '',
                title: liveStream ? liveStream.title : '',
                justWentLive
            });
        }

        updatedCache.sort((a, b) => {
            if (a.live && !b.live) return -1;
            if (!a.live && b.live) return 1;
            if (a.live && b.live) return b.viewers - a.viewers;
            return a.displayName.localeCompare(b.displayName);
        });

        followedChannelsCache = updatedCache;
        renderAllVisibleKeys();
    } catch (err) {
        console.error('[Twitch-API] Poll error:', err.message);
    } finally {
        isPolling = false;
    }
}

function resolveTargetStreamer(preferredLogin) {
    if (preferredLogin && preferredLogin.trim() !== '') {
        const found = followedChannelsCache.find(c => c.login.toLowerCase() === preferredLogin.toLowerCase());
        if (found) return found;
    }
    if (lastActiveChannelLogin) {
        const active = followedChannelsCache.find(c => c.login.toLowerCase() === lastActiveChannelLogin.toLowerCase());
        if (active) return active;
    }
    return followedChannelsCache.find(c => c.live) || followedChannelsCache[0] || null;
}

async function sendQuickChatMessage(channelLogin, messageText, context) {
    const targetChannel = resolveTargetStreamer(channelLogin);
    if (!targetChannel || !globalSettings.accessToken || !globalSettings.userId) {
        sendShowAlert(context);
        return;
    }

    try {
        const res = await twitchHelixFetch('https://api.twitch.tv/helix/chat/messages', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                broadcaster_id: targetChannel.id,
                sender_id: globalSettings.userId,
                message: messageText || '!lurk'
            })
        });
        if (res.ok) {
            sendShowOk(context);
        } else {
            sendShowAlert(context);
        }
    } catch (err) {
        sendShowAlert(context);
    }
}

function getSortedDynamicSlotContexts() {
    const autoSlots = [];
    for (const [context, info] of visibleContexts.entries()) {
        if (info.action === 'xyz.enfalion.twitchviewer.autoslot') {
            autoSlots.push({ context, ...info });
        }
    }
    autoSlots.sort((a, b) => {
        const rowDiff = (a.coordinates?.row || 0) - (b.coordinates?.row || 0);
        if (rowDiff !== 0) return rowDiff;
        return (a.coordinates?.column || 0) - (b.coordinates?.column || 0);
    });
    return autoSlots;
}

function renderAllVisibleKeys() {
    const liveStreamers = followedChannelsCache.filter(c => c.live);
    const sortedAutoSlots = getSortedDynamicSlotContexts();

    for (const [context, info] of visibleContexts.entries()) {
        const { action, settings } = info;

        if (action === 'xyz.enfalion.twitchviewer.streamer') {
            const streamer = followedChannelsCache.find(c => c.login === settings.streamerLogin) || null;
            const dataUri = renderStreamerKeySvg(streamer, settings, null);
            sendSetImage(context, dataUri);
        }
        else if (action === 'xyz.enfalion.twitchviewer.autoslot') {
            const localIndex = Math.max(0, sortedAutoSlots.findIndex(s => s.context === context));
            const manualPin = parseInt(settings.autoIndex, 10);

            let targetLiveIdx = 0;
            if (manualPin > 0) {
                targetLiveIdx = manualPin - 1;
            } else if (liveStreamers.length > 0) {
                targetLiveIdx = (dynamicLiveOffset + localIndex) % liveStreamers.length;
            }

            const assignedStreamer = liveStreamers[targetLiveIdx] || null;
            info.assignedStreamerLogin = assignedStreamer ? assignedStreamer.login : null;

            const badgeLabel = liveStreamers.length > 0
                ? `${targetLiveIdx + 1}/${liveStreamers.length}`
                : '#0';

            const dataUri = renderStreamerKeySvg(assignedStreamer, settings, badgeLabel);
            sendSetImage(context, dataUri);
        }
        else if (action === 'xyz.enfalion.twitchviewer.autopage') {
            const dataUri = renderLiveSwitcherKeySvg(liveStreamers, dynamicLiveOffset);
            sendSetImage(context, dataUri);
        }
        else if (action === 'xyz.enfalion.twitchviewer.chatmacro') {
            const target = resolveTargetStreamer(settings.streamerLogin);
            const dataUri = renderQuickChatWithAvatarSvg(target, settings.message || '!lurk');
            sendSetImage(context, dataUri);
        }
        else if (action === 'xyz.enfalion.twitchviewer.multitwitch') {
            const dataUri = renderMultiTwitchKeySvg(settings.channels || '');
            sendSetImage(context, dataUri);
        }
    }
}

function executeViewerAction(actionType, channelLogin, settings, context) {
    switch (actionType) {
        case 'browser':
        case 'popout':
        case 'chat':
        case 'streamlink':
            launchStreamOrPlayer(channelLogin, actionType, settings.customCmd);
            sendShowOk(context);
            break;
        case 'lurk':
            sendQuickChatMessage(channelLogin, settings.message || settings.lurkMessage || '!lurk', context);
            break;
        case 'next_live':
            dynamicLiveOffset++;
            renderAllVisibleKeys();
            sendShowOk(context);
            break;
        default:
            launchStreamOrPlayer(channelLogin, 'browser', '');
    }
}

function handleKeyDown(event) {
    const { context, action, payload } = event;
    const settings = payload.settings || {};

    if (
        action === 'xyz.enfalion.twitchviewer.streamer' ||
        action === 'xyz.enfalion.twitchviewer.autoslot'
    ) {
        const info = visibleContexts.get(context);
        const channelLogin = action === 'xyz.enfalion.twitchviewer.autoslot'
            ? info?.assignedStreamerLogin
            : settings.streamerLogin;

        const timer = setTimeout(() => {
            activeKeyTimers.set(context, { triggeredLong: true });
            const defaultLong = action === 'xyz.enfalion.twitchviewer.autoslot' ? 'next_live' : 'chat';
            const longAction = settings.longPress || defaultLong;
            executeViewerAction(longAction, channelLogin, settings, context);
        }, HOLD_THRESHOLD_MS);

        activeKeyTimers.set(context, { timer, triggeredLong: false, channelLogin });
        return;
    }

    if (action === 'xyz.enfalion.twitchviewer.autopage') {
        const liveCount = followedChannelsCache.filter(c => c.live).length;
        if (liveCount > 0) {
            dynamicLiveOffset = (dynamicLiveOffset + 1) % liveCount;
        }
        renderAllVisibleKeys();
        sendShowOk(context);
        return;
    }

    if (action === 'xyz.enfalion.twitchviewer.chatmacro') {
        sendQuickChatMessage(settings.streamerLogin, settings.message || '!lurk', context);
        return;
    }

    if (action === 'xyz.enfalion.twitchviewer.multitwitch') {
        const cleanChannels = (settings.channels || '')
            .split(/[\s,+]+/)
            .map(s => s.trim())
            .filter(Boolean)
            .join('/');
        if (cleanChannels) {
            openUrlInDefaultBrowser(`https://www.multitwitch.tv/${cleanChannels}`);
            sendShowOk(context);
        } else {
            sendShowAlert(context);
        }
    }
}

function handleKeyUp(event) {
    const { context, payload } = event;
    const state = activeKeyTimers.get(context);
    if (!state) return;

    clearTimeout(state.timer);
    activeKeyTimers.delete(context);

    if (!state.triggeredLong && state.channelLogin) {
        const settings = payload.settings || {};
        const shortAction = settings.shortPress || 'browser';
        executeViewerAction(shortAction, state.channelLogin, settings, context);
    }
}

function sendJson(payload) {
    if (ws && ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify(payload));
    }
}

function sendSetImage(context, imageBase64) {
    sendJson({ event: 'setImage', context, payload: { image: imageBase64, target: 0 } });
}

function sendShowOk(context) {
    sendJson({ event: 'showOk', context });
}

function sendShowAlert(context) {
    sendJson({ event: 'showAlert', context });
}

function saveGlobalSettings() {
    saveLocalAuthBackup();
    sendJson({ event: 'setGlobalSettings', context: pluginUUID, payload: globalSettings });
}

function sendToPropertyInspector(context, payload) {
    sendJson({ event: 'sendToPropertyInspector', context, payload });
}

function sendInspectorState(context, eventName = 'initInspector') {
    sendToPropertyInspector(context, {
        event: eventName,
        userLogin: globalSettings.userLogin,
        clientId: getEffectiveClientId(),
        clientSecret: getEffectiveClientSecret(),
        language: appLanguage,
        channels: followedChannelsCache
    });
}

function startOpenDeckPlugin() {
    const backup = loadLocalAuthBackup();
    if (backup && backup.accessToken) {
        globalSettings = { ...globalSettings, ...backup };
    }

    const args = process.argv.slice(2);
    let port = null;
    let registerEvent = null;
    let infoJsonStr = null;

    for (let i = 0; i < args.length; i++) {
        if (args[i] === '-port') port = args[i + 1];
        if (args[i] === '-pluginUUID') pluginUUID = args[i + 1];
        if (args[i] === '-registerEvent') registerEvent = args[i + 1];
        if (args[i] === '-info') infoJsonStr = args[i + 1];
    }

    if (infoJsonStr) {
        try {
            const parsedInfo = JSON.parse(infoJsonStr);
            const rawLang = String(parsedInfo?.application?.language || '').toLowerCase();
            if (rawLang.startsWith('de')) {
                appLanguage = 'de';
            } else if (rawLang) {
                appLanguage = 'en';
            }
        } catch (e) {}
    }

    if (!port || !pluginUUID) {
        console.log('[TwitchViewer] Waiting for OpenDeck CLI launch parameters...');
        return;
    }

    ws = new WebSocket(`ws://127.0.0.1:${port}`);

    ws.on('open', () => {
        sendJson({ event: registerEvent, uuid: pluginUUID });
        sendJson({ event: 'getGlobalSettings', context: pluginUUID });

        setInterval(refreshTwitchDataAndRenderAll, POLL_INTERVAL_MS);
        setInterval(validateAndProactivelyRefreshToken, 15 * 60 * 1000);

        setInterval(() => {
            const liveCount = followedChannelsCache.filter(c => c.live).length;
            if (liveCount <= 1) return;

            let shouldRotate = false;
            for (const info of visibleContexts.values()) {
                if (info.action === 'xyz.enfalion.twitchviewer.autoslot' && info.settings?.autoRotate !== false) {
                    shouldRotate = true;
                    break;
                }
            }
            if (shouldRotate) {
                dynamicLiveOffset = (dynamicLiveOffset + 1) % liveCount;
                renderAllVisibleKeys();
            }
        }, 10000);
    });

    ws.on('message', async (raw) => {
        try {
            const msg = JSON.parse(raw.toString());
            const { event, context, action, payload } = msg;

            switch (event) {
                case 'didReceiveGlobalSettings': {
                    const incoming = payload.settings || {};
                    const wasLegacyId = incoming.clientId === LEGACY_CONFIDENTIAL_CLIENT_ID;
                    const effectiveClientId = normalizeClientId(incoming.clientId || globalSettings.clientId);

                    if (wasLegacyId) {
                        globalSettings = {
                            ...globalSettings,
                            clientId: DEFAULT_CLIENT_ID,
                            accessToken: '',
                            refreshToken: '',
                            userId: '',
                            userLogin: ''
                        };
                        saveGlobalSettings();
                    } else {
                        globalSettings = {
                            ...globalSettings,
                            ...incoming,
                            clientId: effectiveClientId,
                            accessToken: incoming.accessToken || globalSettings.accessToken || '',
                            refreshToken: incoming.refreshToken || globalSettings.refreshToken || '',
                            userId: incoming.userId || globalSettings.userId || '',
                            userLogin: incoming.userLogin || globalSettings.userLogin || '',
                            clientSecret: incoming.clientSecret || globalSettings.clientSecret || DEFAULT_CLIENT_SECRET
                        };
                        saveLocalAuthBackup();
                    }

                    if (globalSettings.languageOverride === 'de' || globalSettings.languageOverride === 'en') {
                        appLanguage = globalSettings.languageOverride;
                    }
                    await validateAndProactivelyRefreshToken();
                    await refreshTwitchDataAndRenderAll();
                    break;
                }

                case 'willAppear':
                    visibleContexts.set(context, {
                        action,
                        coordinates: payload.coordinates,
                        settings: payload.settings || {}
                    });
                    renderAllVisibleKeys();
                    break;

                case 'willDisappear':
                    visibleContexts.delete(context);
                    break;

                case 'didReceiveSettings':
                    if (visibleContexts.has(context)) {
                        visibleContexts.get(context).settings = payload.settings || {};
                    }
                    renderAllVisibleKeys();
                    break;

                case 'propertyInspectorDidAppear':
                    sendInspectorState(context, 'initInspector');
                    break;

                case 'sendToPlugin':
                    if (payload.command === 'startDeviceAuth') {
                        startTwitchDeviceAuth(payload.clientId, payload.clientSecret, context);
                    } else if (payload.command === 'saveClientCredentials') {
                        globalSettings.clientId = normalizeClientId(payload.clientId);
                        if (payload.clientSecret !== undefined) {
                            globalSettings.clientSecret = payload.clientSecret.trim();
                        }
                        saveGlobalSettings();
                        sendInspectorState(context, 'initInspector');
                    } else if (payload.command === 'setLanguage') {
                        if (payload.language === 'de' || payload.language === 'en') {
                            appLanguage = payload.language;
                            globalSettings.languageOverride = payload.language;
                            saveGlobalSettings();
                            renderAllVisibleKeys();
                        }
                    } else if (payload.command === 'logoutTwitch') {
                        logoutTwitchAccount(context);
                    } else if (payload.command === 'forceRefresh') {
                        await validateAndProactivelyRefreshToken();
                        await refreshTwitchDataAndRenderAll();
                        sendInspectorState(context, 'initInspector');
                    }
                    break;

                case 'keyDown':
                    handleKeyDown(msg);
                    break;

                case 'keyUp':
                    handleKeyUp(msg);
                    break;
            }
        } catch (err) {
            console.error('[WebSocket] Error:', err.message);
        }
    });
}

startOpenDeckPlugin();