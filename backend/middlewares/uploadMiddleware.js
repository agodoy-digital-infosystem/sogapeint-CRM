const path = require('path');
const multer = require('multer');
const fs = require('fs');

// Configuration du stockage de multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadsDir = path.join(__dirname, '../uploads'); 
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true }); // Créer le dossier s'il n'existe pas.
    }
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    // Vous pouvez ajouter des logiques supplémentaires pour le nom de fichier si nécessaire.
    cb(null, Date.now() + '-' + file.originalname);
  }
});

// Initialisez multer avec la configuration de stockage
const upload = multer({ storage: storage });

// Exportez le middleware de multer configuré pour une utilisation dans les routes
module.exports = upload;
