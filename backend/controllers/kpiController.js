/**
 * Collection : OrderForms
 * 
 * Champs :
 * - _id : ObjectId - Identifiant unique pour le formulaire de commande.
 * - file : Array - Contient les pièces jointes liées à la commande (vide s'il n'y a pas de fichiers).
 * - trash : Boolean - Indique si la commande est marquée comme corbeille.
 * - date_cde : Date - Date de la commande (null si non disponible).
 * - customer : ObjectId - Référence au client ayant passé la commande.
 * - occupied : Boolean - Indique si la commande est actuellement active ou occupée.
 * - internal_number : String - Un numéro de référence interne pour la commande.
 * - contact : ObjectId - Référence à la personne de contact pour la commande.
 * - benefit : String - Description du service ou avantage fourni.
 * - status : String - Statut actuel de la commande (par exemple, "en cours").
 * - external_contributor : ObjectId - Référence à un contributeur externe le cas échéant.
 * - observation : Array - Observations ou notes liées à la commande (vide s'il n'y en a pas).
 * - incident : Array - Enregistrements de tout incident lié à la commande.
 * - dateUpd : Date - Dernière mise à jour de la commande.
 * - dateAdd : Date - Horodatage de création de la commande.
 * - __v : Number - Version du document dans la base de données.
 * - address : String - Adresse liée à la commande.
 * - appartment_number : String - Numéro d'appartement (le cas échéant).
 * - quote_number : String - Numéro de référence pour le devis.
 * - mail_sended : Boolean - Indique si un courriel a été envoyé concernant la commande.
 * - invoice_number : String - Numéro de facture lié à la commande.
 * - amount_ht : Number - Montant (hors taxes) lié à la commande.
 * - benefit_ht : Number - Montant de l'avantage (hors taxes).
 * - execution_data_day : Number - Temps d'exécution en jours.
 * - execution_data_hour : Number - Temps d'exécution en heures.
 * - external_contributor_invoice_date : Date - Date de facture du contributeur externe (null si non disponible).
 * - internal_contributor : String - Référence à un contributeur interne le cas échéant.
 * - start_date_works : Date - Date de début des travaux (null si non disponible).
 * - end_date_works : Date - Date de fin des travaux (null si non disponible).
 * - end_date_customer : Date - Date à laquelle la commande doit être terminée pour le client.
 * - billing_number : String - Numéro de facturation associé à la commande.
 * - billing_amount : Number - Montant facturé pour la commande (null si non applicable).
 * - situation_number : Number - Un numéro indiquant la situation ou l'état de la commande.
 * 
 */

/**
 * KPI Controller Functions
 * 
 * Ce fichier contient une série de fonctions destinées à calculer et retourner différents indicateurs clés de performance (KPI) pour les commandes. Ces fonctions fournissent les données nécessaires pour les endpoints de l'API, permettant une analyse détaillée des performances de l'entreprise.
 * 
 * Fonctions Implémentées :
 * 
 * 1. getTotalOrders - Retourne le nombre total de commandes.
 * 2. getOrdersByDate - Calcule le nombre de commandes sur une période spécifique.
 * 3. getActiveOrders - Compte le nombre de commandes actives.
 * 4. getActiveOrdersByDate - Nombre de commandes actives sur une période donnée.
 * 5. getInactiveOrders - Détermine le nombre de commandes inactives.
 * 6. getInactiveOrdersByDate - Nombre de commandes inactives sur une période spécifique.
 * 7. getCompletedOrders - Calcule le nombre de commandes complétées.
 * 8. getCompletedOrdersByDate - Nombre de commandes complétées sur une période donnée.
 * 9. getAverageExecutionTime - Moyenne du temps d'exécution des commandes sur une période spécifique.
 * 10. getTotalRevenue - Revenu total généré par les commandes dans une période donnée.
 * 11. getAverageRevenue - Revenu moyen par commande sur une période spécifique.
 * 12. getOrdersByService - Nombre de commandes par service.
 * 13. getOrdersByServiceByDate - Commandes par service sur une période donnée.
 * 14. getOrdersWithIncidents - Compte le nombre de commandes avec incidents dans une période donnée.
 * 15. getMailResponseRate - Taux de réponse aux mails pour les commandes sur une période spécifique.
 * 16. getContributorsEfficiency - Évalue l'efficacité des contributeurs externes vs internes.
 * 17. getOccupationRate - Calcule le pourcentage de commandes marquées comme occupées.
 * 18. getAverageBillingAmount - Montant moyen des factures sur une période donnée.
 * 19. getAverageExternalContributorPaymentDelay - Délai moyen de paiement pour les contributeurs externes.
 * 20. getOrdersStatusDistribution - Distribution des statuts des commandes pour identifier les goulots d'étranglement.
 * 21. getCustomerRenewalRate - Taux de renouvellement des clients, indiquant la fidélité clientèle.
 * 
 */


