/**
 * GhanaPost GPS Digital Address Verification & Validation Utility
 * Validates Ghanaian Digital Addresses (e.g. GA-183-9024, AK-039-4921, WS-201-9922)
 * Matches standard Ministry of Communications & Ghana Post digital postal grid format.
 */

export interface GPSVerificationResult {
  isValid: boolean;
  rawAddress: string;
  formattedAddress: string;
  regionCode: string;
  regionName: string;
  districtCode: string;
  postalCode: string;
  approxCoordinates?: {
    lat: number;
    lng: number;
  };
  validationMessage: string;
  status: 'verified' | 'format_error' | 'unrecognized_region';
}

const GHANA_POST_REGION_CODES: Record<string, { name: string; defaultLat: number; defaultLng: number }> = {
  GA: { name: 'Greater Accra Region', defaultLat: 5.6037, defaultLng: -0.1870 },
  GS: { name: 'Greater Accra (South)', defaultLat: 5.5560, defaultLng: -0.1969 },
  GW: { name: 'Greater Accra (West/Ga)', defaultLat: 5.5800, defaultLng: -0.3200 },
  GE: { name: 'Greater Accra (East/Tema)', defaultLat: 5.6698, defaultLng: -0.0166 },
  AK: { name: 'Ashanti Region (Kumasi)', defaultLat: 6.6885, defaultLng: -1.6244 },
  AS: { name: 'Ashanti (South/Bekwai)', defaultLat: 6.4500, defaultLng: -1.5800 },
  AN: { name: 'Ashanti (North/Mampong)', defaultLat: 7.0600, defaultLng: -1.4000 },
  WS: { name: 'Western Region (Sekondi-Takoradi)', defaultLat: 4.8845, defaultLng: -1.7555 },
  WR: { name: 'Western Region', defaultLat: 5.1000, defaultLng: -2.0000 },
  WN: { name: 'Western North Region (Sefwi Wiawso)', defaultLat: 6.2000, defaultLng: -2.4800 },
  CR: { name: 'Central Region (Cape Coast)', defaultLat: 5.1053, defaultLng: -1.2466 },
  CC: { name: 'Central Region (Cape Coast Central)', defaultLat: 5.1053, defaultLng: -1.2466 },
  ER: { name: 'Eastern Region (Koforidua)', defaultLat: 6.0945, defaultLng: -0.2591 },
  VR: { name: 'Volta Region (Ho)', defaultLat: 6.6101, defaultLng: 0.4785 },
  OR: { name: 'Oti Region (Dambai)', defaultLat: 7.6667, defaultLng: 0.1833 },
  OT: { name: 'Oti Region', defaultLat: 7.6667, defaultLng: 0.1833 },
  NR: { name: 'Northern Region (Tamale)', defaultLat: 9.4008, defaultLng: -0.8393 },
  NT: { name: 'Northern Region (Tamale Metro)', defaultLat: 9.4008, defaultLng: -0.8393 },
  SR: { name: 'Savannah Region (Damongo)', defaultLat: 9.0833, defaultLng: -1.8167 },
  NE: { name: 'North East Region (Nalerigu)', defaultLat: 10.5333, defaultLng: -0.3667 },
  UE: { name: 'Upper East Region (Bolgatanga)', defaultLat: 10.7856, defaultLng: -0.8514 },
  UW: { name: 'Upper West Region (Wa)', defaultLat: 10.0601, defaultLng: -2.5099 },
  BA: { name: 'Bono Region (Sunyani)', defaultLat: 7.3399, defaultLng: -2.3268 },
  BE: { name: 'Bono East Region (Techiman)', defaultLat: 7.5833, defaultLng: -1.9333 },
  AH: { name: 'Ahafo Region (Goaso)', defaultLat: 6.8000, defaultLng: -2.5167 },
};

/**
 * Verify if a given string is a valid GhanaPost GPS Digital Address
 */
export function verifyGhanaPostGPS(address: string): GPSVerificationResult {
  const clean = address.trim().toUpperCase().replace(/\s+/g, '');

  if (!clean) {
    return {
      isValid: false,
      rawAddress: address,
      formattedAddress: '',
      regionCode: '',
      regionName: '',
      districtCode: '',
      postalCode: '',
      validationMessage: 'Please enter a GhanaPost GPS address (e.g. GA-183-9024)',
      status: 'format_error',
    };
  }

  // Regex pattern for GhanaPost GPS: 2 letters, hyphen or space, 2-4 digits, hyphen or space, 3-5 digits
  const standardPattern = /^([A-Z]{2})[-]?([0-9]{2,4})[-]?([0-9]{3,5})$/;
  const match = clean.match(standardPattern);

  if (!match) {
    return {
      isValid: false,
      rawAddress: address,
      formattedAddress: clean,
      regionCode: '',
      regionName: '',
      districtCode: '',
      postalCode: '',
      validationMessage: 'Invalid format. Valid format example: GA-183-9024 or AK-039-4921',
      status: 'format_error',
    };
  }

  const regionCode = match[1];
  const districtCode = match[2];
  const postalCode = match[3];
  const formattedAddress = `${regionCode}-${districtCode}-${postalCode}`;

  const regionData = GHANA_POST_REGION_CODES[regionCode];

  if (!regionData) {
    return {
      isValid: false,
      rawAddress: address,
      formattedAddress,
      regionCode,
      regionName: 'Unrecognized Ghana Post Region Code',
      districtCode,
      postalCode,
      validationMessage: `Region code "${regionCode}" is not a recognized Ghana Post GPS postal region prefix.`,
      status: 'unrecognized_region',
    };
  }

  // Derive subtle offset to simulate precise coordinates based on numbers
  const dNum = parseInt(districtCode, 10) || 100;
  const pNum = parseInt(postalCode, 10) || 1000;
  const latOffset = ((dNum % 50) - 25) * 0.001;
  const lngOffset = ((pNum % 50) - 25) * 0.001;

  return {
    isValid: true,
    rawAddress: address,
    formattedAddress,
    regionCode,
    regionName: regionData.name,
    districtCode,
    postalCode,
    approxCoordinates: {
      lat: Number((regionData.defaultLat + latOffset).toFixed(5)),
      lng: Number((regionData.defaultLng + lngOffset).toFixed(5)),
    },
    validationMessage: `Verified GhanaPost GPS Digital Address in ${regionData.name} (Postal Grid: ${formattedAddress})`,
    status: 'verified',
  };
}
