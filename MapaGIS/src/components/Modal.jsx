
import React from 'react';
import { useSelector } from 'react-redux'
import { redirect } from 'react-router-dom';

export default function Modal(){

    const consultLayer = useSelector(state => state.consulta.consulta)
    const objectLayer = JSON.parse(consultLayer)

    const handlerVolver = () => {
      //deberia redireccionar a la pagina principal osea "/"
      return redirect("/")



    }
    
    const renderTable = (data) => {
      return Object.keys(data).map((layerName, index) => {
        const layerData = data[layerName];
  
        if (layerData && layerData.rows && layerData.rows.length > 0) {
          const headers = Object.keys(layerData.rows[0]).filter(
            (header) => header !== "geom",
          );
  
          return (
            <div key={index}>
              <h2>{layerName}</h2>
              <table border="1">
                <thead>
                  <tr>
                    {headers.map((header) => (
                      <th key={header}>{header}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {layerData.rows.map((row, rowIndex) => (
                    <tr key={rowIndex}>
                      {headers.map((header) => (
                        <td key={header}>{row[header]}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          );
        } else {
          return (
            <div key={index}>
              <h2>{layerName}</h2>
              <p>No hay datos disponibles para esta capa.</p>
            </div>
          );
        }
      });
    };

    return (
        <div>
        
        <h1>Consultas</h1>
        <button onClick={handlerVolver()}>Volver</button>
        
          
          {renderTable(objectLayer)}

        </div>
    )};

