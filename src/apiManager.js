/** ApiManager class for handling API requests, responses, and interactions.
 * Note: Fetch spying is done in main.js, not here.
 * @class ApiManager
 * @since 0.11.1
 */

import {escapeHTML, serverTPtoDisplayTP} from './utils';
import Logger from './logger';

export default class ApiManager {
  /** Constructor for ApiManager class
   * @param {TemplateManager} templateManager
   * @since 0.11.34
   */
  constructor(templateManager) {
    this.templateManager = templateManager;
    this.disableAll = false; // Should the entire userscript be disabled?
    this.coordsTilePixel = []; // Contains the last detected tile/pixel coordinate pair requested
    this.templateCoordsTilePixel = []; // Contains the last "enabled" template coords
    this.highlightEnable = true;
    this.logger = new Logger('ApiManager').setEnabled(false);
  }

  /** Determines if the spontaneously received response is something we want.
   * Otherwise, we can ignore it.
   * Note: Due to aggressive compression, make your calls like `data['jsonData']['name']` instead of `data.jsonData.name`
   *
   * @param {Overlay} overlay - The Overlay class instance
   * @since 0.11.1
   */
  spontaneousResponseListener(overlay) {
    const logger = this.logger.withPrefix('spontaneousResponseListener')
    // Triggers whenever a message is sent
    window.addEventListener('message', async (event) => {
      const data = event.data; // The data of the message
      const dataJSON = data['jsonData']; // The JSON response, if any

      // Kills itself if the message was not intended for Blue Marble
      if (!(data && data['source'] === 'blue-marble')) {
        return;
      }

      // Kills itself if the message has no endpoint (intended for Blue Marble, but not this function)
      if (!data['endpoint']) {
        return;
      }

      // Trims endpoint to the second to last non-number, non-null directoy.
      // E.g. "wplace.live/api/pixel/0/0?payload" -> "pixel"
      // E.g. "wplace.live/api/files/s0/tiles/0/0/0.png" -> "tiles"
      const endpointText = data['endpoint']?.split('?')[0].split('/').filter(s => s && isNaN(Number(s))).filter(s => s && !s.includes('.')).pop();

      console.log(`%cBlue Marble%c: Recieved message about "%s"`, 'color: cornflowerblue;', '', endpointText);

      // Each case is something that Blue Marble can use from the fetch.
      // For instance, if the fetch was for "me", we can update the overlay stats
      switch (endpointText) {
        case 'me': // Request to retrieve user data
          const meLogger = logger.withPrefix('me')
          meLogger.log(data);
          // If the game can not retrieve the userdata...
          if (dataJSON['status'] && dataJSON['status']?.toString()[0] != '2') {
            // The server is probably down (NOT a 2xx status)
            overlay.handleDisplayError(`You are not logged in!\nCould not fetch userdata.`);
            return; // Kills itself before attempting to display null userdata
          }

          const nextLevelPixels = Math.ceil(Math.pow(Math.floor(dataJSON['level']) * Math.pow(30, 0.65), (1 / 0.65)) - dataJSON['pixelsPainted']); // Calculates pixels to the next level
          this.templateManager.userID = dataJSON['id'];

          overlay.updateInnerHTML('bm-user-name', `Username: <b>${escapeHTML(dataJSON['name'])}</b>`); // Updates the text content of the username field
          overlay.updateInnerHTML('bm-user-droplets', `Droplets: <b>${new Intl.NumberFormat().format(dataJSON['droplets'])}</b>`); // Updates the text content of the droplets field
          overlay.updateInnerHTML('bm-user-nextlevel', `Next level in <b>${new Intl.NumberFormat().format(nextLevelPixels)}</b> pixel${nextLevelPixels == 1 ? '' : 's'}`); // Updates the text content of the next level field
          this.updateFullChargeInfo(overlay, dataJSON)
          break;

        case 'pixel': // Request to retrieve pixel data
          const coordsTile = data['endpoint'].split('?')[0].split('/').filter(s => s && !isNaN(Number(s))); // Retrieves the tile coords as [x, y]
          const payloadExtractor = new URLSearchParams(data['endpoint'].split('?')[1]); // Declares a new payload deconstructor and passes in the fetch request payload
          const coordsPixel = [payloadExtractor.get('x'), payloadExtractor.get('y')]; // Retrieves the deconstructed pixel coords from the payload

          // Don't save the coords if there are previous coords that could be used
          if (this.coordsTilePixel.length && (!coordsTile.length || !coordsPixel.length)) {
            overlay.handleDisplayError(`Coordinates are malformed!\nDid you try clicking the canvas first?`);
            return; // Kills itself
          }

          this.coordsTilePixel = [...coordsTile, ...coordsPixel]; // Combines the two arrays such that [x, y, x, y]
          const displayTP = serverTPtoDisplayTP(coordsTile, coordsPixel);

          const spanElements = document.querySelectorAll('span'); // Retrieves all span elements

          // For every span element, find the one we want (pixel numbers when canvas clicked)
          for (const element of spanElements) {
            if (element.textContent.trim().includes(`${displayTP[0]}, ${displayTP[1]}`)) {

              let displayCoords = document.querySelector('#bm-display-coords'); // Find the additional pixel coords span

              const text = `(Tl X: ${coordsTile[0]}, Tl Y: ${coordsTile[1]}, Px X: ${coordsPixel[0]}, Px Y: ${coordsPixel[1]})`;

              // If we could not find the addition coord span, we make it then update the textContent with the new coords
              if (!displayCoords) {
                displayCoords = document.createElement('span');
                displayCoords.id = 'bm-display-coords';
                displayCoords.textContent = text;
                displayCoords.style = 'margin-left: calc(var(--spacing)*3); font-size: small;';
                element.parentNode.parentNode.parentNode.insertAdjacentElement('afterend', displayCoords);
              } else {
                displayCoords.textContent = text;
              }
            }
          }
          break;

        case 'tiles':
          // Runs only if the tile has the template
          let tileCoordsTile = data['endpoint'].split('/');
          tileCoordsTile = [parseInt(tileCoordsTile[tileCoordsTile.length - 2]), parseInt(tileCoordsTile[tileCoordsTile.length - 1].replace('.png', ''))];

          const blobUUID = data['blobID'];
          const blobData = data['blobData'];

          let templateBlob = null
          templateBlob = await this.templateManager.drawTemplateOnTile(blobData, tileCoordsTile);

          if (this.highlightEnable) {
            templateBlob = await this.templateManager.drawHighlightOnTile(blobData, templateBlob, tileCoordsTile)
          }

          window.postMessage({
            source: 'blue-marble',
            blobID: blobUUID,
            blobData: templateBlob,
            blink: data['blink']
          });
          break;

        case 'robots': // Request to retrieve what script types are allowed
          this.disableAll = dataJSON['userscript']?.toString().toLowerCase() == 'false'; // Disables Blue Marble if site owner wants userscripts disabled
          break;
      }
    });
  }

