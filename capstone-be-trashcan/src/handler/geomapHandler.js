const axios = require('axios');

const getNearestWasteBank = async (request, h) => {
  const { location } = request.query;
  if (!location) {
    return h.response('Location is required').code(400);
  }

  try {
    // Use Google Places API untuk bank sampah
    const response = await axios.get(`https://maps.googleapis.com/maps/api/place/nearbysearch/json`, {
      params: {
        location: location, // format: 'latitude,longitude'
        radius: 5000, // in meters
        keyword: 'bank sampah',
        key: process.env.REACT_APP_GOOGLE_MAPS_API_KEY, // Menggunakan env var untuk API key
      }
    });

    const places = response.data.results.map(place => ({
      name: place.name,
      address: place.vicinity,
      location: place.geometry.location,
      distance: calculateDistance(location, place.geometry.location), // calculate distance
    }));

    places.sort((a, b) => a.distance - b.distance);

    return h.response({ nearest: places[0], others: places.slice(1) });
  } catch (error) {
    console.error('Error fetching data from Google Places API:', error);
    return h.response('Internal Server Error').code(500);
  }
};

// Calculate distance between two locations
const calculateDistance = (origin, destination) => {
  const [lat1, lon1] = origin.split(',').map(Number);
  const { lat: lat2, lng: lon2 } = destination;
  const R = 6371e3; // metres
  const φ1 = lat1 * Math.PI/180; // φ, λ in radians
  const φ2 = lat2 * Math.PI/180;
  const Δφ = (lat2-lat1) * Math.PI/180;
  const Δλ = (lon2-lon1) * Math.PI/180;

  const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
            Math.cos(φ1) * Math.cos(φ2) *
            Math.sin(Δλ/2) * Math.sin(Δλ/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

  const d = R * c; // in metres
  return d;
};

module.exports = {
  getNearestWasteBank,
  calculateDistance
};
