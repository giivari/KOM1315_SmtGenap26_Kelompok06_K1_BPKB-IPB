const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

/**
 * Middleware Otorisasi berbasis RBAC (Role-Based Access Control)
 * Sesuai dengan rancangan protokol AAA pada sistem BPKB IPB.
 */
const authorize = (requiredRole) => {
  return async (req, res, next) => {
    try {
      const user = req.user;

      // Jika user tidak ada (melewati middleware authenticate tetapi gagal)
      if (!user) {
        await logAuthzEvent(req, null, false);
        return res.status(401).json({ error: 'Akses ditolak. Silakan login terlebih dahulu.' });
      }

      // Verifikasi keanggotaan peran (Role Membership Verification)
      if (user.role !== requiredRole) {
        // Akses ditolak (Least Privilege)
        await logAuthzEvent(req, user, false);
        return res.status(403).json({ error: `Akses ditolak. Membutuhkan hak akses: ${requiredRole}.` });
      }

      // Akses diizinkan
      await logAuthzEvent(req, user, true);
      next();
    } catch (error) {
      console.error('Authorization middleware error:', error);
      res.status(500).json({ error: 'Internal server error.' });
    }
  };
};

/**
 * Fungsi helper untuk mencatat kejadian (Accounting/Audit Trail)
 * Menyimpan log ke tabel AuthorizationEvent di database
 */
async function logAuthzEvent(req, user, isAllowed) {
  try {
    await prisma.authorizationEvent.create({
      data: {
        userId: user ? user.id : null,
        route: req.originalUrl,
        method: req.method,
        role: user ? user.role : 'anonymous',
        allowed: isAllowed,
      }
    });
  } catch (err) {
    console.error('Gagal mencatat log otorisasi:', err.message);
  }
}

module.exports = { authorize };