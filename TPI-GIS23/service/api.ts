import axios from 'axios'

const getIntersectedFeatures = async (layers: string[], coords: any[][]) => {
  const response = await axios.post('http://localhost:3000/intersect', {
    layers,
    coords
  });
  return response.data;
};

// Corrección: exportar la función por defecto
export default getIntersectedFeatures;