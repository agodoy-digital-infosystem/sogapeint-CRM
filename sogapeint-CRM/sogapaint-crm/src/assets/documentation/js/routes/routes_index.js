var ROUTES_INDEX = {"name":"<root>","kind":"module","className":"AppModule","children":[{"name":"routes","filename":"src/app/app-routing.module.ts","module":"AppRoutingModule","children":[{"path":"account","loadChildren":"./account/account.module#AccountModule","children":[{"kind":"module","children":[{"name":"routes","filename":"src/app/account/account-routing.module.ts","module":"AccountRoutingModule","children":[{"path":"auth","loadChildren":"./auth/auth.module#AuthModule"}],"kind":"module"}],"module":"AccountModule"}]},{"path":"","component":"LayoutComponent","loadChildren":"./pages/pages.module#PagesModule","canActivate":["AuthGuard"]}],"kind":"module"}]}
