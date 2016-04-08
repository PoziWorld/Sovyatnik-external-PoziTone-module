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
              boolIsEnabled : true
            , boolShowNotificationLogo : true
            , strNotificationLogo : 'site'
            , boolShowKbpsInfo : false
            , arrAvailableNotificationButtons : []
            , arrActiveNotificationButtons : []
            , boolShowNotificationWhenMuted : false
            , boolUseGeneralVolumeDelta : true
            , intVolumeDelta : 10
          }
      }
    ;

/* =============================================================================

  Listeners

 ============================================================================ */

  document.addEventListener( 'DOMContentLoaded', function (  ) {
    pozitoneModule.page.init();
    pozitoneModule.api.init( strConstPozitoneEdition );

    document.getElementById( 'connectCta' ).addEventListener( 'click', function ( objEvent ) {
      var $$this = this;

      pozitoneModule.api.connectModule(
          objSettings
        , function( objResponse ) {
            $$this.disabled = true;

            document.getElementById( 'connectionStatus' ).textContent = objResponse.strMessage;
          }
        , function( objResponse ) {
            document.getElementById( 'connectionStatus' ).textContent = objResponse.strMessage;
          }
      );
    } );
  } );

}() );
