import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { provideCharts, withDefaultRegisterables } from 'ng2-charts';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

if (environment.production) {
  enableProdMode();
}

platformBrowserDynamic().bootstrapModule(AppModule, {
  providers: [provideCharts(withDefaultRegisterables())]
})
  .then(() => {})
  .catch(err => console.error(err));
