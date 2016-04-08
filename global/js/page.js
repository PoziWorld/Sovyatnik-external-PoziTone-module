/* =============================================================================

  Product: PoziTone module for Sovyatnik
  Author: PoziWorld
  Copyright: (c) 2016 PoziWorld
  License: pozitone.com/license

  Table of Contents:

    Page
      init()
      localize()

 ============================================================================ */

( function() {
  'use strict';

  function Page() {
  }

  /**
   * Initialize.
   *
   * @type    method
   * @param   No Parameters Taken
   * @return  void
   **/

  Page.prototype.init = function () {
    this.localize();
  };

  /**
   * Provide text in the appropriate language for HTML elements that expect it.
   *
   * @type    method
   * @param   strPageName
   *            Optional. Page name it's called from.
   * @param   strCustomSelectorParent
   *            Optional. If only part of the page needs to be localized.
   * @return  void
   **/

  Page.prototype.localize = function( strPageName, strCustomSelectorParent ) {
    var boolIsCustomSelectorParentPresent = typeof strCustomSelectorParent === 'string'
      , strSelectorPrefix = boolIsCustomSelectorParentPresent ? strCustomSelectorParent + ' ' : ''
      , $allLocalizableElements = document.querySelectorAll( strSelectorPrefix + '[data-i18n]' )
      ;

    for ( var i = 0, l = $allLocalizableElements.length; i < l; i++ ) {
        var $localizableElement = $allLocalizableElements[ i ]
          , strI18 = $localizableElement.getAttribute( 'data-i18n' )
          , strMessage = chrome.i18n.getMessage( strI18 )
          ;

        if ( $localizableElement.nodeName === 'LABEL' ) {
          $localizableElement.innerHTML = $localizableElement.innerHTML + strMessage;
        }
        else if ( $localizableElement.nodeName === 'A'
              &&  ! $localizableElement.classList.contains( 'i18nNoInner' )
        ) {
          $localizableElement.innerHTML = strMessage;

          if ( $localizableElement.href === '' ) {
            $localizableElement.href = chrome.i18n.getMessage( strI18 + 'Href' );
          }
        }
        else if ( $localizableElement.nodeName === 'IMG' ) {
          $localizableElement.alt = strMessage;
        }
        else if ( ! $localizableElement.classList.contains( 'i18nNoInner' ) ) {
          $localizableElement.innerHTML = strMessage;
        }

        if ( $localizableElement.classList.contains( 'i18nTitle' ) ) {
          $localizableElement.setAttribute( 'title', strMessage );
        }
    }

    if ( ! boolIsCustomSelectorParentPresent && strPageName ) {
      document.title = chrome.i18n.getMessage( strPageName + 'Title' );
    }
  };

  if ( typeof pozitoneModule === 'undefined' ) {
    window.pozitoneModule = {};
  }

  pozitoneModule.page = new Page();
}() );
