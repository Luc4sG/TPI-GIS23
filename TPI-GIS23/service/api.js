import axios from 'axios'

export const getIntersectedFeatures = async (layers, coords) => {
    const response = await axios.post('http://localhost:3000/intersect', {
      layers,
      coords
    })
    return response.data
  }