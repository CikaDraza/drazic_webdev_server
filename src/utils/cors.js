// utils/cors.js
function setCorsHeaders(request) {
  const origin = request.headers.get('Origin');
  const allowedOrigins = ['http://localhost:5173', 'https://drazic-webdev.dev'];
  const headers = new Headers({
    'Access-Control-Allow-Origin': allowedOrigins.includes(origin) ? origin : 'null',
    'Access-Control-Allow-Methods': 'POST, GET, OPTIONS, DELETE, PUT',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  });
  if (request.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers
    });
  }
  return headers;
}

export default setCorsHeaders;
