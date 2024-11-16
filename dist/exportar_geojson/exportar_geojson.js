L.Control.ExportarGeoJson = L.Control.extend({
    options: {
        position: 'topright'
    },

    onAdd: function (map) {
        const container = L.DomUtil.create('div', 'leaflet-control leaflet-bar leaflet-control-custom');
        const icon = L.DomUtil.create('img', '', container);
        icon.src = "images/icons8-descargar-inactive.png";
        icon.alt = "Exportar GeoJSON";
        icon.style.width = "26px";
        icon.style.height = "26px";

        let isActive = false;
        this.drawnPolygon = null;
        this.vertexMarkers = []; // Array para almacenar los vértices
        this.layersWithPopups = []; // Array para almacenar las capas y contenido de los popups

        container.onclick = () => {
            isActive = !isActive;
            icon.src = isActive ? "images/icons8-descargar-active.png" : "images/icons8-descargar-inactive.png";

            if (isActive) {
                map.getContainer().style.cursor = 'crosshair'; // Puntero en forma de cruz
                this._disablePopups(map); // Deshabilitar popups
                this._startDrawing(map);
            } else {
                map.getContainer().style.cursor = ''; // Restaurar puntero por defecto
                this._enablePopups(); // Rehabilitar popups
                this._stopDrawing(map);
            }
        };

        L.DomEvent.disableClickPropagation(container);
        return container;
    },

    _disablePopups: function (map) {
        // Deshabilita los popups en las capas GeoJSON y almacena el contenido
        map.eachLayer(layer => {
            if (layer.getPopup && layer.getPopup()) {
                this.layersWithPopups.push({ layer, content: layer.getPopup().getContent() }); // Almacena la capa y su contenido
                layer.unbindPopup(); // Desactiva temporalmente el popup
            }
        });
    },

    _enablePopups: function () {
        // Vuelve a habilitar los popups de las capas almacenadas
        this.layersWithPopups.forEach(({ layer, content }) => {
            layer.bindPopup(content); // Reactiva el popup con su contenido original
        });
        this.layersWithPopups = []; // Limpia el array
    },

    _startDrawing: function (map) {
        this.drawnPolygon = new L.Polygon([], {
            color: 'blue',
            weight: 2
        }).addTo(map);

        map.doubleClickZoom.disable();
        map.on('click', this._addLatLng, this);

        // Cierre del polígono con doble clic sin cambiar el zoom
        map.on('dblclick', (e) => {
            L.DomEvent.preventDefault(e); // Previene el zoom in con doble clic
            L.DomEvent.stopPropagation(e);
            this._finishDrawing(map);
        });

        // Cierre al hacer clic en el primer vértice
        this.drawnPolygon.on('click', (e) => {
            if (this.drawnPolygon.getLatLngs()[0].length > 2 && e.latlng.equals(this.drawnPolygon.getLatLngs()[0][0])) {
                this._finishDrawing(map);
            }
        });
    },

    _finishDrawing: function (map) {
        map.off('click', this._addLatLng, this);
        map.off('dblclick');
        const features = this.getFeaturesInPolygon(map, this.drawnPolygon);
        this.exportGeoJSON(features);

        map.doubleClickZoom.enable();
        map.getContainer().style.cursor = ''; // Restaurar el cursor al finalizar
        this._enablePopups(); // Rehabilitar popups al finalizar el dibujo
    },

    _stopDrawing: function (map) {
        if (this.drawnPolygon) {
            map.removeLayer(this.drawnPolygon);
            this.drawnPolygon = null;
        }

        this.vertexMarkers.forEach(marker => map.removeLayer(marker));
        this.vertexMarkers = [];
        
        map.doubleClickZoom.enable();
        map.getContainer().style.cursor = ''; // Restaurar cursor al deshabilitar el control
        this._enablePopups(); // Rehabilitar popups al deshabilitar el control
    },

    _addLatLng: function (e) {
        this.drawnPolygon.addLatLng(e.latlng);

        // Crear un marcador para cada vértice
        const vertexMarker = new L.Marker(e.latlng, {
            icon: L.divIcon({
                className: 'polygon-vertex-icon',
                iconSize: [8, 8]
            }),
            interactive: false
        }).addTo(this._map);

        this.vertexMarkers.push(vertexMarker);
    },

    // Obtener las capas vectoriales contenidas en el polígono
    getFeaturesInPolygon: function (map, polygonLayer) {
        const polygonGeoJSON = polygonLayer.toGeoJSON();
        const features = [];
    
        // Verificar que el polígono tenga coordenadas válidas
        if (!polygonGeoJSON.geometry || !polygonGeoJSON.geometry.coordinates || polygonGeoJSON.geometry.coordinates.length === 0) {
            console.warn("El polígono de selección no tiene coordenadas válidas.");
            return features; // Devuelve una lista vacía si el polígono es inválido
        }
    
        map.eachLayer((layer) => {
            if (layer instanceof L.GeoJSON) {
                layer.eachLayer((featureLayer) => {
                    const featureGeoJSON = featureLayer.toGeoJSON();
    
                    // Verificar que el feature tenga geometría válida
                    if (featureGeoJSON.geometry && featureGeoJSON.geometry.coordinates && featureGeoJSON.geometry.coordinates.length > 0) {
                        try {
                            // Solo agregar si hay una intersección válida
                            if (turf.booleanIntersects(polygonGeoJSON, featureGeoJSON)) {
                                features.push(featureGeoJSON);
                            }
                        } catch (error) {
                            console.error("Error procesando la geometría:", error);
                        }
                    } else {
                        console.warn("Se omitió una capa debido a geometría vacía o inválida.");
                    }
                });
            }
        });
    
        return features;
    },

    // Exportar las capas vectoriales como GeoJSON
    exportGeoJSON: function (features) {
        const geoJSON = { type: 'FeatureCollection', features: features };
        const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(geoJSON));
        const downloadAnchor = document.createElement('a');
        downloadAnchor.setAttribute('href', dataStr);
        downloadAnchor.setAttribute('download', 'exported_layers.geojson');
        document.body.appendChild(downloadAnchor);
        downloadAnchor.click();
        document.body.removeChild(downloadAnchor);
    }
});

L.control.exportarGeoJson = function (opts) {
    return new L.Control.ExportarGeoJson(opts);
};