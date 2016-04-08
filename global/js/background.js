/* =============================================================================

  Product: PoziTone module for Sovyatnik
  Author: PoziWorld
  Copyright: (c) 2016 PoziWorld
  License: pozitone.com/license

  Table of Contents:

    Listeners
      runtime.onInstalled

 ============================================================================ */

( function() {
  'use strict';

/* =============================================================================

  Listeners

 ============================================================================ */

  /**
   * Fired when the extension is first installed, 
   * when the extension is updated to a new version, 
   * and when Chrome is updated to a new version.
   *
   * @type    method
   * @param   objDetails
   *            Reason - install/update/chrome_update - 
   *            and (optional) previous version.
   * @return  void
   **/

  chrome.runtime.onInstalled.addListener(
    function( objDetails ) {
      // TODO: Only on install
      pozitoneModule.utils.openOptionsPage( 'background' );
    }
  );

}() );
