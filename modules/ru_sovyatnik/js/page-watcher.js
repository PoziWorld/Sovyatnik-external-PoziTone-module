/* =============================================================================

  Product: PoziTone module for Sovyatnik
  Author: PoziWorld
  Copyright: (c) 2016 PoziWorld
  License: pozitone.com/license

  Table of Contents:

    PageWatcher
      init()
      convertNotificationLogoUrl()
      onPlay()
      onPause()
      sendMediaEvent()

 ============================================================================ */

( function() {
  'use strict';

  function PageWatcher() {
    var $$soundcloudIframe = document.querySelector( '#listen iframe' );

    const
        strModule = 'ru_sovyatnik'
      , strImgPath = 'modules/' + strModule + '/img/'
      ;

    if ( ! document.contains( $$soundcloudIframe ) ) {
      console.warn( strConstExtensionName, ':', chrome.i18n.getMessage( 'playerNotFound' ) );

      return;
    }

    this.widget = SC.Widget( $$soundcloudIframe );

    this.boolIsUserLoggedIn = true;
    this.boolDisregardSameMessage = true;

    this.objPlayerInfo = {
        strModule : strModule
      , boolIsReady : false
      , boolIsPlaying : false
      , boolIsMuted : false
      , intVolume : 0
      , boolCanPlayNextTrackLoggedOut : false
      , boolCanPlayPreviousTrackLoggedOut : false
    };

    this.objStationInfo = {
        strStationName : 'Совятник'
      , strStationNamePlusDesc : 'Совятник — Ключевые идеи из бестселлеров'
      , strLogoUrl : '/' + strImgPath + 'sovyatnik.svg'
      , strLogoDataUri : strImgPath + 'sovyatnik-logo-80.png'
      , strTrackInfo : ''
      , strAdditionalInfo : ''
      , boolHasAddToPlaylistButton : false
    };

    this.init();
  }

  /**
   * Set event listeners.
   *
   * @type    method
   * @param   No Parameters Taken
   * @return  void
   **/

  PageWatcher.prototype.init = function () {
    var self = this;

    pozitoneModule.api.init( strConstPozitoneEdition );
    self.convertNotificationLogoUrl();

    self.widget.bind( SC.Widget.Events.READY, function() {
      self.objPlayerInfo.boolIsReady = true;

      self.widget.bind( SC.Widget.Events.PLAY, function() {
        self.onPlay();
      } );

      self.widget.bind( SC.Widget.Events.PAUSE, function() {
        self.onPause();
      } );
    } );
  };

  /**
   * Provide relative notification logo URL/src, get data URL.
   *
   * PoziTone can't access image files from other extensions.
   * Thus, image URLs have to be data URLs.
   *
   * @type    method
   * @param   No Parameters Taken
   * @return  void
   **/

  PageWatcher.prototype.convertNotificationLogoUrl = function () {
    var self = this;

    pozitoneModule.api.convertImageSrcToDataUrl(
        chrome.runtime.getURL( self.objStationInfo.strLogoDataUri )
      , function ( strDataUri ) {
          self.objStationInfo.strLogoDataUri = strDataUri;
        }
    );
  };

  /**
   * Fired when the sound begins to play.
   *
   * @type    method
   * @param   No Parameters Taken
   * @return  void
   **/

  PageWatcher.prototype.onPlay = function () {
    var self = this;

    self.objPlayerInfo.boolIsPlaying = true;

    // get information about currently playing sound
    self.widget.getCurrentSound( function( objCurrentSound ) {
      self.widget.getVolume( function( intVolume ) {
        self.objPlayerInfo.intVolume = intVolume;
        self.objStationInfo.strTrackInfo = pozitoneModule.api.setMediaInfo( objCurrentSound.user.username, objCurrentSound.title );

        self.sendMediaEvent();
      });
    } );
  };

  /**
   * Fired when the sound pauses.
   *
   * @type    method
   * @param   No Parameters Taken
   * @return  void
   **/

  PageWatcher.prototype.onPause = function () {
    var self = this;

    self.objPlayerInfo.boolIsPlaying = false;

    // get information about currently playing sound
    self.widget.getCurrentSound( function( objCurrentSound ) {
      self.sendMediaEvent();
    } );
  };

  /**
   * Send media event information to PoziTone.
   *
   * @type    method
   * @param   No Parameters Taken
   * @return  void
   **/

  PageWatcher.prototype.sendMediaEvent = function () {
    var objData = {
        boolIsUserLoggedIn : this.boolIsUserLoggedIn
      , boolDisregardSameMessage : this.boolDisregardSameMessage
      , objPlayerInfo : this.objPlayerInfo
      , objStationInfo : this.objStationInfo
      , strCommand : ''
    };

    pozitoneModule.api.sendMediaEvent( objData );
  };

  if ( typeof pozitoneModule === 'undefined' ) {
    window.pozitoneModule = {};
  }

  pozitoneModule.pageWatcher = new PageWatcher();
}() );