const ContractModel = require('../models/Contract');
const mongoose = require('mongoose');

// Fonction pour calculer le nombre total de commandes
exports.getTotalOrders = async (req, res, next) => {
  try {
    const totalOrders = await ContractModel.countDocuments();
    res.status(200).json({ totalOrders });
  } catch (error) {
    next(error);
  }
};

// Fonction pour calculer le nombre total de commandes sur une période donnée
/**
 * la requête doit contenir un objet JSON avec les clés suivantes :
 * - startDate : Date de début de la période pour laquelle les commandes doivent être comptées.
 * - endDate : Date de fin de la période pour laquelle les commandes doivent être comptées.
 */
exports.getOrdersByDate = async (req, res, next) => {
  try {
    const { startDate, endDate } = req.query;
    const ordersByDate = await ContractModel.countDocuments({
      date_cde: {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      }
    });
    res.status(200).json({ ordersByDate });
  } catch (error) {
    next(error);
  }
};

// Fonction pour calculer le nombre de commandes actives
exports.getActiveOrders = async (req, res, next) => {
  try {
    const activeOrders = await ContractModel.countDocuments({ occupied: true });
    res.status(200).json({ activeOrders });
  } catch (error) {
    next(error);
  }
};

// Fonction pour calculer le nombre de commandes actives sur une période donnée
/**
 * La requête doit contenir un objet JSON avec les clés suivantes :
 * - startDate : Date de début de la période pour laquelle les commandes actives doivent être comptées.
 * - endDate : Date de fin de la période pour laquelle les commandes actives doivent être comptées.
 */
exports.getActiveOrdersByDate = async (req, res, next) => {
  try {
    const { startDate, endDate } = req.query;
    const activeOrdersByDate = await ContractModel.countDocuments({
      date_cde: {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      },
      occupied: true
    });
    res.status(200).json({ activeOrdersByDate });
  } catch (error) {
    next(error);
  }
};

// Fonction pour calculer le nombre de commandes inactives
exports.getInactiveOrders = async (req, res, next) => {
  try {
    const inactiveOrders = await ContractModel.countDocuments({ occupied: false });
    res.status(200).json({ inactiveOrders });
  } catch (error) {
    next(error);
  }
};

// Fonction pour calculer le nombre de commandes inactives sur une période donnée
/**
 * la requête doit contenir un objet JSON avec les clés suivantes :
 * - startDate : Date de début de la période pour laquelle les commandes inactives doivent être comptées.
 * - endDate : Date de fin de la période pour laquelle les commandes inactives doivent être comptées.
 */
exports.getInactiveOrdersByDate = async (req, res, next) => {
  try {
    const { startDate, endDate } = req.query;
    const inactiveOrdersByDate = await ContractModel.countDocuments({
      date_cde: {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      },
      occupied: false
    });
    res.status(200).json({ inactiveOrdersByDate });
  } catch (error) {
    next(error);
  }
};

// Fonction pour calculer le taux de commandes finalisées
exports.getCompletedOrders = async (req, res, next) => {
  try {
    const completedOrders = await ContractModel.countDocuments({ status: 'achieve' });
    res.status(200).json({ completedOrders });
  } catch (error) {
    next(error);
  }
};

