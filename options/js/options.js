/* =============================================================================

  Product: PoziTone module for Sovyatnik
  Author: PoziWorld
  Copyright: (c) 2016 PoziWorld
  License: pozitone.com/license

  Table of Contents:

    Constants
    Listeners

 ============================================================================ */

( function () {
  'use strict';

/* =============================================================================

  Constants

 ============================================================================ */

  const
      objSettings = {
          // TODO: Let object name be anything
          objSettings_ru_sovyatnik : {
              // TODO: Let provide i18n names
              strName : chrome.i18n.getMessage( 'shortName' )
            , boolIsEnabled : true
            , boolShowNotificationLogo : true
            , strNotificationLogo : 'site'
            , arrAvailableNotificationButtons : [
                  'playStop'
                , 'muteUnmute'
              ]
            , arrActiveNotificationButtons : [
                  'playStop'
                , 'muteUnmute'
              ]
            , boolShowNotificationWhenMuted : false
            , strRegex : '(http:\/\/|https:\/\/)sovyatnik.ru\/.*'
          }
      }
    ;

/* =============================================================================

  Listeners

 ============================================================================ */

  document.addEventListener( 'DOMContentLoaded', function (  ) {
    pozitoneModule.page.init();
    pozitoneModule.sdk.init( objConst.strPozitoneEdition, undefined, boolConstIsOperaAddon );

    var $$connectCta = document.getElementById( 'connectCta' )
      , $$openModuleSettingsCta = document.getElementById( 'openModuleSettingsCta' )
      , boolDocumentContainsConnectModuleCta = document.contains( $$connectCta )
      , boolDocumentContainsOpenModuleSettingsCta = document.contains( $$openModuleSettingsCta )
      ;

    if ( boolDocumentContainsConnectModuleCta ) {
      $$connectCta.addEventListener( 'click', function ( objEvent ) {
        var $$this = this;
  
        pozitoneModule.sdk.connectModule(
            objSettings
          , function( objResponse, intStatusCode, strApiVersion ) {
              $$this.disabled = true;
  
              // Show message
              document.getElementById( 'connectionStatus' ).textContent = objResponse.strMessage;
  
              // Show button to open settings
              if ( boolDocumentContainsOpenModuleSettingsCta ) {
                $$openModuleSettingsCta.hidden = false;
              }

              // Save Host API version
              var strHostApiVersion = objConst.strHostApiVersionVar;

              // TODO: No need to get, set right away
              pozitoneModule.utils.getStorageItems(
                  StorageLocal
                , strHostApiVersion
                , function( objStorage ) {
                    if ( typeof objStorage === 'object' && ! Array.isArray( objStorage )  ) {
                      objStorage[ strHostApiVersion ] = strApiVersion;
  
                      pozitoneModule.utils.setStorageItems( StorageLocal, objStorage );
                    }
                  }
              );
            }
          , function( objResponse, intStatusCode, strApiVersion ) {
              var strMessage;
  
              if ( typeof objResponse === 'object' && ! Array.isArray( objResponse ) ) {
                strMessage = objResponse.strMessage;
              }
              else if ( typeof intStatusCode === 'number' ) {
                strMessage = chrome.i18n.getMessage( 'pozitoneModuleApiConnectStatusCode' + intStatusCode );
              }
              else {
                strMessage = chrome.i18n.getMessage( 'pozitoneModuleApiConnectUnrecognizedError' );
              }
  
              document.getElementById( 'connectionStatus' ).innerHTML = strMessage;

              if ( document.getElementById( 'apiConnectInstallationLink' ) ) {
                document.getElementById( 'apiConnectInstallationLink' ).href = objConst.strPozitoneInstallationUrl;
              }
            }
        );
      } );
    }

    if ( boolDocumentContainsOpenModuleSettingsCta ) {
      $$openModuleSettingsCta.addEventListener( 'click', function ( objEvent ) {
        pozitoneModule.sdk.openModuleSettings( objConst.strModuleId );
      } );
    }

    // If connected, show "Open module settings" CTA. Otherwise, "Connect module"
    var strHostApiVersionVar = objConst.strHostApiVersionVar;

    pozitoneModule.utils.getStorageItems(
        StorageLocal
      , strHostApiVersionVar
      , function( objStorage ) {
          if ( typeof objStorage === 'object' && ! Array.isArray( objStorage )  ) {
            var strHostApiVersion = objStorage[ strHostApiVersionVar ];

            if ( typeof strHostApiVersion === 'string' && strHostApiVersion !== '' ) {
              if ( boolDocumentContainsConnectModuleCta ) {
                $$connectCta.disabled = true;
              }

              if ( boolDocumentContainsOpenModuleSettingsCta ) {
                $$openModuleSettingsCta.hidden = false;
              }
            }
            else {
              // TODO: Add error handling
            }
          }
        }
    );
  } );

}() );
