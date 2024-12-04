import type { APIRoute } from 'astro';

export const GET: APIRoute = async () => {
  return new Response(
    JSON.stringify({
      data: [
        {
          timestamp: new Date().toISOString(),
          soilMoisture: 35,
          precipitation: 2.5,
          temperature: 25,
          droughtIndex: 0.4
        },
        {
          timestamp: new Date(Date.now() - 86400000).toISOString(),
          soilMoisture: 38,
          precipitation: 1.8,
          temperature: 24,
          droughtIndex: 0.35
        },
        {
          timestamp: new Date(Date.now() - 172800000).toISOString(),
          soilMoisture: 40,
          precipitation: 0.5,
          temperature: 26,
          droughtIndex: 0.3
        }
      ]
    }),
    {
      status: 200,
      headers: {
        'Content-Type': 'application/json'
      }
    }
  );
};
