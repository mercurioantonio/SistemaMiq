import { NgModule, inject } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';

const routes: Routes = [
  {
    path: '',
    canMatch: [() => inject(AuthGuard).loginGuard()],
    loadChildren: () =>
      import('./view/auth/auth.module').then((m) => m.AuthModule),
  },
  {
    path: '',
    canMatch: [() => inject(AuthGuard).authGuard()],
    loadChildren: () =>
      import('./view/nav/nav.module').then((m) => m.NavModule),
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      useHash: true,
      onSameUrlNavigation: 'reload',
    }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
