angular.module('starter')

  .controller('MapCtrl', function($scope, $state, $cordovaGeolocation, $http) {


    /* _______________ Initilize Map with marker in Current Position _________________ */
    var options = { timeout: 10000, enableHighAccuracy: true };
    $cordovaGeolocation.getCurrentPosition(options).then(function(position) {

      var latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);

      var mapOptions = {
        center: latLng,
        zoom: 10,
        mapTypeId: google.maps.MapTypeId.ROADMAP
      };

      $scope.map = new google.maps.Map(document.getElementById("map"), mapOptions);

      google.maps.event.addListenerOnce($scope.map, 'idle', function() {

        var marker = new google.maps.Marker({
          map: $scope.map,
          animation: google.maps.Animation.DROP,
          position: latLng
        });

        var infoWindow = new google.maps.InfoWindow({
          content: "Here I am!"
        });

        google.maps.event.addListener(marker, 'click', function() {
          infoWindow.open($scope.map, marker);
        });

      });
      /* _______________ Get Data from JSON + Put in Select _________________ */
      $http.get('templates/countriesData.json')
        .success(function(response) {
          for (i = 0; i < response.Countries.length; i++) {
            latlongDefault = new google.maps.LatLng(response.Countries[i].latitude, response.Countries[i].longitude);
            var newMarker = new google.maps.Marker({
              map: $scope.map,
              animation: google.maps.Animation.DROP,
              position: latlongDefault
            });
          }
          $scope.countriesList = response.Countries;
        });

    }, function(error) {
      console.log("Could not get location");
    });


    /* _______________ Select Country Function  _________________ */
    $scope.showSelectValue = function(countriesList) {
      latlongSelected = new google.maps.LatLng(countriesList.latitude, countriesList.longitude);
      $scope.map.panTo(latlongSelected);
    }
  });
