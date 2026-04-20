/**
 * @desc  Basic health check to ensure the server is operational
 * @route GET /api/health
 *
 * Replaces: Express GET /api/health in server.js
 */
export async function GET() {
  return Response.json({
    status: 'ok',
    message: 'DevBill API is running smoothly',
    timestamp: new Date().toISOString(),
  });
}
