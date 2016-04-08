/* =============================================================================

  Product: PoziTone module for Sovyatnik
  Author: PoziWorld
  Copyright: (c) 2016 PoziWorld
  License: pozitone.com/license

  Table of Contents:

    Constants

 ============================================================================ */

/* =============================================================================

  Constants

 ============================================================================ */

const
    // Extension
    strConstExtensionId = chrome.runtime.id
  , objConstExtensionManifest = chrome.runtime.getManifest()
  , strConstExtensionName = objConstExtensionManifest.name
  , strConstExtensionVersion = objConstExtensionManifest.version

    // Browser & UI
  , boolConstIsBowserAvailable = typeof bowser === 'object'
  , boolConstIsOpera = boolConstIsBowserAvailable && bowser.name === 'Opera'
  , boolConstIsYandex = boolConstIsBowserAvailable && bowser.name === 'Yandex.Browser'
  , boolConstIsOperaAddon = boolConstIsOpera || boolConstIsYandex
  , strConstChromeVersion = boolConstIsBowserAvailable ? bowser.chromeVersion : ''
  , boolConstUseOptionsUi = strConstChromeVersion >= '40.0' && ! boolConstIsOpera

  , strConstPozitoneEdition = 'test'
  ;
