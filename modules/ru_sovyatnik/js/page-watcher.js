/* =============================================================================

  Product: PoziTone module for Sovyatnik
  Author: PoziWorld
  Copyright: (c) 2016 PoziWorld
  License: pozitone.com/license

  Table of Contents:

    PageWatcher
      init()
      addRuntimeOnMessageListener()
      convertNotificationLogoUrl()
      onPlay()
      onPause()
      sendMediaEvent()
      triggerPlayerAction_playStop()
      triggerPlayerAction_mute()
      triggerPlayerAction_unmute()
      triggerPlayerAction_muteUnmute()
      triggerPlayerAction_showNotification()

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
    this.boolHadPlayedBefore = false;
    this.boolDisregardSameMessage = true;

    this.objPlayerInfo = {
        strModule : strModule
      , boolIsReady : false
      , boolIsPlaying : false
      , boolIsMuted : false
      , intVolume : 0
      , intVolumeBeforeMuted : 0
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
   * Set event listeners, initialize API.
   *
   * @type    method
   * @param   No Parameters Taken
   * @return  void
   **/

  PageWatcher.prototype.init = function () {
    var self = this;

    self.addRuntimeOnMessageListener();
    pozitoneModule.api.init( objConst.strPozitoneEdition, self, boolConstIsOperaAddon );
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
   * Listen for commands sent from Background and/or PoziTone.
   * If requested function found, call it.
   *
   * @type    method
   * @param   No Parameters Taken
   * @return  void
   **/

  PageWatcher.prototype.addRuntimeOnMessageListener = function () {
    chrome.runtime.onMessage.addListener(
      function( objMessage, objSender, funcSendResponse ) {
        pozitoneModule.api.processRequest(
            objMessage
          , objSender
          , funcSendResponse
        );

        // Indicate that the response function will be called asynchronously
        return true;
      }
    );
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

        if ( ! self.boolHadPlayedBefore ) {
          self.sendMediaEvent( 'onFirstPlay' );
          self.boolHadPlayedBefore = true;
        }
        else {
          self.sendMediaEvent( 'onPlay' );
        }
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
      self.sendMediaEvent( 'onPause' );
    } );
  };

  /**
   * Send media event information to PoziTone.
   *
   * @type    method
   * @param   strFeedback
   *            Optional. Feedback for main actions (play/stop, mute/unmute).
   * @return  void
   **/

  PageWatcher.prototype.sendMediaEvent = function ( strFeedback ) {
    this.objStationInfo.strAdditionalInfo =
      ( typeof strFeedback === 'string' && strFeedback !== '' )
        ? strFeedback
        : ''
        ;

    var objData = {
        boolIsUserLoggedIn : this.boolIsUserLoggedIn
      , boolDisregardSameMessage : this.boolDisregardSameMessage
      , objPlayerInfo : this.objPlayerInfo
      , objStationInfo : this.objStationInfo
      , strCommand : ''
    };

    pozitoneModule.api.sendMediaEvent( objData );
  };

  /**
   * Toggle the sound.
   *
   * @type    method
   * @param   No Parameters Taken
   * @return  void
   **/

  PageWatcher.prototype.triggerPlayerAction_playStop = function() {
    this.widget.toggle();
  };

  /**
   * Simulate "Mute" player method
   *
   * @type    method
   * @param   No Parameters Taken
   * @return  void
   **/

  PageWatcher.prototype.triggerPlayerAction_mute = function() {
    var self = this;

    self.widget.getVolume( function ( flVolume ) {
      self.objPlayerInfo.intVolumeBeforeMuted = pozitoneModule.api.convertVolumeToPercent( flVolume );

      self.widget.setVolume( 0 );
      self.objPlayerInfo.boolIsMuted = true;

      self.sendMediaEvent( 'onMute' );
    } );
  };

  /**
   * Simulate "Unmute" player method
   *
   * @type    method
   * @param   No Parameters Taken
   * @return  void
   **/

  PageWatcher.prototype.triggerPlayerAction_unmute = function() {
    this.widget.setVolume(
      pozitoneModule.api.convertPercentToVolume( this.objPlayerInfo.intVolumeBeforeMuted )
    );
    this.objPlayerInfo.boolIsMuted = false;

    this.sendMediaEvent( 'onUnmute' );
  };

  /**
   * If volume is not 0, then mute. Otherwise, unmute.
   *
   * @type    method
   * @param   No Parameters Taken
   * @return  void
   **/

  PageWatcher.prototype.triggerPlayerAction_muteUnmute = function() {
    var self = this
      , promise = new Promise( function( funcResolve, funcReject ) {
          self.widget.getVolume( function ( flVolume ) {
            funcResolve( flVolume );
          } );
        } )
      ;

    promise
      .then( function ( flVolume ) {
        if ( flVolume === 0 ) {
          self.triggerPlayerAction_unmute();
        }
        else {
          self.triggerPlayerAction_mute();
        }
      } )
      ;
  };

  /**
   * Show the last shown notification again.
   *
   * @type    method
   * @param   No Parameters Taken
   * @return  void
   **/

  PageWatcher.prototype.triggerPlayerAction_showNotification = function() {
    this.sendMediaEvent( 'onShowNotification' );
  };

  if ( typeof pozitoneModule === 'undefined' ) {
    window.pozitoneModule = {};
  }

  pozitoneModule.pageWatcher = new PageWatcher();
}() );
