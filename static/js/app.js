

//Initialize the map and set coordinates and zoom level
// var mymap = L.map('mapid').setView([37.09, -95.71], 13);

var mymap = L.map("mapid", {
    center: [39.74, -104.99],
    zoom: 5
});



//create a tile layer
L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id: 'mapbox.streets-basic',
    accessToken: API_KEY
}).addTo(mymap);


//define function to determine color of the marker
function colorSelector(newMag){
    
    var color = ['#84BC29','#A8E28C', '#F8FF44', '#F9A113', '#FF5B42', '#A0311B' ];
    return Math.floor(+newMag)>5 ? color[5]: color[Math.floor(+newMag)];
   
}

//define function to set size of marker
function markerSize(mag) {
    return mag * 10000;
  }

//get the data from USGS
var url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";
d3.json(url).then(function(gdata){

    var quakes = gdata["features"];

    var earthQuakes = [];
    for (var i =0; i< Object.keys(quakes).length; i++){
       
        //extract lat & long of the earthquake
        var location = [quakes[i]["geometry"]["coordinates"][1], quakes[i]["geometry"]["coordinates"][0]];
        var magnitude = quakes[i]["properties"]["mag"];
        var place = quakes[i]["properties"]["place"];
        var color = colorSelector(magnitude);
        // var color = ['#A9B527','#CCD69C', '#F4E477', '#D6B035', '#FF8A4C', '#A0311B' ];
      
        console.log("The coordinates are: ", location, ". The magnitude is: ", magnitude, ". The place is: ", place);


        L.circle(location, {
            fillOpacity: 1,
            weight: 0.5,
            color: "black",
            fillColor: color,
            radius: markerSize(magnitude)
          }).bindPopup("<p><b> Place: </b>" + place + "<br><br><b>Magnitude: </b>" + magnitude + "</p>")
          .addTo(mymap);
    };


    // Set up the legend
    var legend = L.control({position: 'bottomright'});
    legend.onAdd = function () {

        var div = L.DomUtil.create('div', 'info legend');
        labels = ['<label class=\'labelHeading\'><strong>Magnitude</strong></label><br><br>'],
        limits = ['0-1','1-2','2-3','3-4','4-5','5+'];
        var colors = ['#84BC29','#A8E28C', '#F8FF44', '#F9A113', '#FF5B42', '#A0311B' ];

        limits.forEach(function(limit, index) {
            // labels.push("<li style=\"background-color: " + colors[index] + "\">" + limit +  "</li>");
            labels.push("<label class=\"legendColor\" style=\"background-color: " + colors[index] + "\">" + "</label>" +
            "<label class=\"legendLabel\"  >" + limit +  "</label><br><br>");
        
        });
    
        // div.innerHTML += "<ul>" + labels.join("") + "</ul>";
        div.innerHTML += labels.join("") ;
        return div;


    };
    legend.addTo(mymap);





});