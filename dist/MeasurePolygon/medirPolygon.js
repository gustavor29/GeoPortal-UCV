L.Control.MedirPolygon = L.Control.extend({
    onAdd: function (map) {
        const container = L.DomUtil.create('div', 'leaflet-bar leaflet-control');

        // Crear íconos para el control
        const iconInactive = this.createIcon('images/icons8-polygon-80.png', container);
        const iconActive = this.createIcon('images/icons8-radar-plot-50.png', container);
        iconActive.style.display = 'none'; // Oculto inicialmente

        let drawingActive = false;
        let drawnPolygons = []; // Almacena los polígonos dibujados

        // Evitar la propagación del clic al mapa
        L.DomEvent.disableClickPropagation(container);

        // Alterna el estado del control
        container.onclick = () => {
            drawingActive = !drawingActive;
            iconInactive.style.display = drawingActive ? 'none' : 'block';
            iconActive.style.display = drawingActive ? 'block' : 'none';

            if (drawingActive) {
                this.enableDrawing(map, drawnPolygons);
            } else {
                this.disableDrawing(map, drawnPolygons);
            }
        };

        return container;
    },

    onRemove: function () {
        // Limpieza si es necesario
    },

    // Crea un ícono con la ruta proporcionada
    createIcon: function (src, container) {
        const icon = L.DomUtil.create('img', '', container);
        icon.src = src;
        icon.style.width = '30px';
        icon.style.height = '30px';
        return icon;
    },

    // Habilita el dibujo de polígonos
    enableDrawing: function (map, drawnPolygons) {
        map.pm.enableDraw('Polygon', {
            snappable: true,
            snapDistance: 20,
            finishOn: 'dblclick',
            templineStyle: { color: 'red' },
            hintlineStyle: { color: 'red' },
            pathOptions: { color: 'rgba(255, 0, 0, 0.6)', fillColor: 'rgba(255, 0, 0, 0.3)' }
        });

        // Evento al crear el polígono
        map.on('pm:create', (e) => {
            const polygonLayer = e.layer;
            drawnPolygons.push(polygonLayer); // Guarda el polígono

            const geojson = polygonLayer.toGeoJSON();
            const areaInKm2 = turf.area(geojson) / 1e6; // Convertir a km²
            const perimeter = turf.length(geojson, { units: 'kilometers' }); // Perímetro en km

            // Mostrar los resultados en un popup
            polygonLayer.bindPopup(`
                <b>Área:</b> ${areaInKm2.toFixed(2)} km²<br>
                <b>Perímetro:</b> ${perimeter.toFixed(2)} km
            `).openPopup();
        });
    },

    // Deshabilita el dibujo y elimina los polígonos
    disableDrawing: function (map, drawnPolygons) {
        map.pm.disableDraw('Polygon');

        // Elimina los polígonos dibujados
        drawnPolygons.forEach((polygon) => map.removeLayer(polygon));
        drawnPolygons.length = 0; // Vaciar el array
    }
});

// Crear una instancia del control
L.control.medirPolygon = function (opts) {
    return new L.Control.MedirPolygon(opts);
};