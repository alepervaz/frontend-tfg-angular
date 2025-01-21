import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { RegisterComponent } from './register/register.component';
import { LoginComponent } from './login/login.component';
import { AuthGuard } from './guard/auth.guard';
import { EditUserComponent } from './user/edit/edit-group.component';
import { GroupComponent } from './group/group.component';
import { CreateGroupComponent } from './group/create-group/create-group.component';
import { ListUserComponent } from './user/list-user/list-user.component';
import { FriendUserComponent } from './user/friend-user/friend-user.component';
import { ListGroupComponent } from './group/list-group/list-group.component';
import { ActivitiesComponent } from './activity/activities/activities.component';
import { CreateActivityComponent } from './activity/create-activity/create-activity.component';
import { BalanceComponent } from './balance/balance.component';
import { ChatComponent } from './chat/chat.component';

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
  { path: 'group/form', component: CreateGroupComponent, canActivate: [AuthGuard] },
  { path: 'group/list', component: ListGroupComponent, canActivate: [AuthGuard] },
  { path: 'user/friends', component: FriendUserComponent, canActivate: [AuthGuard] },
  { path: 'user/list', component: ListUserComponent, canActivate: [AuthGuard] },
  { path: 'activities', component: ActivitiesComponent, canActivate: [AuthGuard] },
  { path: 'create-activity', component: CreateActivityComponent, canActivate: [AuthGuard] },
  { path: 'balance', component: BalanceComponent, canActivate: [AuthGuard] },
  { path: 'chat/:userId', component: ChatComponent, canActivate: [AuthGuard] },
  
  
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule { }