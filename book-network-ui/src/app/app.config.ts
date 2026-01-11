import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import {provideHttpClient, withInterceptors} from '@angular/common/http'
import { provideApiConfiguration } from './services/api-configuration'
import { routes } from './app.routes';
import {httpTokenInterceptor} from './services/interceptor/http-token-interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideHttpClient(),
    provideHttpClient(
      withInterceptors([httpTokenInterceptor])
    ),
    provideApiConfiguration('http://192.168.1.94:8088/api/v1')
  ]
};
