export interface IndianLocation {
  name: string;
  district: string;
  state: string;
  lat: number;
  lon: number;
  isPopular?: boolean;
}

// Comprehensive database of major agricultural districts & APMC hubs across India
export const ALL_INDIA_LOCATIONS: IndianLocation[] = [
  // Telangana
  { name: 'Warangal', district: 'Warangal', state: 'Telangana', lat: 17.9689, lon: 79.5941, isPopular: true },
  { name: 'Khammam', district: 'Khammam', state: 'Telangana', lat: 17.2473, lon: 80.1514, isPopular: true },
  { name: 'Nizamabad', district: 'Nizamabad', state: 'Telangana', lat: 18.6725, lon: 78.0941, isPopular: true },
  { name: 'Karimnagar', district: 'Karimnagar', state: 'Telangana', lat: 18.4386, lon: 79.1288 },
  { name: 'Nalgonda', district: 'Nalgonda', state: 'Telangana', lat: 17.0575, lon: 79.2684 },
  { name: 'Mahabubnagar', district: 'Mahabubnagar', state: 'Telangana', lat: 16.7488, lon: 77.9840 },
  { name: 'Suryapet', district: 'Suryapet', state: 'Telangana', lat: 17.1439, lon: 79.6239 },
  { name: 'Hyderabad', district: 'Hyderabad', state: 'Telangana', lat: 17.3850, lon: 78.4867, isPopular: true },

  // Andhra Pradesh
  { name: 'Guntur', district: 'Guntur', state: 'Andhra Pradesh', lat: 16.3067, lon: 80.4365, isPopular: true },
  { name: 'Kurnool', district: 'Kurnool', state: 'Andhra Pradesh', lat: 15.8281, lon: 78.0373, isPopular: true },
  { name: 'Vijayawada', district: 'Krishna', state: 'Andhra Pradesh', lat: 16.5062, lon: 80.6480, isPopular: true },
  { name: 'Anantapur', district: 'Anantapur', state: 'Andhra Pradesh', lat: 14.6819, lon: 77.6006 },
  { name: 'Nellore', district: 'Nellore', state: 'Andhra Pradesh', lat: 14.4426, lon: 79.9865 },
  { name: 'Eluru', district: 'West Godavari', state: 'Andhra Pradesh', lat: 16.7107, lon: 81.0952 },
  { name: 'Rajahmundry', district: 'East Godavari', state: 'Andhra Pradesh', lat: 17.0005, lon: 81.8040 },
  { name: 'Madanapalle', district: 'Chittoor', state: 'Andhra Pradesh', lat: 13.5560, lon: 78.5010 },

  // Maharashtra
  { name: 'Nashik', district: 'Nashik', state: 'Maharashtra', lat: 19.9975, lon: 73.7898, isPopular: true },
  { name: 'Pune', district: 'Pune', state: 'Maharashtra', lat: 18.5204, lon: 73.8567, isPopular: true },
  { name: 'Nagpur', district: 'Nagpur', state: 'Maharashtra', lat: 21.1458, lon: 79.0882, isPopular: true },
  { name: 'Jalgaon', district: 'Jalgaon', state: 'Maharashtra', lat: 21.0077, lon: 75.5626 },
  { name: 'Kolhapur', district: 'Kolhapur', state: 'Maharashtra', lat: 16.7050, lon: 74.2433 },
  { name: 'Solapur', district: 'Solapur', state: 'Maharashtra', lat: 17.6599, lon: 75.9064 },
  { name: 'Ahmednagar', district: 'Ahmednagar', state: 'Maharashtra', lat: 19.0948, lon: 74.7480 },
  { name: 'Latur', district: 'Latur', state: 'Maharashtra', lat: 18.4088, lon: 76.5604 },
  { name: 'Amravati', district: 'Amravati', state: 'Maharashtra', lat: 20.9320, lon: 77.7523 },
  { name: 'Mumbai', district: 'Mumbai', state: 'Maharashtra', lat: 19.0760, lon: 72.8777 },

  // Madhya Pradesh
  { name: 'Indore', district: 'Indore', state: 'Madhya Pradesh', lat: 22.7196, lon: 75.8577, isPopular: true },
  { name: 'Ujjain', district: 'Ujjain', state: 'Madhya Pradesh', lat: 23.1765, lon: 75.7885 },
  { name: 'Mandsaur', district: 'Mandsaur', state: 'Madhya Pradesh', lat: 24.0729, lon: 75.0682 },
  { name: 'Neemuch', district: 'Neemuch', state: 'Madhya Pradesh', lat: 24.4754, lon: 74.8703 },
  { name: 'Bhopal', district: 'Bhopal', state: 'Madhya Pradesh', lat: 23.2599, lon: 77.4126, isPopular: true },
  { name: 'Jabalpur', district: 'Jabalpur', state: 'Madhya Pradesh', lat: 23.1815, lon: 79.9864 },
  { name: 'Hoshangabad (Narmadapuram)', district: 'Narmadapuram', state: 'Madhya Pradesh', lat: 22.7519, lon: 77.7289 },

  // Punjab & Haryana
  { name: 'Khanna', district: 'Ludhiana', state: 'Punjab', lat: 30.7071, lon: 76.2167, isPopular: true },
  { name: 'Ludhiana', district: 'Ludhiana', state: 'Punjab', lat: 30.9010, lon: 75.8573, isPopular: true },
  { name: 'Bathinda', district: 'Bathinda', state: 'Punjab', lat: 30.2110, lon: 74.9455 },
  { name: 'Amritsar', district: 'Amritsar', state: 'Punjab', lat: 31.6340, lon: 74.8723 },
  { name: 'Karnal', district: 'Karnal', state: 'Haryana', lat: 29.6857, lon: 76.9905, isPopular: true },
  { name: 'Sirsa', district: 'Sirsa', state: 'Haryana', lat: 29.5349, lon: 75.0290 },
  { name: 'Hisar', district: 'Hisar', state: 'Haryana', lat: 29.1492, lon: 75.7217 },

  // Gujarat
  { name: 'Rajkot', district: 'Rajkot', state: 'Gujarat', lat: 22.3039, lon: 70.8022, isPopular: true },
  { name: 'Unjha', district: 'Mehsana', state: 'Gujarat', lat: 23.8039, lon: 72.3917, isPopular: true },
  { name: 'Gondal', district: 'Rajkot', state: 'Gujarat', lat: 21.9619, lon: 70.7997 },
  { name: 'Surat', district: 'Surat', state: 'Gujarat', lat: 21.1702, lon: 72.8311 },
  { name: 'Ahmedabad', district: 'Ahmedabad', state: 'Gujarat', lat: 23.0225, lon: 72.5714 },
  { name: 'Junagadh', district: 'Junagadh', state: 'Gujarat', lat: 21.5222, lon: 70.4579 },

  // Rajasthan
  { name: 'Jaipur', district: 'Jaipur', state: 'Rajasthan', lat: 26.9124, lon: 75.7873, isPopular: true },
  { name: 'Kota', district: 'Kota', state: 'Rajasthan', lat: 25.2138, lon: 75.8648, isPopular: true },
  { name: 'Sri Ganganagar', district: 'Sri Ganganagar', state: 'Rajasthan', lat: 29.9038, lon: 73.8772 },
  { name: 'Jodhpur', district: 'Jodhpur', state: 'Rajasthan', lat: 26.2389, lon: 73.0243 },
  { name: 'Bikaner', district: 'Bikaner', state: 'Rajasthan', lat: 28.0229, lon: 73.3119 },

  // Uttar Pradesh
  { name: 'Lucknow', district: 'Lucknow', state: 'Uttar Pradesh', lat: 26.8467, lon: 80.9462, isPopular: true },
  { name: 'Kanpur', district: 'Kanpur Nagar', state: 'Uttar Pradesh', lat: 26.4499, lon: 80.3319, isPopular: true },
  { name: 'Varanasi', district: 'Varanasi', state: 'Uttar Pradesh', lat: 25.3176, lon: 82.9739 },
  { name: 'Agra', district: 'Agra', state: 'Uttar Pradesh', lat: 27.1767, lon: 78.0081 },
  { name: 'Bareilly', district: 'Bareilly', state: 'Uttar Pradesh', lat: 28.3670, lon: 79.4304 },
  { name: 'Aligarh', district: 'Aligarh', state: 'Uttar Pradesh', lat: 27.8974, lon: 78.0880 },
  { name: 'Meerut', district: 'Meerut', state: 'Uttar Pradesh', lat: 28.9845, lon: 77.7064 },

  // Karnataka
  { name: 'Bengaluru', district: 'Bengaluru', state: 'Karnataka', lat: 12.9716, lon: 77.5946, isPopular: true },
  { name: 'Hubli', district: 'Dharwad', state: 'Karnataka', lat: 15.3647, lon: 75.1240, isPopular: true },
  { name: 'Belagavi', district: 'Belagavi', state: 'Karnataka', lat: 15.8497, lon: 74.4977 },
  { name: 'Davanagere', district: 'Davanagere', state: 'Karnataka', lat: 14.4644, lon: 75.9218 },
  { name: 'Shimoga (Shivamogga)', district: 'Shivamogga', state: 'Karnataka', lat: 13.9299, lon: 75.5681 },
  { name: 'Raichur', district: 'Raichur', state: 'Karnataka', lat: 16.2120, lon: 77.3439 },
  { name: 'Mysuru', district: 'Mysuru', state: 'Karnataka', lat: 12.2958, lon: 76.6394 },

  // Tamil Nadu
  { name: 'Coimbatore', district: 'Coimbatore', state: 'Tamil Nadu', lat: 11.0168, lon: 76.9558, isPopular: true },
  { name: 'Erode', district: 'Erode', state: 'Tamil Nadu', lat: 11.3410, lon: 77.7172, isPopular: true },
  { name: 'Salem', district: 'Salem', state: 'Tamil Nadu', lat: 11.6643, lon: 78.1460 },
  { name: 'Madurai', district: 'Madurai', state: 'Tamil Nadu', lat: 9.9252, lon: 78.1198 },
  { name: 'Thanjavur', district: 'Thanjavur', state: 'Tamil Nadu', lat: 10.7870, lon: 79.1378 },

  // West Bengal & Bihar
  { name: 'Kolkata', district: 'Kolkata', state: 'West Bengal', lat: 22.5726, lon: 88.3639, isPopular: true },
  { name: 'Burdwan (Bardhaman)', district: 'Purba Bardhaman', state: 'West Bengal', lat: 23.2324, lon: 87.8615 },
  { name: 'Siliguri', district: 'Darjeeling', state: 'West Bengal', lat: 26.7271, lon: 88.3953 },
  { name: 'Patna', district: 'Patna', state: 'Bihar', lat: 25.5941, lon: 85.1376, isPopular: true },
  { name: 'Muzaffarpur', district: 'Muzaffarpur', state: 'Bihar', lat: 26.1209, lon: 85.3647 },
  { name: 'Bhagalpur', district: 'Bhagalpur', state: 'Bihar', lat: 25.2425, lon: 86.9842 },

  // Odisha & Kerala
  { name: 'Bhubaneswar', district: 'Khordha', state: 'Odisha', lat: 20.2961, lon: 85.8245, isPopular: true },
  { name: 'Sambalpur', district: 'Sambalpur', state: 'Odisha', lat: 21.4669, lon: 83.9812 },
  { name: 'Kochi', district: 'Ernakulam', state: 'Kerala', lat: 9.9312, lon: 76.2673 },
  { name: 'Palakkad', district: 'Palakkad', state: 'Kerala', lat: 10.7867, lon: 76.6548 }
];

