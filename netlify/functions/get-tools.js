
exports.handler = async function(event, context) {
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
    body: JSON.stringify({ tools })
  };
};
