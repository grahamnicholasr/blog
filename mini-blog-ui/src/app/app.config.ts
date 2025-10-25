import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZonelessChangeDetection, provideCheckNoChangesConfig } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideHttpClient } from '@angular/common/http';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    provideRouter(routes),
    provideHttpClient(),
    provideCheckNoChangesConfig({ exhaustive: true, interval: 1000 })
  ]
};