  updateFullChargeInfo(overlay, dataJSON) {
    // Calculate and display full charge countdown
    if (dataJSON['charges']) {
      const charges = dataJSON['charges'];
      const currentCharges = charges['count'] || 0;
      const maxCharges = charges['max'] || 1;
      const cooldownMs = charges['cooldownMs'] || 30000; // Default 30 seconds

      // Calculate charges needed and time to full
      const chargesNeeded = maxCharges - currentCharges;
      const timeToFullMs = chargesNeeded * cooldownMs;

      // Store data for countdown
      window.skirkChargeData = {
        current: currentCharges,
        max: maxCharges,
        cooldownMs: cooldownMs,
        timeToFull: timeToFullMs,
        startTime: Date.now()
      };

      // Initial display
      this.updateFullChargeDisplay(overlay);

      // Start countdown interval
      if (window.skirkChargeInterval) {
        clearInterval(window.skirkChargeInterval);
      }

      window.skirkChargeInterval = setInterval(() => {
        this.updateFullChargeDisplay(overlay);
      }, 1000); // Update every second
    } else {
      // No charge data available
      overlay.updateInnerHTML('bm-user-fullcharge-content','Full Charge in <b style="color: #6b7280;">N/A</b>');
      // Apply visibility setting
      try {
        const show = JSON.parse(localStorage.getItem('bmShowFullCharge') ?? 'true');
        const el = document.getElementById('bm-user-fullcharge');
        if (el) el.style.display = show ? '' : 'none';
      } catch (_) {
      }
    }
  }

  /** Update the full charge countdown display
   * @param {Overlay} overlay - The Overlay class instance
   * @since 1.0.0
   */
  updateFullChargeDisplay(overlay) {
    if (!window.skirkChargeData) return;

    const data = window.skirkChargeData;
    const elapsed = Date.now() - data.startTime;
    const remainingMs = Math.max(0, data.timeToFull - elapsed);

    // If already at full charges
    if (data.current >= data.max || remainingMs <= 0) {
      overlay.updateInnerHTML('bm-user-fullcharge-content', `Full Charge in <b style="color: #10b981;">FULL</b>`);

      // Apply visibility setting
      try {
        const show = JSON.parse(localStorage.getItem('bmShowFullCharge') ?? 'true');
        const el = document.getElementById('bm-user-fullcharge');
        if (el) el.style.display = show ? '' : 'none';
      } catch (_) {
      }

      // Clear interval when full
      if (window.skirkChargeInterval) {
        clearInterval(window.skirkChargeInterval);
        window.skirkChargeInterval = null;
      }
      return;
    }

    // Convert to hours, minutes, seconds
    const totalSeconds = Math.ceil(remainingMs / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    let timeText = '';
    if (hours > 0) {
      timeText = `${hours}ч ${minutes}м ${seconds}с`;
    } else if (minutes > 0) {
      timeText = `${minutes}м ${seconds}с`;
    } else {
      timeText = `${seconds}с`;
    }

    // Calculate current charges (increases over time)
    const chargesGained = Math.floor(elapsed / data.cooldownMs);
    const currentCharges = Math.min(data.current + chargesGained, data.max);
    const chargesText = `${Math.floor(currentCharges)}/${data.max}`;

    overlay.updateInnerHTML('bm-user-fullcharge-content',
      `Full Charge in <b style="color: #f59e0b;">${timeText}</b> <span style="color: #6b7280; font-size: 0.9em;">(${chargesText})</span>`
    );

    // Apply visibility setting
    try {
      const show = JSON.parse(localStorage.getItem('bmShowFullCharge') ?? 'true');
      const el = document.getElementById('bm-user-fullcharge');
      if (el) el.style.display = show ? '' : 'none';
    } catch (_) {
    }
  }

  async #getBrowserFromUA(ua = navigator.userAgent) {
    ua = ua || "";

    // Opera
    if (ua.includes("OPR/") || ua.includes("Opera")) return "Opera";

    // Edge (Chromium-based uses "Edg/")
    if (ua.includes("Edg/")) return "Edge";

    // Vivaldi
    if (ua.includes("Vivaldi")) return "Vivaldi";

    // Yandex
    if (ua.includes("YaBrowser")) return "Yandex";

    // Kiwi (not guaranteed, but typically shows "Kiwi")
    if (ua.includes("Kiwi")) return "Kiwi";

    // Brave (doesn't expose in UA by default; heuristic via Brave/ token in some versions)
    if (ua.includes("Brave")) return "Brave";

    // Firefox
    if (ua.includes("Firefox/")) return "Firefox";

    // Chrome (catch-all for Chromium browsers)
    if (ua.includes("Chrome/")) return "Chrome";

    // Safari (must be after Chrome check)
    if (ua.includes("Safari/")) return "Safari";

    // Brave special check
    if (navigator.brave && typeof navigator.brave.isBrave === "function") {
      if (await navigator.brave.isBrave()) return "Brave";
    }

    // Fallback
    return 'Unknown';
  }

  #getOS(ua = navigator.userAgent) {
    ua = ua || "";

    if (/Windows NT 11/i.test(ua)) return "Windows 11";
    if (/Windows NT 10/i.test(ua)) return "Windows 10";
    if (/Windows NT 6\.3/i.test(ua)) return "Windows 8.1";
    if (/Windows NT 6\.2/i.test(ua)) return "Windows 8";
    if (/Windows NT 6\.1/i.test(ua)) return "Windows 7";
    if (/Windows NT 6\.0/i.test(ua)) return "Windows Vista";
    if (/Windows NT 5\.1|Windows XP/i.test(ua)) return "Windows XP";

    if (/Mac OS X 10[_\.]15/i.test(ua)) return "macOS Catalina";
    if (/Mac OS X 10[_\.]14/i.test(ua)) return "macOS Mojave";
    if (/Mac OS X 10[_\.]13/i.test(ua)) return "macOS High Sierra";
    if (/Mac OS X 10[_\.]12/i.test(ua)) return "macOS Sierra";
    if (/Mac OS X 10[_\.]11/i.test(ua)) return "OS X El Capitan";
    if (/Mac OS X 10[_\.]10/i.test(ua)) return "OS X Yosemite";
    if (/Mac OS X 10[_\.]/i.test(ua)) return "macOS"; // Generic fallback

    if (/Android/i.test(ua)) return "Android";
    if (/iPhone|iPad|iPod/i.test(ua)) return "iOS";

    if (/Linux/i.test(ua)) return "Linux";

    return "Unknown";
  }

  enableHighlight() {
    this.highlightEnable = true;
  }

  disableHighlight() {
    this.highlightEnable = false;
  }
}
