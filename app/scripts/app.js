/*
Copyright (c) 2015 The Polymer Project Authors. All rights reserved.
This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
Code distributed by Google as part of the polymer project is also
subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
*/
(function(document) {
  'use strict';

  // Grab a reference to our auto-binding template
  // and give it some initial binding values
  // Learn more about auto-binding templates at http://goo.gl/Dx1u2g
  var app = document.querySelector('#app');
  app.apiRecent = 'http://ebird.org/ws1.1/data/obs/geo/recent?fmt=json&back=2';
  app.apiHotspots = 'http://ebird.org/ws1.1/ref/hotspot/geo?dist=20&back=2&fmt=json';

  // Sets app default base URL
  app.baseUrl = '/';
  if (window.location.port === '') {  // if production
    // Uncomment app.baseURL below and
    // set app.baseURL to '/your-pathname/' if running from folder in production
    // app.baseUrl = '/polymer-starter-kit/';
  }

  app.displayInstalledToast = function() {
    // Check to make sure caching is actually enabled—it won't be in the dev environment.
    if (!Polymer.dom(document).querySelector('platinum-sw-cache').disabled) {
      Polymer.dom(document).querySelector('#caching-complete').show();
    }
  };

  // Listen for template bound event to know when bindings
  // have resolved and content has been stamped to the page
  app.addEventListener('dom-change', function() {
    console.log('Our app is ready to rock!');

    var working = Polymer.dom(document).querySelector('#refresh-button');
    var locationToast = Polymer.dom(document).querySelector('#toast');

    function getLocation() {
      
      working.setAttribute('icon', 'refresh');   
      working.setAttribute('class', 'spin');  
      
      function success(position) {
        
        app.lat = position.coords.latitude;
        app.lon = position.coords.longitude;
        console.log(app.lat,app.lon);
        
        app.locationRecent = app.apiRecent + 
          '&lat=' + app.lat + '&lng=' + app.lon;
        
        app.locationHotspots = app.apiHotspots + 
          '&lat=' + app.lat + '&lng=' + app.lon;
        
        locationToast.text = 'Location acquired! Get your bird on!';
        locationToast.show();
        
        working.removeAttribute('class'); 
        
        Polymer.dom(document).querySelector('nearby-sightings').fire(
          'sightingsLocationAcquired', {url: app.locationRecent}
          );
        Polymer.dom(document).querySelector('nearby-hotspots').fire(
          'hotspotsLocationAcquired', {url: app.locationHotspots}
          );

      }
      
      function error() {
        
        working.removeAttribute('class');
        working.setAttribute('icon', 'error'); 
        
        locationToast.text = 'Unable to determine location.' + 
            'Please check your settings and try again.';
        locationToast.duration = 0; 
        locationToast.show(); 
		
      }
            
      navigator.geolocation.getCurrentPosition(success,error,{
        enableHighAccuracy: true, maximumAge: 0, timeout: 30000});
      
    }
    
    getLocation();

    app.refreshLocation = function() {
      console.log('Refreshing user location...');
      getLocation();
    };
    
  });

  // See https://github.com/Polymer/polymer/issues/1381
  window.addEventListener('WebComponentsReady', function() {
    // imports are loaded and elements have been registered
  });

  // Scroll page to top and expand header
  app.scrollPageToTop = function() {
    app.$.headerPanelMain.scrollToTop(true);
  };

  app.closeDrawer = function() {
    app.$.paperDrawerPanel.closeDrawer();
  };

})(document);