// Fonction pour calculer le taux de commandes finalisées sur une période donnée
/**
 * la requête doit contenir un objet JSON avec les clés suivantes :
 * - startDate : Date de début de la période pour laquelle les commandes finalisées doivent être comptées.
 * - endDate : Date de fin de la période pour laquelle les commandes finalisées doivent être comptées.
 */
exports.getCompletedOrdersByDate = async (req, res, next) => {
  try {
    const { startDate, endDate } = req.query;
    const completedOrdersByDate = await ContractModel.countDocuments({
      date_cde: {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      },
      status: 'achieve'
    });
    res.status(200).json({ completedOrdersByDate });
  } catch (error) {
    next(error);
  }
};

// Fonction pour obtenir la durée moyenne d'exécution des commandes sur une période donnée
/**
 * la requête doit contenir un objet JSON avec les clés suivantes :
 * - startDate : Date de début de la période pour laquelle la durée moyenne d'exécution doit être calculée.
 * - endDate : Date de fin de la période pour laquelle la durée moyenne d'exécution doit être calculée.
 */
exports.getAverageExecutionTime = async (req, res, next) => {
  try {
    const { startDate, endDate } = req.query;
    const averageExecutionTime = await ContractModel.aggregate([
      {
        $match: {
          date_cde: {
            $gte: new Date(startDate),
            $lte: new Date(endDate)
          }
        }
      },
      {
        $group: {
          _id: null,
          averageExecutionTime: {
            $avg: {
              $subtract: ['$end_date_works', '$start_date_works']
            }
          }
        }
      }
    ]);
    res.status(200).json({ averageExecutionTime });
  } catch (error) {
    next(error);
  }
};

// Fonction pour obtenir le revenu total des commandes sur une période donnée
exports.getTotalRevenue = async (req, res, next) => {
  try {
    const { startDate, endDate } = req.query;
    const totalRevenue = await ContractModel.aggregate([
      {
        $match: {
          date_cde: {
            $gte: new Date(startDate),
            $lte: new Date(endDate)
          }
        }
      },
      {
        $group: {
          _id: null,
          totalRevenue: {
            $sum: '$amount_ht'
          }
        }
      }
    ]);
    res.status(200).json({ totalRevenue });
  } catch (error) {
    next(error);
  }
};

// Fonction pour calculer le revenu moyen par commande sur une période donnée
exports.getAverageRevenue = async (req, res, next) => {
  try {
    const { startDate, endDate } = req.query;
    const averageRevenue = await ContractModel.aggregate([
      {
        $match: {
          date_cde: {
            $gte: new Date(startDate),
            $lte: new Date(endDate)
          }
        }
      },
      {
        $group: {
          _id: null,
          averageRevenue: {
            $avg: '$amount_ht'
          }
        }
      }
    ]);
    res.status(200).json({ averageRevenue });
  } catch (error) {
    next(error);
  }
};

// Fonction pour obtenir le nombre de commandes par service (benefit)
exports.getOrdersByService = async (req, res, next) => {
  try {

    const ordersByService = await ContractModel.aggregate([
      {
        $group: {
          _id: '$benefit',
          count: { $sum: 1 }
        }
      }
    ]);
    // rajoute les noms des services
    const services = await ContractModel.aggregate([
      {
        $group: {
          _id: '$benefit'
        }
      }
    ]);
    // ajoute les nom des services à ordersByService
    for (let i = 0; i < ordersByService.length; i++) {
      for (let j = 0; j < services.length; j++) {
        if (ordersByService[i]._id.toString() === services[j]._id.toString()) {
          ordersByService[i]._id = services[j]._id;
        }
      }
    }
    res.status(200).json({ ordersByService });
  } catch (error) {
    next(error);
  }
};

