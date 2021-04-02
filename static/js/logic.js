// creating base/tile layers
var light = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "light-v10",
    accessToken: 'pk.eyJ1IjoiaC1oIiwiYSI6ImNrbXlpcW4yaTAwbXIyb2xjN25hZnY5aGkifQ.2cV4pBDkmq14E4mx-nh3NA'
  });

var dark = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
  attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
  maxZoom: 18,
  id: "dark-v10",
  accessToken: 'pk.eyJ1IjoiaC1oIiwiYSI6ImNrbXlpcW4yaTAwbXIyb2xjN25hZnY5aGkifQ.2cV4pBDkmq14E4mx-nh3NA'
});

//creating object of different base map layers
var baseMaps = {
    Light: light,
    Dark: dark
}

var url = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson'
// reading in data
d3.json(url, data => {
    
    var array = data.features
    var circleMarkers = [];
    console.log(data)
    array.forEach(object => {

        var magnitude = object.properties.mag
        if (magnitude >= 5){
            var colour = 'red'
        } else if (magnitude >= 4) {
            colour = '#ff6700'
        } else if (magnitude >= 3) {
            colour = '#ffa700'
        } else if (magnitude >= 2) {
            colour = '#fff400'
        } else if (magnitude >= 1) {
            colour = '#d6ff00'
        } else {
            colour = '#00ff38'
        }

        var geoLocation = (object.geometry.coordinates.slice(0,2))
        var coordinates = [geoLocation[1],geoLocation[0]]
        circleMarkers.push( 
            L.circle(coordinates, {
                fillColor: colour,
                fillOpacity: 0.75,
                color: colour,
                radius: magnitude*40000
            }).bindPopup(`<h2>Location:<h3>${object.properties.place}</h3></h2><hr>
                <h2>Magnitude: ${object.properties.mag}</h2>
                <h2>Date (UNIX): ${object.properties.time}</h2>`)
        );
    })
    
    var magnitudeLayer = L.layerGroup(circleMarkers);

    var overlayMaps = {
        Earthquakes: magnitudeLayer
    } 


    //creating map
    var myMap = L.map('map', {
        center: [0,0],
    zoom: 3,
    layers: [light, magnitudeLayer]
    })

    //adding layer control panel
    L.control.layers(baseMaps, overlayMaps).addTo(myMap)

})