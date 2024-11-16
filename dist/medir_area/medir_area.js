/* L.Control.MedirArea = L.Control.extend({
    options: {
        position: 'topright'
    },

    initialize: function (options) {
        L.setOptions(this, options);
    },

    onAdd: function (map) {
        const container = L.DomUtil.create('div', 'leaflet-control-medicion');
        container.innerHTML = '<img src="images/icons8-polygon-80.png" class="medir-icon" alt="Medir área">';

        // Configuración del icono para alternar entre habilitar y deshabilitar
        container.onclick = () => {
            if (!this._enabled) {
                this.enableMedicion(map);
                container.innerHTML = '<img src="images/icons8-radar-plot-50.png" class="medir-icon" alt="Medir área activa">';
            } else {
                this.disableMedicion(map);
                container.innerHTML = '<img src="images/icons8-polygon-80.png" class="medir-icon" alt="Medir área">';
            }
        };

        return container;
    },

    onRemove: function (map) {
        this.disableMedicion(map);
    },

    enableMedicion: function (map) {
        this._enabled = true;
        this.drawControl = new L.Draw.Polygon(map, {
            showArea: false,
            repeatMode: false,
            shapeOptions: {
                color: '#3388ff',
                weight: 4
            }
        });

        // Desactivar el tooltip de instrucciones de dibujo
        L.drawLocal.draw.handlers.polygon.tooltip = {
            start: '', // Vacío para deshabilitar el mensaje inicial
            cont: '', // Vacío para deshabilitar el mensaje al continuar el dibujo
            end: '' // Vacío para deshabilitar el mensaje de cierre del polígono
        };

        map.on(L.Draw.Event.CREATED, this.onPolygonCreated, this);
        this.drawControl.enable();
    },

    disableMedicion: function (map) {
        this._enabled = false;
        if (this.drawControl) this.drawControl.disable();
        map.off(L.Draw.Event.CREATED, this.onPolygonCreated, this);

        // Elimina el polígono y su popup, si existen
        if (this.drawnPolygon) {
            map.removeLayer(this.drawnPolygon);
            this.drawnPolygon = null;
        }
    },

    onPolygonCreated: function (e) {
        const layer = e.layer;
    
        // Si ya existe un polígono, lo elimina antes de agregar uno nuevo
        if (this.drawnPolygon) {
            this.drawnPolygon.remove();
        }
    
        this.drawnPolygon = layer;
    
        const latlngs = layer.getLatLngs()[0];
    
        // Cálculo del perímetro en kilómetros
        let perimetro = 0;
        for (let i = 0; i < latlngs.length - 1; i++) {
            perimetro += latlngs[i].distanceTo(latlngs[i + 1]) / 1000; // Convertir a km
        }
        perimetro += latlngs[latlngs.length - 1].distanceTo(latlngs[0]) / 1000;
    
        // Cálculo del área en kilómetros cuadrados
        const areaMeters = L.GeometryUtil.geodesicArea(latlngs);
        const areaKilometers = areaMeters / 1e6; // Convertir a km²
    
        // Crear y añadir un tooltip persistente al polígono con el área y el perímetro
        const resultadoHTML = `
            Área: ${areaKilometers.toFixed(2)} km²<br>
            Perímetro: ${perimetro.toFixed(2)} km
        `;
        layer.bindTooltip(resultadoHTML, { permanent: true, direction: 'center', className: 'result-tooltip' });
    
        this.drawnPolygon.addTo(map);
    }
    
});

L.control.medirArea = function (options) {
    return new L.Control.MedirArea(options);
}; */
// _____________________________
L.Control.MedirArea = L.Control.extend({
    onAdd: function (map) {
        const container = L.DomUtil.create('div', 'leaflet-control leaflet-bar leaflet-control-custom');
        const icon = L.DomUtil.create('img', '', container);
        icon.src = "images/icons8-area-inactive.png";
        icon.alt = "Medir Área";
        icon.style.width = "26px";
        icon.style.height = "26px";

        let isEnabled = false;

        container.onclick = () => {
            isEnabled = !isEnabled;
            icon.src = isEnabled ? "images/icons8-area-active.png" : "images/icons8-area-inactive.png";

            if (isEnabled) {
                this._startMeasuring(map);
            } else {
                this._stopMeasuring(map);
            }
        };

        L.DomEvent.disableClickPropagation(container);
        return container;
    },

    _startMeasuring: function (map) {
        // Lógica para habilitar la medición de área
        this._enabled = true;
        this.drawControl = new L.Draw.Polygon(map, {
            showArea: false,
            repeatMode: false,
            shapeOptions: {
                color: '#3388ff',
                weight: 4
            }
        });

        // Desactivar el tooltip de instrucciones de dibujo
        L.drawLocal.draw.handlers.polygon.tooltip = {
            start: '', // Vacío para deshabilitar el mensaje inicial
            cont: '', // Vacío para deshabilitar el mensaje al continuar el dibujo
            end: '' // Vacío para deshabilitar el mensaje de cierre del polígono
        };

        map.on(L.Draw.Event.CREATED, this.onPolygonCreated, this);
        this.drawControl.enable();
    },

    _stopMeasuring: function (map) {
        this._enabled = false;
        if (this.drawControl) this.drawControl.disable();
        map.off(L.Draw.Event.CREATED, this.onPolygonCreated, this);

        // Elimina el polígono y su popup, si existen
        if (this.drawnPolygon) {
            map.removeLayer(this.drawnPolygon);
            this.drawnPolygon = null;
        }
    },

    onRemove: function (map) {
        this.disableMedicion(map);
    },
    onPolygonCreated: function (e) {
        const layer = e.layer;
    
        // Si ya existe un polígono, lo elimina antes de agregar uno nuevo
        if (this.drawnPolygon) {
            this.drawnPolygon.remove();
        }
    
        this.drawnPolygon = layer;
    
        const latlngs = layer.getLatLngs()[0];
    
        // Cálculo del perímetro en kilómetros
        let perimetro = 0;
        for (let i = 0; i < latlngs.length - 1; i++) {
            perimetro += latlngs[i].distanceTo(latlngs[i + 1]) / 1000; // Convertir a km
        }
        perimetro += latlngs[latlngs.length - 1].distanceTo(latlngs[0]) / 1000;
    
        // Cálculo del área en kilómetros cuadrados
        const areaMeters = L.GeometryUtil.geodesicArea(latlngs);
        const areaKilometers = areaMeters / 1e6; // Convertir a km²
    
        // Crear y añadir un tooltip persistente al polígono con el área y el perímetro
        const resultadoHTML = `
            Área: ${areaKilometers.toFixed(2)} km²<br>
            Perímetro: ${perimetro.toFixed(2)} km
        `;
        layer.bindTooltip(resultadoHTML, { permanent: true, direction: 'center', className: 'result-tooltip' });
    
        this.drawnPolygon.addTo(map);
    }
    
});

L.control.medirArea = function (options) {
    return new L.Control.MedirArea(options);
};
