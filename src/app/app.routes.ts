import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { RegisterComponent } from './register/register.component';
import { LoginComponent } from './login/login.component';
import { AuthGuard } from './guard/auth.guard';
import { EditUserComponent } from './user/edit/edit-group.component';
import { GroupComponent } from './group/group.component';
import { CreateGroupComponent } from './group/create-group/create-group.component';

export const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./tabs/tabs.routes').then((m) => m.routes),
    canActivate:[AuthGuard]
  },
  
  { path: 'register', component: RegisterComponent},
  { path: 'login', component: LoginComponent },
  { path: 'edit', component: EditUserComponent, canActivate: [AuthGuard] },
  { path: 'group', component: GroupComponent, canActivate: [AuthGuard] },
  { path: 'group/create', component: CreateGroupComponent, canActivate: [AuthGuard] },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule { }