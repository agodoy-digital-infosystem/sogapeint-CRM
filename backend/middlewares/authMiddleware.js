const jwt = require('jsonwebtoken');

const isAdminOrSuperAdmin = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        // Peut-être affiner la gestion des erreurs en fonction de l'erreur spécifique
        console.error("Erreur de vérification du JWT:", err.name);
        return res.status(401).json({ message: `Échec de l'authentification: ${err.message}` });
      }

      console.log('JWT décodé:', decoded);
      if (decoded.role === 'admin' || decoded.role === 'superAdmin') {
        req.user = decoded;
        next();
      } else {
        console.log('Rôle non autorisé:', decoded.role);
        res.status(403).json({ message: "Accès refusé. Vous n'avez pas les autorisations nécessaires." });
      }
    });
  } else {
    console.log('Aucun token fourni dans les en-têtes de la requête');
    res.status(401).json({ message: 'Aucun token fourni.' });
  }
};

module.exports = { isAdminOrSuperAdmin };
