import { useEffect, useState, useRef } from 'react'
import { postMarker } from '../service/api'
import { useSelector } from 'react-redux'
import { Feature, Overlay } from 'ol'
import { Point } from 'ol/geom'
import { Icon, Style } from 'ol/style'

import GeoJSON from 'ol/format/GeoJSON'

const AddMarkerInteraction = ({isShown, setIsShown}) => {

const popUpRef = useRef(null)
const coordenadas = useSelector(state => state.coordenadas)
console.log(coordenadas)

  const handleSubmit = async (evt) => {
    evt.preventDefault()

    const marker = {
        "properties": {
            "name": evt.target.name.value,
            "description": evt.target.description.value
        },
        "geometry": {
            "coordinates": coordenadas
        }
    }
    console.log(marker)

    postMarker(marker)
        // {
        //     "properties": {
        //       "name": "Marker Name",
        //       "description": "Marker Description"
        //     },
        //     "geometry": {
        //       "coordinates": [longitude, latitude]
        //     }
        //   }

    setIsShown() 
  }


  return (
    <form  onSubmit={handleSubmit}>
      {isShown && (
        <div >
          <div>
            <label htmlFor='name'>Nombre</label>
            <input  type='text' name='name' required />
          </div>
          <div>
            <label htmlFor='description'>Descripción</label>
            <input  type='text' name='description' required />
          </div>
          <button  type='submit'>Guardar</button>
        </div>
      )}
    </form>
  )
}

export default AddMarkerInteraction