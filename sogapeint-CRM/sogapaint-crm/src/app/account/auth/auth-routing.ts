// import { NgModule } from '@angular/core';
// import { Routes, RouterModule } from '@angular/router';

// // Importation des composants utilisés dans les routes d'authentification
// import { LoginComponent } from './login/login.component';
// import { SignupComponent } from './signup/signup.component';
// import { PasswordresetComponent } from './passwordreset/passwordreset.component';

// /**
//  * Routes for authentication-related actions.
//  *
//  * Définit les routes pour les actions liées à l'authentification, telles que
//  * la connexion, l'inscription et la réinitialisation du mot de passe.
//  */
// const routes: Routes = [
//     {
//         // Route pour la page de connexion
//         path: 'login',
//         component: LoginComponent
//     },
//     {
//         // Route pour la page d'inscription
//         path: 'signup',
//         component: SignupComponent
//     },
//     {
//         // Route pour la page de réinitialisation du mot de passe
//         path: 'reset-password',
//         component: PasswordresetComponent
//     },
// ];

// /**
//  * Module de routage pour les fonctionnalités d'authentification.
//  *
//  * Importe et exporte les fonctionnalités de routage de RouterModule pour gérer
//  * les routes spécifiques à l'authentification, telles que la connexion, l'inscription
//  * et la réinitialisation du mot de passe. Ce module est utilisé pour isoler
//  * les routes d'authentification du routage principal de l'application.
//  */
// @NgModule({
//     // Importation des routes définies ci-dessus
//     imports: [RouterModule.forChild(routes)],
//     // Exportation du RouterModule pour une utilisation dans d'autres parties de l'application
//     exports: [RouterModule]
// })
// export class AuthRoutingModule { }
