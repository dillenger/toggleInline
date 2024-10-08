/*
 * This file is provided by the addon-developer-support repository at
 * https://github.com/thundernest/addon-developer-support
 *
 * Version: 1.4
 * - setPref() function returns true if the value could be set, otherwise false
 *
 * Version: 1.3
 * - add setPref() function
 *
 * Version: 1.2
 * - add getPref() function
 *
 * Author: John Bieling (john@thunderbird.net)
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

var { ExtensionCommon } = ChromeUtils.importESModule("resource://gre/modules/ExtensionCommon.sys.mjs");

var LegacyPrefs = class extends ExtensionCommon.ExtensionAPI {
  getAPI(context) {

    return {
      LegacyPrefs: {

        getLegacyPref: async function(aName, aFallback = null, userPrefOnly = true) {
          let prefType = Services.prefs.getPrefType(aName);
          if (prefType == Services.prefs.PREF_INVALID) {
            return aFallback;
          }

          let value = aFallback;
          if (!userPrefOnly || Services.prefs.prefHasUserValue(aName)) {
            switch (prefType) {
              case Services.prefs.PREF_STRING:
                  value = Services.prefs.getCharPref(aName, aFallback);
                  break;

              case Services.prefs.PREF_INT:
                  value = Services.prefs.getIntPref(aName, aFallback);
                  break;

              case Services.prefs.PREF_BOOL:
                  value = Services.prefs.getBoolPref(aName, aFallback);
                  break;

              default:
                console.error(`Legacy preference <${aName}> has an unknown type of <${prefType}>.`);
            }
          }
          return value;
        },

        // only returns something, if a user pref value is set
        getUserPref: async function(aName) {
          return await this.getLegacyPref(aName);
        },

        // returns the default value, if no user defined value exists,
        // and returns the fallback value, if the preference does not exist
        getPref: async function(aName, aFallback = null) {
          return await this.getLegacyPref(aName, aFallback, false);
        },

        clearUserPref: function(aName) {
          Services.prefs.clearUserPref(aName);
        },


        // sets a pref
        setPref: async function(aName, aValue) {
          let prefType = Services.prefs.getPrefType(aName);
          if (prefType == Services.prefs.PREF_INVALID) {
            return false;
          }

          switch (prefType) {
            case Services.prefs.PREF_STRING:
                Services.prefs.setCharPref(aName, aValue);
                return true;
                break;

            case Services.prefs.PREF_INT:
                Services.prefs.setIntPref(aName, aValue);
                return true;
                break;

            case Services.prefs.PREF_BOOL:
                Services.prefs.setBoolPref(aName, aValue);
                return true;
                break;

            default:
              console.error(`Legacy preference <${aName}> has an unknown type of <${prefType}>.`);
          }
          return false;
        }

      }
    };
  }
};
