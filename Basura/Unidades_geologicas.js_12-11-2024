var geoJsonLayer;
//var unidGeologicas;
// Mapa de colores por cada valor único de "Unit_abbre"
const colorMap = {};

// Función para generar un color aleatorio
function getRandomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

// Estilo basado en el campo "Unit_abbre"
function styleByUnitAbbre(feature) {
    const unitAbbre = feature.properties.Unit_abbre;

    if (!colorMap[unitAbbre]) {
        colorMap[unitAbbre] = getRandomColor();
    }

    return {
        fillColor: colorMap[unitAbbre],
        weight: 1,
        color: 'black',
        fillOpacity: 0.6
    };
}

// Función para convertir el Shapefile a GeoJSON y agregarlo al mapa
async function loadShapefileToGeoJSON() {
    const geoJsonFeatures = [];

    try {
        // Leer el Shapefile y procesar cada Feature
        const source = await shapefile.open("data/Uniddes_geologicas.shp");
        
        let result = await source.read();
        while (!result.done) {
            //console.log("Feature cargado:", result.value); // Verificar cada Feature cargado
            geoJsonFeatures.push(result.value); // Agregar cada Feature al array
            result = await source.read(); // Leer el siguiente Feature
        }

        // Verificar si se han cargado características
        console.log("Unid Geologicas:", unidGeologicas.length);
        if (geoJsonFeatures.length === 0) {
            console.warn("No se encontraron características en el Shapefile.");
            return;
        }

        // Crear una capa GeoJSON con las características del Shapefile
        var unidGeologicas = L.geoJSON({ type: "FeatureCollection", features: geoJsonFeatures }, {
            style: styleByUnitAbbre // Usa la función de estilo
            
        }, {geometryToLayer: function (feature, latlng) {
            return L.polygon(latlng, {});
            }}
        ).bindPopup(function (layer) {
            return layer.feature.properties.Unit_abbre});
                    
        // Añadir la capa al mapa y al control de capas
        //overlayMaps["Unidades Geológicas"] = geoJsonLayer;
        //geoJsonLayer.addTo(map);
        /* if (!layerControl) {
            layerControl = L.control.layers(baseMaps, overlayMaps).addTo(map);
        } */
    } catch (error) {
        console.error("Error al cargar el Shapefile:", error);
    }
}

// Llamar a la función para cargar y mostrar el Shapefile
loadShapefileToGeoJSON();