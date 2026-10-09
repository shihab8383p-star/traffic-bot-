exports.handler = async (event, context) => {
  // CORS headers
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Content-Type': 'application/json'
  };

  // Handle OPTIONS request
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: ''
    };
  }

  try {
    // Return proxy info without sensitive data
    const proxies = [
      { host: "198.23.243.226", country: "US", location: "Piscataway" },
      { host: "38.154.185.97", country: "US", location: "Los Angeles" },
      { host: "142.111.67.146", country: "US", location: "New York" },
      { host: "198.46.161.42", country: "US", location: "Chicago" },
      { host: "31.59.20.176", country: "GB", location: "London" },
      { host: "45.38.107.97", country: "GB", location: "Manchester" },
      { host: "84.247.60.125", country: "ES", location: "Madrid" },
      { host: "191.96.254.138", country: "ES", location: "Barcelona" },
      { host: "64.137.96.74", country: "DE", location: "Frankfurt" },
      { host: "31.58.9.4", country: "DE", location: "Berlin" },
      { host: "31.59.20.176", country: "PL", location: "Warsaw" },
      { host: "45.38.107.97", country: "PL", location: "Krakow" },
      { host: "84.247.60.125", country: "JP", location: "Tokyo" },
      { host: "191.96.254.138", country: "JP", location: "Osaka" }
    ];

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(proxies)
    };
    
  } catch (error) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: error.message })
    };
  }
};
