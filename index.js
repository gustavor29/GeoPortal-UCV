var creole_50k;

var Stadia_AlidadeSatellite = L.tileLayer('https://tiles.stadiamaps.com/tiles/alidade_satellite/{z}/{x}/{y}{r}.{ext}', {
	minZoom: 0,
	maxZoom: 20,
	attribution: '&copy; CNES, Distribution Airbus DS, © Airbus DS, © PlanetObserver (Contains Copernicus Data) | &copy; <a href="https://www.stadiamaps.com/" target="_blank">Stadia Maps</a> &copy; <a href="https://openmaptiles.org/" target="_blank">OpenMapTiles</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
	ext: 'jpg'
});

var opentopo = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
  maxZoom: 19,
  attribution: 'Map data: © OpenStreetMap contributors, SRTM | Map style: © OpenTopoMap (CC-BY-SA)'
})

var Esri_WorldImagery = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
	attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
})

var Esri_WorldShadedRelief = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Shaded_Relief/MapServer/tile/{z}/{y}/{x}', {
	attribution: 'Tiles &copy; Esri &mdash; Source: Esri',
	maxZoom: 13
})

var Esri_WorldPhysical = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Physical_Map/MapServer/tile/{z}/{y}/{x}', {
	attribution: 'Tiles &copy; Esri &mdash; Source: US National Park Service',
	maxZoom: 8
})

var osmHOT = L.tileLayer('https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '© OpenStreetMap contributors, Tiles style by Humanitarian OpenStreetMap Team hosted by OpenStreetMap France'})

let map = L.map('MapArea', {
  center: [7, -67],
  zoom:6,
  editable: true,
  layers: [Esri_WorldShadedRelief]
});

var baseMaps = {
  "Stadia Satellite": Stadia_AlidadeSatellite,
  "Esri World Imagery": Esri_WorldImagery,
  "ESRI World Physical": Esri_WorldPhysical,
  "OpenTopoMap": opentopo
};
var overlayMaps = {
  "Limite de Estados": limEstados,
  "Fallas": fallas, 
  "Índice Creole 50.000": creole_50k,
  "Índice Creole 10.000": creole_10k, 
  "Unidades Geológicas": unidGeologicas
};

var layerControl = L.control.layers(baseMaps, overlayMaps).addTo(map);
var scale = L.control.scale({position:'bottomleft'}).addTo(map);
//var escalaNumControl = L.control.escalaNumerica().addTo(map);

//L.control.mousePosition().addTo(map);
//L.control.scalefactor().addTo(map)
//L.Control.boxzoom({ position:'topleft' }).addTo(map);
//L.control.navbar().addTo(map);

var ruler = new Ruler({
  unitSystem: 'metric',
  color: '#D20103'
}).addTo(map);

L.control.medirArea({ position: 'topleft' }).addTo(map);
L.control.exportarGeoJson({ position: 'topleft' }).addTo(map);

//var groupContainerM; // Variable global para el contenedor del grupo de Mediciones

//var groupContainer; // Variable global para el contenedor del grupo de carga de capas
//L.control.groupAddLayers().addTo(map);

//L.control.groupMeasurement().addTo(map);

//var loadRasterControl = L.control.loadRasterControl().addTo(map);
//map.addControl(new LoadRasterControl());

//console.log(ruler.initRuler())

//Cálculos escala gráfica
 
// Get the label.
/* var metres = scale._getRoundNum(map.containerPointToLatLng([0, map.getSize().y / 2 ]).distanceTo( map.containerPointToLatLng([scale.options.maxWidth,map.getSize().y / 2 ])))
  label = metres < 1000 ? metres + ' m' : (metres / 1000) + ' km';

  // console.log(metres, map.getZoom());

// Get the y,x dimensions of the map
var y = map.getSize().y,
    x = map.getSize().x;
// calculate the distance the one side of the map to the other using the haversine formula
var maxMeters = map.containerPointToLatLng([0, y]).distanceTo( map.containerPointToLatLng([x,y]));
// calculate how many meters each pixel represents
var MeterPerPixel = maxMeters/x ;

// say this is your scale
//var scale = L.control.scale().addTo(map);    

// This is the scale denominator
var scale = (MeterPerPixel*scale.options.maxWidth)
console.log(texto + " " + String(parseInt(scale,10))) */