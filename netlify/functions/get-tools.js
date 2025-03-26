
exports.handler = async function(event, context) {
  // Adding connection debugging information
  const connectionInfo = {
    message: "If you're seeing this in demo mode, your app is unable to connect to the Azure Function.",
    possibleIssues: [
      "The Azure Function might be offline or unavailable",
      "CORS policy might be blocking access from your domain",
      "Network connectivity issues between client and Azure endpoint"
    ],
    recommendations: [
      "Check if the Azure Function is running and accessible",
      "Verify CORS is properly configured on the Azure Function",
      "Try enabling the CORS proxy option in settings"
    ],
    currentEndpoint: "taxaiagents.azurewebsites.net"
  };

  // Demo data for tools
  const tools = [
    {
      id: 1,
      name: "AI Text Generator",
      description: "Generate human-like text for various purposes",
      category: "content",
      endpoint: "/api/generate-text",
      demoMode: true
    },
    {
      id: 2,
      name: "Image Analyzer",
      description: "Analyze images for objects, faces, and text",
      category: "vision",
      endpoint: "/api/analyze-image",
      demoMode: true
    },
    {
      id: 3,
      name: "Data Extractor",
      description: "Extract structured data from unstructured text",
      category: "data",
      endpoint: "/api/extract-data",
      demoMode: true
    },
    {
      id: 4, 
      name: "Connection Debugger",
      description: "Diagnose connection issues with the Azure Function",
      category: "utility",
      endpoint: "/api/debug-connection",
      demoMode: true,
      connectionInfo: connectionInfo
    }
  ];

  return {
    statusCode: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ tools, connectionInfo })
  };
};