// Fonction pour obtenir le nombre de commandes par service (benefit) sur une période donnée
exports.getOrdersByServiceByDate = async (req, res, next) => {
  try {
    const { startDate, endDate } = req.query;
    const ordersByServiceByDate = await ContractModel.aggregate([
      {
        $match: {
          date_cde: {
            $gte: new Date(startDate),
            $lte: new Date(endDate)
          }
        }
      },
      {
        $group: {
          _id: '$benefit',
          count: { $sum: 1 }
        }
      }
    ]);
    // rajoute les noms des services
    const services = await ContractModel.aggregate([
      {
        $group: {
          _id: '$benefit'
        }
      }
    ]);
    // ajoute les nom des services à ordersByService
    for (let i = 0; i < ordersByServiceByDate.length; i++) {
      for (let j = 0; j < services.length; j++) {
        if (ordersByServiceByDate[i]._id.toString() === services[j]._id.toString()) {
          ordersByServiceByDate[i]._id = services[j]._id;
        }
      }
    }
    res.status(200).json({ ordersByServiceByDate });
  } catch (error) {
    next(error);
  }
};

// Fonction pour obtenir le Taux de commandes avec incidents sur une période donnée
exports.getOrdersWithIncidents = async (req, res, next) => {
  try {
    const { startDate, endDate } = req.query;
    const ordersWithIncidents = await ContractModel.countDocuments({
      date_cde: {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      },
      incident: { $exists: true, $ne: [] }
    });
    res.status(200).json({ ordersWithIncidents });
  } catch (error) {
    next(error);
  }
};

// Fonction pour obtenir le Taux de réponse aux mails sur une période donnée
exports.getMailResponseRate = async (req, res, next) => {
  try {
    const { startDate, endDate } = req.query;
    const mailResponseRate = await ContractModel.countDocuments({
      date_cde: {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      },
      mail_sended: true
    });
    res.status(200).json({ mailResponseRate });
  } catch (error) {
    next(error);
  }
};

// Fonction pour obtenir l'efficacité des contributeurs externes versus internes : Comparaison des coûts et des temps d'exécution entre les contributeurs externes et internes, basée sur les champs external_contributor, internal_contributor, execution_data_day, execution_data_hour, et amount_ht.
exports.getContributorsEfficiency = async (req, res, next) => {
    try {
        // Agrégation pour les contributeurs externes
        const externalEfficiency = await ContractModel.aggregate([
            {
                $match: { external_contributor: { $exists: true, $ne: '' } }
            },
            {
                $group: {
                    _id: '$external_contributor',
                    totalAmount: { $sum: '$amount_ht' },
                    totalExecutionTime: {
                        $sum: {
                            $add: [
                                { $multiply: ['$execution_data_day', 24] },
                                '$execution_data_hour'
                            ]
                        }
                    }
                }
            },
            {
                $project: {
                    _id: 0,
                    contributor: '$_id',
                    totalAmount: 1,
                    totalExecutionTime: 1,
                    efficiency: { $divide: ['$totalAmount', '$totalExecutionTime'] }
                }
            }
        ]);

        // Agrégation pour les contributeurs internes
        const internalEfficiency = await ContractModel.aggregate([
            {
                $match: { internal_contributor: { $exists: true, $ne: '' } }
            },
            {
                $group: {
                    _id: '$internal_contributor',
                    totalAmount: { $sum: '$amount_ht' },
                    totalExecutionTime: {
                        $sum: {
                            $add: [
                                { $multiply: ['$execution_data_day', 24] },
                                '$execution_data_hour'
                            ]
                        }
                    }
                }
            },
            {
                $project: {
                    _id: 0,
                    contributor: '$_id',
                    totalAmount: 1,
                    totalExecutionTime: 1,
                    efficiency: { $divide: ['$totalAmount', '$totalExecutionTime'] }
                }
            }
        ]);

        res.status(200).json({ externalEfficiency, internalEfficiency });
    } catch (error) {
        next(error);
    }
};

// Fonction pour obtenir le Taux d'occupation : Le pourcentage de commandes marquées comme occupées (occupied), ce qui peut aider à comprendre le taux d'utilisation des ressources ou des équipes.
exports.getOccupationRate = async (req, res, next) => {
    try {
        const totalOrders = await ContractModel.countDocuments();
        const occupiedOrders = await ContractModel.countDocuments({ occupied: true });
        const occupationRate = (occupiedOrders / totalOrders) * 100;
        res.status(200).json({ occupationRate });
    } catch (error) {
        next(error);
    }
};

