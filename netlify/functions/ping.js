
exports.handler = async function(event, context) {
  return {
    statusCode: 200,
    headers: {
      "Access-Control-Allow-Origin": "*", // Allow requests from any origin
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      message: "API is alive!",
      timestamp: new Date().toISOString()
    })
  };
};
