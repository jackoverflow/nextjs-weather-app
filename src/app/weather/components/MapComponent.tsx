import React, { useEffect } from 'react';
import { Map, View } from 'ol';
import { fromLonLat } from 'ol/proj';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import { Icon, Style } from 'ol/style';
import { Feature } from 'ol';
import { Point } from 'ol/geom';
import { Vector as VectorLayer } from 'ol/layer';
import VectorSource from 'ol/source/Vector';
import { Map as OlMap } from 'ol';

const MapComponent: React.FC<{ lat: number; lon: number; city: string }> = ({ lat, lon, city }) => {
  useEffect(() => {
    const map = new OlMap({
      target: 'map', // The ID of the div where the map will be rendered
      layers: [
        new TileLayer({
          source: new OSM(),
        }),
        new VectorLayer({
          source: new VectorSource({
            features: [
              new Feature({
                geometry: new Point(fromLonLat([lon, lat])),
                name: city,
              }),
            ],
          }),
          style: new Style({
            image: new Icon({
              src: 'https://openlayers.org/en/latest/examples/data/icon.png', // Replace with your marker icon URL
              scale: 0.1,
            }),
          }),
        }),
      ],
      view: new View({
        center: fromLonLat([lon, lat]),
        zoom: 13,
      }),
    });

    return () => map.setTarget(undefined); // Cleanup on unmount
  }, [lat, lon, city]);

  return (
    <div id="map" style={{ height: '400px', width: '100%', marginTop: '20px' }} />
  );
};

export default MapComponent;