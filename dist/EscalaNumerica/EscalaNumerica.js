L.Control.EscalaNumerica = L.Control.extend({
    options: {
        position: 'bottomleft'
    },
    onAdd: function (map) {
        var container = L.DomUtil.create('div', 'leaflet-control-scale-numeric');
        this._div = container;
        this.update();
        map.on('zoomend', this.update, this);
        return container;
    },
    update: function () {
        var zoomLevel = map.getZoom();
        var scale = 156543.03392 * Math.cos(map.getCenter().lat * Math.PI / 180) / Math.pow(2, zoomLevel);
        this._div.innerHTML = '<br>Escala: ' + scale.toFixed(0) + ' m/px';
    }

}
);

L.control.escalaNumerica = function(options) {
    return new L.Control.EscalaNumerica(options)};