export function calculateDistanceKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Earth radius in km
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c);
}

export function searchIndianLocations(query: string): IndianLocation[] {
  if (!query || query.trim() === '') {
    return ALL_INDIA_LOCATIONS.filter(l => l.isPopular);
  }
  const q = query.toLowerCase().trim();
  return ALL_INDIA_LOCATIONS.filter(l =>
    l.name.toLowerCase().includes(q) ||
    l.district.toLowerCase().includes(q) ||
    l.state.toLowerCase().includes(q)
  );
}

// Automatic Location Detection Pipeline (IP Auto + GPS High Precision)
export async function detectAutoLocation(): Promise<IndianLocation> {
  // Step 1: Try GPS first with a short timeout
  if (typeof navigator !== 'undefined' && navigator.geolocation) {
    try {
      const pos = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          timeout: 4000,
          maximumAge: 60000,
          enableHighAccuracy: true
        });
      });

      const { latitude, longitude } = pos.coords;

      // Reverse geocode via BigDataCloud client API
      try {
        const revRes = await fetch(
          `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
        );
        if (revRes.ok) {
          const revData = await revRes.json();
          const cityName = revData.locality || revData.city || 'My Location';
          const stateName = revData.principalSubdivision || 'India';
          return {
            name: cityName,
            district: revData.locality || cityName,
            state: stateName,
            lat: latitude,
            lon: longitude
          };
        }
      } catch {
        // Fallback to coordinates
      }

      return {
        name: 'Detected GPS Location',
        district: 'Local Field',
        state: 'India',
        lat: latitude,
        lon: longitude
      };
    } catch {
      // GPS permission denied, timed out, or not allowed -> fallback to IP
    }
  }

  // Step 2: Fallback to fast IP Geolocation (Zero permission needed, works across India)
  try {
    const ipRes = await fetch('https://ipwho.is/');
    if (ipRes.ok) {
      const ipData = await ipRes.json();
      if (ipData && ipData.success !== false) {
        return {
          name: ipData.city || 'India',
          district: ipData.city || 'Central',
          state: ipData.region || 'India',
          lat: ipData.latitude || 20.5937,
          lon: ipData.longitude || 78.9629
        };
      }
    }
  } catch (err) {
    console.warn('IP geolocator error:', err);
  }

  // Step 3: Default to Warangal, Telangana (Central Agricultural hub)
  return ALL_INDIA_LOCATIONS[0];
}
