
// This is a placeholder file to simulate Azure Functions locally
// In a real Azure Functions app, this would be in the Azure Functions project

module.exports = async function (context, req) {
    context.res = {
        status: 200,
        headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type, Authorization",
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            message: "Azure Function API is alive!",
            timestamp: new Date().toISOString(),
            service: "Azure Functions"
        })
    };
};
