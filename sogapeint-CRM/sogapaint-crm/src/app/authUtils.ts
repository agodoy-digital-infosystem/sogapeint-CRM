import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';

/**
 * Classe FirebaseAuthBackend.
 *
 * Gère les fonctionnalités d'authentification avec Firebase, y compris l'enregistrement,
 * la connexion, la réinitialisation du mot de passe et la déconnexion.
 */
class FirebaseAuthBackend {
    /**
     * Constructeur de FirebaseAuthBackend.
     * Initialise Firebase avec la configuration fournie.
     * @param firebaseConfig Configuration Firebase.
     */
    constructor(firebaseConfig) {
        if (firebaseConfig) {
            firebase.initializeApp(firebaseConfig);
            firebase.auth().onAuthStateChanged((user) => {
                if (user) {
                    sessionStorage.setItem('authUser', JSON.stringify(user));
                } else {
                    sessionStorage.removeItem('authUser');
                }
            });
        }
    }

    /**
     * Enregistre un nouvel utilisateur avec email et mot de passe.
     * @param email Email de l'utilisateur.
     * @param password Mot de passe de l'utilisateur.
     * @returns Une promesse résolue avec les détails de l'utilisateur.
     */
    registerUser = (email, password) => {
        return new Promise((resolve, reject) => {
            firebase.auth().createUserWithEmailAndPassword(email, password).then((user: any) => {
                var user: any = firebase.auth().currentUser;
                resolve(user);
            }, (error) => {
                reject(this._handleError(error));
            });
        });
    }

    /**
     * Connecte un utilisateur avec email et mot de passe.
     * @param email Email de l'utilisateur.
     * @param password Mot de passe de l'utilisateur.
     * @returns Une promesse résolue avec les détails de l'utilisateur.
     */
    loginUser = (email, password) => {
        return new Promise((resolve, reject) => {
            firebase.auth().signInWithEmailAndPassword(email, password).then((user: any) => {
                var user: any = firebase.auth().currentUser;
                resolve(user);
            }, (error) => {
                reject(this._handleError(error));
            });
        });
    }

    /**
     * Envoie un email de réinitialisation de mot de passe.
     * @param email Email pour lequel réinitialiser le mot de passe.
     * @returns Une promesse résolue sur succès.
     */
    forgetPassword = (email) => {
        return new Promise((resolve, reject) => {
            firebase.auth().sendPasswordResetEmail(email, { url: window.location.protocol + '//' + window.location.host + '/login' }).then(() => {
                resolve(true);
            }).catch((error) => {
                reject(this._handleError(error));
            });
        });
    }

    /**
     * Déconnecte l'utilisateur actuellement connecté.
     * @returns Une promesse résolue sur succès.
     */
    logout = () => {
        return new Promise((resolve, reject) => {
            firebase.auth().signOut().then(() => {
                resolve(true);
            }).catch((error) => {
                reject(this._handleError(error));
            });
        });
    }

    /**
     * Définit l'utilisateur connecté dans le sessionStorage.
     * @param user Utilisateur à stocker dans le sessionStorage.
     */
    setLoggeedInUser = (user) => {
        sessionStorage.setItem('authUser', JSON.stringify(user));
    }

    /**
     * Récupère l'utilisateur authentifié depuis le sessionStorage.
     * @returns L'utilisateur authentifié ou null si aucun utilisateur n'est connecté.
     */
    getAuthenticatedUser = () => {
        if (!sessionStorage.getItem('authUser')) {
            return null;
        }
        return JSON.parse(sessionStorage.getItem('authUser'));
    }

    /**
     * Gère les erreurs Firebase.
     * @param error Erreur Firebase à traiter.
     * @returns Le message d'erreur.
     */
    _handleError(error) {
        var errorMessage = error.message;
        return errorMessage;
    }
}

// Instance unique de FirebaseAuthBackend
let _fireBaseBackend = null;

/**
 * Initialise FirebaseAuthBackend avec la configuration donnée.
 * Assure une instance unique de FirebaseAuthBackend.
 * @param config Configuration Firebase.
 * @returns L'instance de FirebaseAuthBackend.
 */
const initFirebaseBackend = (config) => {
    if (!_fireBaseBackend) {
        _fireBaseBackend = new FirebaseAuthBackend(config);
    }
    return _fireBaseBackend;
};

/**
 * Obtient l'instance actuelle de FirebaseAuthBackend.
 * @returns L'instance de FirebaseAuthBackend.
 */
const getFirebaseBackend = () => {
    return _fireBaseBackend;
};

export { initFirebaseBackend, getFirebaseBackend };
