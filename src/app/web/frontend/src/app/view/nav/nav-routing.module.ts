import { NgModule, inject } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NavComponent } from './nav.component';
import { AuthGuard } from 'src/app/core/guards/auth.guard';
import { MsalGuard } from '@azure/msal-angular';
import { isSSO } from '../auth/auth-config';

const routes: Routes = [
  {
    path: '',
    component: NavComponent,
    canActivateChild: isSSO
      ? [MsalGuard]
      : [() => inject(AuthGuard).authGuard()],
    children: [
      {
        path: 'track',
        loadChildren: () =>
          import('./pages/track/track.module').then((m) => m.TrackModule),
      },
      {
        path: 'scadenziario',
        loadChildren: () =>
          import('./pages/scadenziario/scadenziario.module').then((m) => m.ScadenziarioModule),
      },
      {
        path: 'anagrafica',
        loadChildren: () =>
          import('./pages/anagrafica/anagrafica.module').then((m) => m.AnagraficaModule),
      },
      {
        path: 'database',
        loadChildren: () =>
          import('./pages/database/database.module').then((m) => m.DatabaseModule),
      },

      {
        path: 'scm0',
        loadChildren: () =>
          import('./pages/scm0/scm0.module').then(
            (m) => m.Scm0Module
          ),
      },

      {
        path: 'scm1',
        loadChildren: () =>
          import('./pages/scm1/scm1.module').then(
            (m) => m.Scm1Module
          ),
      },

      {
        path: 'scm2',
        loadChildren: () =>
          import('./pages/scm2/scm2.module').then(
            (m) => m.Scm2Module
          ),
      },

      {
        path: 'scm3',
        loadChildren: () =>
          import('./pages/scm3/scm3.module').then(
            (m) => m.Scm3Module
          ),
      },

      {
        path: 'scm4',
        loadChildren: () =>
          import('./pages/scm4/scm4.module').then(
            (m) => m.Scm4Module
          ),
      },

      {
        path: 'scm5',
        loadChildren: () =>
          import('./pages/scm5/scm5.module').then(
            (m) => m.Scm5Module
          ),
      },

      {
        path: 'scm6',
        loadChildren: () =>
          import('./pages/scm6/scm6.module').then(
            (m) => m.Scm6Module
          ),
      },

      {
        path: 'scm8',
        loadChildren: () =>
          import('./pages/scm8/scm8.module').then(
            (m) => m.Scm8Module
          ),
      },

      {
        path: 'scm9',
        loadChildren: () =>
          import('./pages/scm9/scm9.module').then(
            (m) => m.Scm9Module
          ),
      },
      
      {
        path: 'scm10',
        loadChildren: () =>
          import('./pages/scm10/scm10.module').then(
            (m) => m.Scm10Module
          ),
      },

      {
        path: 'scm11',
        loadChildren: () =>
          import('./pages/scm11/scm11.module').then(
            (m) => m.Scm11Module
          ),
      },

      {
        path: 'scm12',
        loadChildren: () =>
          import('./pages/scm12/scm12.module').then(
            (m) => m.Scm12Module
          ),
      },

      {
        path: 'scm14',
        loadChildren: () =>
          import('./pages/scm14/scm14.module').then(
            (m) => m.Scm14Module
          ),
      },

      {
        path: 'scm15',
        loadChildren: () =>
          import('./pages/scm15/scm15.module').then(
            (m) => m.Scm15Module
          ),
      },

      {
        path: 'scm16',
        loadChildren: () =>
          import('./pages/scm16/scm16.module').then(
            (m) => m.Scm16Module
          ),
      },

      {
        path: 'scm17',
        loadChildren: () =>
          import('./pages/scm17/scm17.module').then(
            (m) => m.Scm17Module
          ),
      },
      
      {
        path: 'scm18',
        loadChildren: () =>
          import('./pages/scm18/scm18.module').then(
            (m) => m.Scm18Module
          ),
      },

      {
        path: 'scm27',
        loadChildren: () =>
          import('./pages/scm27/scm27.module').then(
            (m) => m.Scm27Module
          ),
      },

      {
        path: 'scm28',
        loadChildren: () =>
          import('./pages/scm28/scm28.module').then(
            (m) => m.Scm28Module
          ),
      },

      {
        path: 'scm29',
        loadChildren: () =>
          import('./pages/scm29/scm29.module').then(
            (m) => m.Scm29Module
          ),
      },

      {
        path: 'scm30',
        loadChildren: () =>
          import('./pages/scm30/scm30.module').then(
            (m) => m.Scm30Module
          ),
      },

      {
        path: 'scm60',
        loadChildren: () =>
          import('./pages/scm60/scm60.module').then(
            (m) => m.Scm60Module
          ),
      },

      {
        path: 'scm61',
        loadChildren: () =>
          import('./pages/scm61/scm61.module').then(
            (m) => m.Scm61Module
          ),
      },

      {
        path: 'scm98',
        loadChildren: () =>
          import('./pages/scm98/scm98.module').then(
            (m) => m.Scm98Module
          ),
      },

      {
        path: 'scm100',
        loadChildren: () =>
          import('./pages/scm100/scm100.module').then(
            (m) => m.Scm100Module
          ),
      },

      {
        path: 'scm101',
        loadChildren: () =>
          import('./pages/scm101/scm101.module').then(
            (m) => m.Scm101Module
          ),
      },

      {
        path: 'scm102',
        loadChildren: () =>
          import('./pages/scm102/scm102.module').then(
            (m) => m.Scm102Module
          ),
      },

      {
        path: 'scm103',
        loadChildren: () =>
          import('./pages/scm103/scm103.module').then(
            (m) => m.Scm103Module
          ),
      },

      {
        path: 'scm104',
        loadChildren: () =>
          import('./pages/scm104/scm104.module').then(
            (m) => m.Scm104Module
          ),
      },

      {
        path: 'scm106',
        loadChildren: () =>
          import('./pages/scm106/scm106.module').then(
            (m) => m.Scm106Module
          ),
      },

      {
        path: 'scm108',
        loadChildren: () =>
          import('./pages/scm108/scm108.module').then(
            (m) => m.Scm108Module
          ),
      },

      {
        path: 'scm109',
        loadChildren: () =>
          import('./pages/scm109/scm109.module').then(
            (m) => m.Scm109Module
          ),
      },

      {
        path: 'scm111',
        loadChildren: () =>
          import('./pages/scm111/scm111.module').then(
            (m) => m.Scm111Module
          ),
      },

      {
        path: 'scm112',
        loadChildren: () =>
          import('./pages/scm112/scm112.module').then(
            (m) => m.Scm112Module
          ),
      },

      {
        path: 'scm113',
        loadChildren: () =>
          import('./pages/scm113/scm113.module').then(
            (m) => m.Scm113Module
          ),
      },

      {
        path: 'scm114',
        loadChildren: () =>
          import('./pages/scm114/scm114.module').then(
            (m) => m.Scm114Module
          ),
      },

      {
        path: 'scm115',
        loadChildren: () =>
          import('./pages/scm115/scm115.module').then(
            (m) => m.Scm115Module
          ),
      },

      {
        path: 'scm116',
        loadChildren: () =>
          import('./pages/scm116/scm116.module').then(
            (m) => m.Scm116Module
          ),
      },

      {
        path: 'scm117',
        loadChildren: () =>
          import('./pages/scm117/scm117.module').then(
            (m) => m.Scm117Module
          ),
      },

      {
        path: 'scm118',
        loadChildren: () =>
          import('./pages/scm118/scm118.module').then(
            (m) => m.Scm118Module
          ),
      },

      {
        path: 'scm119',
        loadChildren: () =>
          import('./pages/scm119/scm119.module').then(
            (m) => m.Scm119Module
          ),
      },

      {
        path: 'scm120',
        loadChildren: () =>
          import('./pages/scm120/scm120.module').then(
            (m) => m.Scm120Module
          ),
      },

      {
        path: 'scm121',
        loadChildren: () =>
          import('./pages/scm121/scm121.module').then(
            (m) => m.Scm121Module
          ),
      },

      {
        path: 'scm122',
        loadChildren: () =>
          import('./pages/scm122/scm122.module').then(
            (m) => m.Scm122Module
          ),
      },

      {
        path: 'scm171',
        loadChildren: () =>
          import('./pages/scm171/scm171.module').then(
            (m) => m.Scm171Module
          ),
      },

      {
        path: '',
        redirectTo: '/track',
        pathMatch: 'full',
      },
      {
        path: '**',
        redirectTo: '/track',
        pathMatch: 'full',
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class NavRoutingModule {}
