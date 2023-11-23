import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS, HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

// Importation des modules nécessaires pour la traduction internationale
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

// Configuration de l'environnement
import { environment } from '../environments/environment';

// Modules personnalisés pour la structure et les pages de l'application
import { LayoutsModule } from './layouts/layouts.module';
import { PagesModule } from './pages/pages.module';

// Routing principal de l'application
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

// Outils d'authentification et intercepteurs HTTP
import { initFirebaseBackend } from './authUtils';
import { ErrorInterceptor } from './core/helpers/error.interceptor';
import { JwtInterceptor } from './core/helpers/jwt.interceptor';
import { FakeBackendInterceptor } from './core/helpers/fake-backend';

// Initialisation du backend Firebase si configuré
if (environment.defaultauth === 'firebase') {
  initFirebaseBackend(environment.firebaseConfig);
} else {
  // Utilisation d'un backend fictif pour le développement ou les tests
  FakeBackendInterceptor;
}

/**
 * Fonction de création pour le chargeur de traduction.
 *
 * Utilisée par ngx-translate pour charger les fichiers de traduction.
 * @param http HttpClient utilisé pour les requêtes de traduction.
 * @returns Un TranslateHttpLoader configuré.
 */
export function createTranslateLoader(http: HttpClient): any {
  return new TranslateHttpLoader(http, 'assets/i18n/', '.json');
}

/**
 * Module principal de l'application Angular.
 *
 * Configure et déclare les principaux aspects de l'application, y compris les modules,
 * composants, services, et intercepteurs.
 */
@NgModule({
  declarations: [
    AppComponent  // Déclaration du composant racine
  ],
  imports: [
    BrowserModule,  // Fournit les services nécessaires pour lancer l'application dans un navigateur
    HttpClientModule,  // Module pour les requêtes HTTP
    AppRoutingModule,  // Configuration du routage principal
    PagesModule,  // Module pour les pages de l'application
    LayoutsModule,  // Module pour les dispositions/layout de l'application
    FormsModule,  // Module pour les formulaires
    TranslateModule.forRoot({  // Configuration de ngx-translate pour le chargement des traductions
      loader: {
        provide: TranslateLoader,
        useFactory: createTranslateLoader,
        deps: [HttpClient]
      }
    }),
  ],
  providers: [
    // Enregistrement des intercepteurs HTTP pour JWT, erreurs, et backend fictif
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: FakeBackendInterceptor, multi: true },
  ],
  bootstrap: [AppComponent]  // Composant racine à charger au démarrage de l'application
})
export class AppModule { }
