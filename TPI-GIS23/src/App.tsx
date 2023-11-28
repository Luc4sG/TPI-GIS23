import React, {useState} from 'react';
import { fromLonLat, get, toLonLat } from "ol/proj";
import {
  RMap,
  RControl,
  RLayerTileWMS,
  RLayerWMS,
  RInteraction,
  RLayerVector,
  RStyle
} from "rlayers";
import "ol/ol.css";
import "rlayers/control/layers.css";
import './App.css'
import { RScaleLine } from "rlayers/control";
import { shiftKeyOnly } from 'ol/events/condition';
import { Coordinate } from 'ol/coordinate';
import getIntersectedFeatures from '../service/api.ts';

interface Layer {
  sourceName: string;
}


// const layersButton = <button>&#9776;</button>;
export default function Layers(): JSX.Element {

  const layers = [
    { label: 'actividades_agropecuarias', layer: 'Actividades Agropecuarias' },
    { label: 'actividades_economicas', layer: 'Actividades Economicas' },
    { label: 'complejo_de_energia_ene', layer: 'Complejo De Energia' },
    { label: 'curso_de_agua_hid', layer: 'Curso De Agua' },
    { label: 'curvas_de_nivel', layer: 'Curvas De Nivel' },
    { label: 'edif_construcciones_turisticas', layer: 'Edificio Construcciones Turisticas' },
    { label: 'edif_depor_y_esparcimiento', layer: 'Edificio Depor Y Esparcimiento' },
    { label: 'edif_educacion', layer: 'Edificio Educacion' },
    { label: 'edif_religiosos', layer: 'Edificio Religiosos' },
    { label: 'edificio_de_seguridad_ips', layer: 'Edificio De Seguridad' },
    { label: 'edificio_publico_ips', layer: 'Edificio Público' },
    { label: 'edificios_ferroviarios', layer: 'Edificios Ferroviarios' },
    { label: 'edificio_de_salud_ips', layer: 'Edifificio De Salud' },
    { label: 'ejido', layer: 'Ejido' },
    { label: 'espejo_de_agua_hid', layer: 'Espejos De Agua' },
    { label: 'estructuras_portuarias', layer: 'Estructuras Portuarias' },
    { label: 'infraestructura_aeroportuaria_punto', layer: 'Infraest Aeroportuaria Punto' },
    { label: 'infraestructura_hidro', layer: 'Infraestructura Hidro' },
    { label: 'isla', layer: 'Isla' },
    { label: 'limite_politico_administrativo_lim', layer: 'Limite Politico Administrativo' },
    { label: 'líneas_de_conducción_ene', layer: 'Lineas De Conduccion Ene' },
    { label: 'localidades', layer: 'Localidad' },
    { label: 'marcas_y_señales', layer: 'Marcas Y Senales' },
    { label: 'muro_embalse', layer: 'Muro Embalse' },
    { label: 'obra_portuaria', layer: 'Obra Portuaria' },
    { label: 'obra_de_comunicación', layer: 'Obras De Comunicacion' },
    { label: 'otras_edificaciones', layer: 'Otras Edificaciones' },
    { label: 'pais_lim', layer: 'Pais' },
    { label: 'puente_red_vial_puntos', layer: 'Puente Red Vial Punto' },
    { label: 'puntos_de_alturas_topograficas', layer: 'Puntos De Alturas Topograficas' },
    { label: 'puntos_del_terreno', layer: 'Puntos Del Terreno' },
    { label: 'red_ferroviaria', layer: 'Red Ferroviaria' },
    { label: 'red_vial', layer: 'Red Vial' },
    { label: 'salvado_de_obstaculo', layer: 'Salvado De Obstaculo' },
    { label: 'señalizaciones', layer: 'Señalizaciones' },
    { label: 'sue_congelado', layer: 'Suelo Congelado' },
    { label: 'sue_consolidado', layer: 'Suelo Consolidado' },
    { label: 'sue_costero', layer: 'Suelo Costero' },
    { label: 'sue_hidromorfologico', layer: 'Suelo Hidromorfologico' },
    { label: 'sue_no_consolidado', layer: 'Suelo No Consolidado' },
    { label: 'veg_arborea', layer: 'Vegetación Arborea' },
    { label: 'veg_arbustiva', layer: 'Vegetación Arbustiva' },
    { label: 'veg_cultivos', layer: 'Vegetación Cultivos' },
    { label: 'veg_hidrofila', layer: 'Vegetación Hidrofila' },
    { label: 'veg_suelo_desnudo', layer: 'Vegetación Suelo Desnudo' },
    { label: 'vias_secundarias', layer: 'Vias Secundarias' }
  ];
  function calcularVerticesDiagonales(coord1: any[], coord2: any[]): any[][] {
    // Coord1 y Coord2 son las coordenadas diagonales opuestas
    const x1 = coord1[0];
    const y1 = coord1[1];
    const x2 = coord2[0];
    const y2 = coord2[1];
  
    // Calcular las coordenadas de los vértices restantes
    const topLeft = [x1, y2];
    const topRight = [x2, y2];
    const bottomLeft = [x1, y1];
    const bottomRight = [x2, y1];
  
    return Array.from([topLeft, topRight, bottomLeft, bottomRight]);
  }
  // const coordsToString = (coords: number[]) =>
  // `${coords[1].toFixed(3)}:${coords[0].toFixed(3)}`;

  // const [layerActual, setLayerActual] = useState<string | null>(null);

  const [selectedLayers, setSelectedLayers] = useState<string[]>([]);
  const handleLayerChange = (selectedLayer: string): void => {
    // Toggle la capa seleccionada (agrega o elimina de la lista)
    setSelectedLayers((prevSelectedLayers) => {
      const isSelected = prevSelectedLayers.includes(selectedLayer);
      if (isSelected) {
        // Si ya estaba seleccionada, la eliminamos
        return prevSelectedLayers.filter((layer) => layer !== selectedLayer);
      } else {
        // Si no estaba seleccionada, la agregamos
        return [...prevSelectedLayers, selectedLayer];
      }
    });
  };

  const testcord = [
    [-63.6796875, -38.414373789565516],
    [-58.40625, -38.414373789565516],
    [-63.6796875, -35.285475652212575],
    [-58.40625, -35.285475652212575],
  ];
  const testlay: Layer[] = [
    {
      sourceName: 'ejido',
    },
  ];
  

  var startDragBox: Coordinate

  return (
    <div style={{ display: 'flex', flexDirection: 'row' }}>
      {/* haceme un boton que llame al getIntersectedfeauters y le pase testlay y testcord */}
      {/* <button onClick={() => getIntersectedFeatures(testlay, testcord)}>Test</button> */}
      
      <RMap
        className="example-map"
        initial={{ center: fromLonLat([-57,-38]), zoom: 5 }}
        width={"80vw"}
        height={"100vh"}
      >
       
        
        <RLayerTileWMS
            properties={{ label: "layer" }}
            url='https://wms.ign.gob.ar/geoserver/ows'
            params={{
              LAYERS: 'capabaseargenmap',
              FORMAT: "image/jpeg",
              serverType: "mapserver",
            }}
          />

            <RLayerTileWMS
                 properties={{ label: "yis" }}
                 url='http://localhost/cgi-bin/qgis_mapserv.fcgi?map=/usr/local/share/qgis/tpigis.qgz'
                 params={{
                   LAYERS: selectedLayers,
                   FORMAT: "image/png",
                   serverType: "mapserver",
                 }}
               />

      <RLayerVector>
        <RStyle.RStyle>
          <RStyle.RStroke color="#0000ff" width={3} />
          <RStyle.RFill color="rgba(0, 0, 0, 0.75)" />
        </RStyle.RStyle>

        {/* Interacción de arrastre de caja */}
        <RInteraction.RDragBox
          condition={shiftKeyOnly}
          onBoxStart={(event) => startDragBox = event.coordinate}
          onBoxEnd={(event) => getIntersectedFeatures(selectedLayers, calcularVerticesDiagonales(toLonLat(startDragBox) ,toLonLat(event.coordinate)))} //coordsToString(toLonLat(event.coordinate)
        />
      </RLayerVector>


        <RScaleLine></RScaleLine>
      </RMap>
      <div
        className="bg-gray-500 p-3 rounded-md text-white"
        style={{
          width: '20vw', // Ancho fijo para evitar cambios al agregar leyendas
        }}
      >
        <div className="mt-3" 
        style={{
          height: '50vh',
          overflowY: 'auto',
          width: '20vw', // Ancho fijo para evitar cambios al agregar leyendas
        }}>
        <h6 className="mb-3 bg-slate-600 rounded-md p-2">Capas disponibles:</h6>
          {layers.map((layer) => (
            <div key={layer.label}>
              <input
                type="checkbox"
                id={layer.label}
                className="form-checkbox h-5 w-5 text-blue-600 accent-slate-800 cursor-pointer"
                checked={selectedLayers.includes(layer.label)}
                onChange={() => handleLayerChange(layer.label)}
              />
              <label htmlFor={layer.label}>{layer.layer}</label>
            </div>
          ))}
        </div>
        
        <div
        style={{
          
          borderTop: '1px solid Black',
          height: '49vh',
          overflowY: 'auto',
          width: '20vw', // Ancho fijo para evitar cambios al agregar leyendas
        }}>
          {selectedLayers.map((selectedLayer) => (
             <div key={selectedLayer} style={{ marginBottom: '10px' }}>
             <img
               src={`http://localhost/cgi-bin/qgis_mapserv.fcgi?map=/usr/local/share/qgis/tpigis.qgz&SERVICE=WMS&REQUEST=GetLegendGraphic&LAYER=${selectedLayer}&FORMAT=image/png`}
               alt={`Legend for ${selectedLayer}`}
             />
           </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// export default App