// Fonction pour obtenir le Montant moyen des factures sur une période donnée : Le montant moyen facturé aux clients, calculé à partir du champ billing_amount pour les commandes facturées.
exports.getAverageBillingAmount = async (req, res, next) => {
    try {
        const { startDate, endDate } = req.query;
        const averageBillingAmount = await ContractModel.aggregate([
            {
                $match: {
                    date_cde: {
                        $gte: new Date(startDate),
                        $lte: new Date(endDate)
                    },
                    billing_amount: { $exists: true }
                }
            },
            {
                $group: {
                    _id: null,
                    averageBillingAmount: { $avg: '$billing_amount' }
                }
            }
        ]);
        res.status(200).json({ averageBillingAmount });
    } catch (error) {
        next(error);
    }
};

// Fonction pour obtenir le Délai moyen de paiement des contributeurs externes : emps moyen entre la date de la commande et la date de facturation des contributeurs externes, basé sur external_contributor_invoice_date.
exports.getAverageExternalContributorPaymentDelay = async (req, res, next) => {
    try {
        const averagePaymentDelay = await ContractModel.aggregate([
            {
                $match: { external_contributor_invoice_date: { $exists: true } }
            },
            {
                $group: {
                    _id: null,
                    averagePaymentDelay: {
                        $avg: {
                            $subtract: ['$external_contributor_invoice_date', '$date_cde']
                        }
                    }
                }
            }
        ]);
        res.status(200).json({ averagePaymentDelay });
    } catch (error) {
        next(error);
    }
};

// Fonction pour obtenir la Distribution du statut des commandes sur une période donnée : Analyse de la répartition des différentes étapes ou statuts des commandes (par exemple, en attente, en cours, terminé), permettant d'identifier les goulots d'étranglement potentiels.
exports.getOrdersStatusDistribution = async (req, res, next) => {
    try {
        const { startDate, endDate } = req.query;
        const statusDistribution = await ContractModel.aggregate([
            {
                $match: {
                    date_cde: {
                        $gte: new Date(startDate),
                        $lte: new Date(endDate)
                    }
                }
            },
            {
                $group: {
                    _id: '$status',
                    count: { $sum: 1 }
                }
            }
        ]);
        // Rajoute les noms des statuts
        const statuses = await ContractModel.aggregate([
            {
                $group: {
                    _id: '$status'
                }
            }
        ]);
        // Ajoute les noms des statuts à statusDistribution
        for (let i = 0; i < statusDistribution.length; i++) {
            for (let j = 0; j < statuses.length; j++) {
                if (statusDistribution[i]._id.toString() === statuses[j]._id.toString()) {
                    statusDistribution[i]._id = statuses[j]._id;
                }
            }
        }
        res.status(200).json({ statusDistribution });
        /**
         * Exemple de réponse :
         * {
         *  "statusDistribution": [
         *     { "_id": "en cours", "count": 15 },
         *    { "_id": "terminé", "count": 10 },
         *   { "_id": "en attente", "count": 5 }
         * ]
         * }
         */
    } catch (error) {
        next(error);
    }
};

// Fonction pour obtenir le Taux de renouvellement des clients sur une période donnée : Le pourcentage de clients répétitifs par rapport au nombre total de clients, ce qui peut indiquer la satisfaction et la fidélité des clients.
exports.getCustomerRenewalRate = async (req, res, next) => {
    try {
        const { startDate, endDate } = req.query;
        const customerRenewalRate = await ContractModel.aggregate([
            {
                $match: {
                    date_cde: {
                        $gte: new Date(startDate),
                        $lte: new Date(endDate)
                    }
                }
            },
            {
                $group: {
                    _id: '$customer',
                    count: { $sum: 1 }
                }
            }
        ]);
        res.status(200).json({ customerRenewalRate });
    } catch (error) {
        next(error);
    }
};

