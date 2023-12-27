'use strict';

customElements.define('compodoc-menu', class extends HTMLElement {
    constructor() {
        super();
        this.isNormalMode = this.getAttribute('mode') === 'normal';
    }

    connectedCallback() {
        this.render(this.isNormalMode);
    }

    render(isNormalMode) {
        let tp = lithtml.html(`
        <nav>
            <ul class="list">
                <li class="title">
                    <a href="index.html" data-type="index-link">sogapaint-crm documentation</a>
                </li>

                <li class="divider"></li>
                ${ isNormalMode ? `<div id="book-search-input" role="search"><input type="text" placeholder="Type to search"></div>` : '' }
                <li class="chapter">
                    <a data-type="chapter-link" href="index.html"><span class="icon ion-ios-home"></span>Getting started</a>
                    <ul class="links">
                        <li class="link">
                            <a href="overview.html" data-type="chapter-link">
                                <span class="icon ion-ios-keypad"></span>Overview
                            </a>
                        </li>
                        <li class="link">
                            <a href="index.html" data-type="chapter-link">
                                <span class="icon ion-ios-paper"></span>README
                            </a>
                        </li>
                                <li class="link">
                                    <a href="dependencies.html" data-type="chapter-link">
                                        <span class="icon ion-ios-list"></span>Dependencies
                                    </a>
                                </li>
                                <li class="link">
                                    <a href="properties.html" data-type="chapter-link">
                                        <span class="icon ion-ios-apps"></span>Properties
                                    </a>
                                </li>
                    </ul>
                </li>
                    <li class="chapter modules">
                        <a data-type="chapter-link" href="modules.html">
                            <div class="menu-toggler linked" data-bs-toggle="collapse" ${ isNormalMode ?
                                'data-bs-target="#modules-links"' : 'data-bs-target="#xs-modules-links"' }>
                                <span class="icon ion-ios-archive"></span>
                                <span class="link-name">Modules</span>
                                <span class="icon ion-ios-arrow-down"></span>
                            </div>
                        </a>
                        <ul class="links collapse " ${ isNormalMode ? 'id="modules-links"' : 'id="xs-modules-links"' }>
                            <li class="link">
                                <a href="modules/AccountModule.html" data-type="entity-link" >AccountModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/AccountRoutingModule.html" data-type="entity-link" >AccountRoutingModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/AppModule.html" data-type="entity-link" >AppModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                            'data-bs-target="#components-links-module-AppModule-727dff32a5a8488ec69f32cfe04c52f4ab05145786a99703d29e21c300d6d638224f02fda189e48c454fe1a6d39bc6a5700ef5078a44f1857041847b2fb7f978"' : 'data-bs-target="#xs-components-links-module-AppModule-727dff32a5a8488ec69f32cfe04c52f4ab05145786a99703d29e21c300d6d638224f02fda189e48c454fe1a6d39bc6a5700ef5078a44f1857041847b2fb7f978"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-AppModule-727dff32a5a8488ec69f32cfe04c52f4ab05145786a99703d29e21c300d6d638224f02fda189e48c454fe1a6d39bc6a5700ef5078a44f1857041847b2fb7f978"' :
                                            'id="xs-components-links-module-AppModule-727dff32a5a8488ec69f32cfe04c52f4ab05145786a99703d29e21c300d6d638224f02fda189e48c454fe1a6d39bc6a5700ef5078a44f1857041847b2fb7f978"' }>
                                            <li class="link">
                                                <a href="components/AppComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >AppComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/ProtectedDocumentationComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ProtectedDocumentationComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                        'data-bs-target="#injectables-links-module-AppModule-727dff32a5a8488ec69f32cfe04c52f4ab05145786a99703d29e21c300d6d638224f02fda189e48c454fe1a6d39bc6a5700ef5078a44f1857041847b2fb7f978"' : 'data-bs-target="#xs-injectables-links-module-AppModule-727dff32a5a8488ec69f32cfe04c52f4ab05145786a99703d29e21c300d6d638224f02fda189e48c454fe1a6d39bc6a5700ef5078a44f1857041847b2fb7f978"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-AppModule-727dff32a5a8488ec69f32cfe04c52f4ab05145786a99703d29e21c300d6d638224f02fda189e48c454fe1a6d39bc6a5700ef5078a44f1857041847b2fb7f978"' :
                                        'id="xs-injectables-links-module-AppModule-727dff32a5a8488ec69f32cfe04c52f4ab05145786a99703d29e21c300d6d638224f02fda189e48c454fe1a6d39bc6a5700ef5078a44f1857041847b2fb7f978"' }>
                                        <li class="link">
                                            <a href="injectables/AuthenticationService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >AuthenticationService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/AppRoutingModule.html" data-type="entity-link" >AppRoutingModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/AuthModule.html" data-type="entity-link" >AuthModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                            'data-bs-target="#components-links-module-AuthModule-818b51c757ae606af08a69f703f7ffafdd93b619b9423c64bf06cab5ba3b366770289e198b50dd9fdc66439c304a5573cf33c5f3642fd352c6b7d3e91b5c766f"' : 'data-bs-target="#xs-components-links-module-AuthModule-818b51c757ae606af08a69f703f7ffafdd93b619b9423c64bf06cab5ba3b366770289e198b50dd9fdc66439c304a5573cf33c5f3642fd352c6b7d3e91b5c766f"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-AuthModule-818b51c757ae606af08a69f703f7ffafdd93b619b9423c64bf06cab5ba3b366770289e198b50dd9fdc66439c304a5573cf33c5f3642fd352c6b7d3e91b5c766f"' :
                                            'id="xs-components-links-module-AuthModule-818b51c757ae606af08a69f703f7ffafdd93b619b9423c64bf06cab5ba3b366770289e198b50dd9fdc66439c304a5573cf33c5f3642fd352c6b7d3e91b5c766f"' }>
                                            <li class="link">
                                                <a href="components/LoginComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >LoginComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/PasswordresetComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >PasswordresetComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/SignupComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >SignupComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/AuthRoutingModule.html" data-type="entity-link" >AuthRoutingModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/IconsModule.html" data-type="entity-link" >IconsModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                            'data-bs-target="#components-links-module-IconsModule-eb8085ade6f4b4bb3ebd7ce09616e94cfb1b4ad4deeb161c4f9191e93206f27c0fb69952935669fbe04115496b72183b6a0fda44869f3f5988260b9ffef048ea"' : 'data-bs-target="#xs-components-links-module-IconsModule-eb8085ade6f4b4bb3ebd7ce09616e94cfb1b4ad4deeb161c4f9191e93206f27c0fb69952935669fbe04115496b72183b6a0fda44869f3f5988260b9ffef048ea"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-IconsModule-eb8085ade6f4b4bb3ebd7ce09616e94cfb1b4ad4deeb161c4f9191e93206f27c0fb69952935669fbe04115496b72183b6a0fda44869f3f5988260b9ffef048ea"' :
                                            'id="xs-components-links-module-IconsModule-eb8085ade6f4b4bb3ebd7ce09616e94cfb1b4ad4deeb161c4f9191e93206f27c0fb69952935669fbe04115496b72183b6a0fda44869f3f5988260b9ffef048ea"' }>
                                            <li class="link">
                                                <a href="components/DripiconsComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >DripiconsComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/FontawesomeComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >FontawesomeComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/MaterialdesignComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >MaterialdesignComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/RemixComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >RemixComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/IconsRoutingModule.html" data-type="entity-link" >IconsRoutingModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/LayoutsModule.html" data-type="entity-link" >LayoutsModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                            'data-bs-target="#components-links-module-LayoutsModule-b264c161900d0968cc11e36ea6ca308f798585498947ed80e8d70734eebdcd497396dadade15d21e0aac24bf4de234cd85975d16a7f025fc3061d55732f785a4"' : 'data-bs-target="#xs-components-links-module-LayoutsModule-b264c161900d0968cc11e36ea6ca308f798585498947ed80e8d70734eebdcd497396dadade15d21e0aac24bf4de234cd85975d16a7f025fc3061d55732f785a4"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-LayoutsModule-b264c161900d0968cc11e36ea6ca308f798585498947ed80e8d70734eebdcd497396dadade15d21e0aac24bf4de234cd85975d16a7f025fc3061d55732f785a4"' :
                                            'id="xs-components-links-module-LayoutsModule-b264c161900d0968cc11e36ea6ca308f798585498947ed80e8d70734eebdcd497396dadade15d21e0aac24bf4de234cd85975d16a7f025fc3061d55732f785a4"' }>
                                            <li class="link">
                                                <a href="components/HorizontalComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >HorizontalComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/LayoutComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >LayoutComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/UserInfoBarComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >UserInfoBarComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/VerticalComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >VerticalComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/PagesModule.html" data-type="entity-link" >PagesModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                            'data-bs-target="#components-links-module-PagesModule-00c9c9d119e3728057a33fafb6b550fd3b9ba75d88687b4605c30adc702f1eab5759ddbe7555dad6059d60d01904ae526e4b1ededc4d16f5ce55e6d190b3ade9"' : 'data-bs-target="#xs-components-links-module-PagesModule-00c9c9d119e3728057a33fafb6b550fd3b9ba75d88687b4605c30adc702f1eab5759ddbe7555dad6059d60d01904ae526e4b1ededc4d16f5ce55e6d190b3ade9"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-PagesModule-00c9c9d119e3728057a33fafb6b550fd3b9ba75d88687b4605c30adc702f1eab5759ddbe7555dad6059d60d01904ae526e4b1ededc4d16f5ce55e6d190b3ade9"' :
                                            'id="xs-components-links-module-PagesModule-00c9c9d119e3728057a33fafb6b550fd3b9ba75d88687b4605c30adc702f1eab5759ddbe7555dad6059d60d01904ae526e4b1ededc4d16f5ce55e6d190b3ade9"' }>
                                            <li class="link">
                                                <a href="components/CreateUserComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >CreateUserComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/ManageUsersComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ManageUsersComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/PagesRoutingModule.html" data-type="entity-link" >PagesRoutingModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/SharedModule.html" data-type="entity-link" >SharedModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/SharedModule.html" data-type="entity-link" >SharedModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                            'data-bs-target="#components-links-module-SharedModule-949a4fae4110d674b295fb64dfce406b474271aaf2d0629c7f4e153d82161f0152aaf1f123f51947f099a90deacd540a6420f9e967f3057e0bf7421b4cc83fb6-1"' : 'data-bs-target="#xs-components-links-module-SharedModule-949a4fae4110d674b295fb64dfce406b474271aaf2d0629c7f4e153d82161f0152aaf1f123f51947f099a90deacd540a6420f9e967f3057e0bf7421b4cc83fb6-1"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-SharedModule-949a4fae4110d674b295fb64dfce406b474271aaf2d0629c7f4e153d82161f0152aaf1f123f51947f099a90deacd540a6420f9e967f3057e0bf7421b4cc83fb6-1"' :
                                            'id="xs-components-links-module-SharedModule-949a4fae4110d674b295fb64dfce406b474271aaf2d0629c7f4e153d82161f0152aaf1f123f51947f099a90deacd540a6420f9e967f3057e0bf7421b4cc83fb6-1"' }>
                                            <li class="link">
                                                <a href="components/FooterComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >FooterComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/HorizontalnavbarComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >HorizontalnavbarComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/HorizontaltopbarComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >HorizontaltopbarComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/RightsidebarComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >RightsidebarComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/SidebarComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >SidebarComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/TopbarComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >TopbarComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/UIModule.html" data-type="entity-link" >UIModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                            'data-bs-target="#components-links-module-UIModule-b0d9ff100bcaa098c67d4a65f1245c02a666d28f68dd03c1f7923d9df2fb679f93dc40020d10d0d6c862b186bb48a434aa2707e09bb90ee80566ea5c80253a55"' : 'data-bs-target="#xs-components-links-module-UIModule-b0d9ff100bcaa098c67d4a65f1245c02a666d28f68dd03c1f7923d9df2fb679f93dc40020d10d0d6c862b186bb48a434aa2707e09bb90ee80566ea5c80253a55"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-UIModule-b0d9ff100bcaa098c67d4a65f1245c02a666d28f68dd03c1f7923d9df2fb679f93dc40020d10d0d6c862b186bb48a434aa2707e09bb90ee80566ea5c80253a55"' :
                                            'id="xs-components-links-module-UIModule-b0d9ff100bcaa098c67d4a65f1245c02a666d28f68dd03c1f7923d9df2fb679f93dc40020d10d0d6c862b186bb48a434aa2707e09bb90ee80566ea5c80253a55"' }>
                                            <li class="link">
                                                <a href="components/AlertsComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >AlertsComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/ButtonsComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ButtonsComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/CardsComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >CardsComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/CarouselComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >CarouselComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/DropdownsComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >DropdownsComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/GeneralComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >GeneralComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/GridComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >GridComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/ImagesComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ImagesComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/ModalsComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ModalsComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/ProgressbarComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ProgressbarComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/RangesliderComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >RangesliderComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/SweetalertComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >SweetalertComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/TabsComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >TabsComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/TypographyComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >TypographyComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/VideoComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >VideoComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/UiModule.html" data-type="entity-link" >UiModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                            'data-bs-target="#components-links-module-UiModule-a653c920100463928cb5758b564580aff1df16f3b120cfe505f1fc6b512c4e900cd72be08d3e4b04bb5a160adc702aa325b29f4739634299ddb8ba2e3f83ae04"' : 'data-bs-target="#xs-components-links-module-UiModule-a653c920100463928cb5758b564580aff1df16f3b120cfe505f1fc6b512c4e900cd72be08d3e4b04bb5a160adc702aa325b29f4739634299ddb8ba2e3f83ae04"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-UiModule-a653c920100463928cb5758b564580aff1df16f3b120cfe505f1fc6b512c4e900cd72be08d3e4b04bb5a160adc702aa325b29f4739634299ddb8ba2e3f83ae04"' :
                                            'id="xs-components-links-module-UiModule-a653c920100463928cb5758b564580aff1df16f3b120cfe505f1fc6b512c4e900cd72be08d3e4b04bb5a160adc702aa325b29f4739634299ddb8ba2e3f83ae04"' }>
                                            <li class="link">
                                                <a href="components/PagetitleComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >PagetitleComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/UiRoutingModule.html" data-type="entity-link" >UiRoutingModule</a>
                            </li>
                </ul>
                </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#classes-links"' :
                            'data-bs-target="#xs-classes-links"' }>
                            <span class="icon ion-ios-paper"></span>
                            <span>Classes</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="classes-links"' : 'id="xs-classes-links"' }>
                            <li class="link">
                                <a href="classes/FirebaseAuthBackend.html" data-type="entity-link" >FirebaseAuthBackend</a>
                            </li>
                            <li class="link">
                                <a href="classes/User.html" data-type="entity-link" >User</a>
                            </li>
                        </ul>
                    </li>
                        <li class="chapter">
                            <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#injectables-links"' :
                                'data-bs-target="#xs-injectables-links"' }>
                                <span class="icon ion-md-arrow-round-down"></span>
                                <span>Injectables</span>
                                <span class="icon ion-ios-arrow-down"></span>
                            </div>
                            <ul class="links collapse " ${ isNormalMode ? 'id="injectables-links"' : 'id="xs-injectables-links"' }>
                                <li class="link">
                                    <a href="injectables/AuthenticationService.html" data-type="entity-link" >AuthenticationService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/AuthfakeauthenticationService.html" data-type="entity-link" >AuthfakeauthenticationService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/CompanyService.html" data-type="entity-link" >CompanyService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/EventService.html" data-type="entity-link" >EventService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/LanguageService.html" data-type="entity-link" >LanguageService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/UserProfileService.html" data-type="entity-link" >UserProfileService</a>
                                </li>
                            </ul>
                        </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#interceptors-links"' :
                            'data-bs-target="#xs-interceptors-links"' }>
                            <span class="icon ion-ios-swap"></span>
                            <span>Interceptors</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="interceptors-links"' : 'id="xs-interceptors-links"' }>
                            <li class="link">
                                <a href="interceptors/ErrorInterceptor.html" data-type="entity-link" >ErrorInterceptor</a>
                            </li>
                            <li class="link">
                                <a href="interceptors/FakeBackendInterceptor.html" data-type="entity-link" >FakeBackendInterceptor</a>
                            </li>
                            <li class="link">
                                <a href="interceptors/JwtInterceptor.html" data-type="entity-link" >JwtInterceptor</a>
                            </li>
                        </ul>
                    </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#guards-links"' :
                            'data-bs-target="#xs-guards-links"' }>
                            <span class="icon ion-ios-lock"></span>
                            <span>Guards</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="guards-links"' : 'id="xs-guards-links"' }>
                            <li class="link">
                                <a href="guards/AuthGuard.html" data-type="entity-link" >AuthGuard</a>
                            </li>
                            <li class="link">
                                <a href="guards/DocGuard.html" data-type="entity-link" >DocGuard</a>
                            </li>
                        </ul>
                    </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#interfaces-links"' :
                            'data-bs-target="#xs-interfaces-links"' }>
                            <span class="icon ion-md-information-circle-outline"></span>
                            <span>Interfaces</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? ' id="interfaces-links"' : 'id="xs-interfaces-links"' }>
                            <li class="link">
                                <a href="interfaces/AlertColor.html" data-type="entity-link" >AlertColor</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Event.html" data-type="entity-link" >Event</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/MenuItem.html" data-type="entity-link" >MenuItem</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/MenuItem-1.html" data-type="entity-link" >MenuItem</a>
                            </li>
                        </ul>
                    </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#miscellaneous-links"'
                            : 'data-bs-target="#xs-miscellaneous-links"' }>
                            <span class="icon ion-ios-cube"></span>
                            <span>Miscellaneous</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="miscellaneous-links"' : 'id="xs-miscellaneous-links"' }>
                            <li class="link">
                                <a href="miscellaneous/functions.html" data-type="entity-link">Functions</a>
                            </li>
                            <li class="link">
                                <a href="miscellaneous/typealiases.html" data-type="entity-link">Type aliases</a>
                            </li>
                            <li class="link">
                                <a href="miscellaneous/variables.html" data-type="entity-link">Variables</a>
                            </li>
                        </ul>
                    </li>
                        <li class="chapter">
                            <a data-type="chapter-link" href="routes.html"><span class="icon ion-ios-git-branch"></span>Routes</a>
                        </li>
                    <li class="chapter">
                        <a data-type="chapter-link" href="coverage.html"><span class="icon ion-ios-stats"></span>Documentation coverage</a>
                    </li>
                    <li class="divider"></li>
                    <li class="copyright">
                        Documentation generated using <a href="https://compodoc.app/" target="_blank" rel="noopener noreferrer">
                            <img data-src="images/compodoc-vectorise.png" class="img-responsive" data-type="compodoc-logo">
                        </a>
                    </li>
            </ul>
        </nav>
        `);
        this.innerHTML = tp.strings;
    }
});