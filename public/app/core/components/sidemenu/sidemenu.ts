///<reference path="../../../headers/common.d.ts" />

import config from 'app/core/config';
import _ from 'lodash';
import $ from 'jquery';
import coreModule from '../../core_module';

export class SideMenuCtrl {
  isSignedIn: boolean;
  showSignout: boolean;
  user: any;
  mainLinks: any;
  orgMenu: any;
  appSubUrl: string;
  loginUrl: string;
  orgFilter: string;
  orgItems: any;
  orgs: any;
  maxShownOrgs: number;

  /** @ngInject */
  constructor(private $scope, private $location, private contextSrv, private backendSrv, private $element) {
    this.isSignedIn = contextSrv.isSignedIn;
    this.user = contextSrv.user;
    this.appSubUrl = config.appSubUrl;
    this.showSignout = this.contextSrv.isSignedIn && !config['disableSignoutMenu'];
    this.maxShownOrgs = 10;

    this.mainLinks = config.bootData.mainNavLinks;
    this.openUserDropdown();
    this.loginUrl = 'login?redirect=' + encodeURIComponent(this.$location.path());

    this.$scope.$on('$routeChangeSuccess', () => {
      if (!this.contextSrv.pinned) {
        this.contextSrv.sidemenu = false;
      }
      this.loginUrl = 'login?redirect=' + encodeURIComponent(this.$location.path());
    });

    this.orgFilter = '';
  }

 getUrl(url) {
   return config.appSubUrl + url;
 }

 openUserDropdown() {
   this.orgMenu = [
     {text: '个人设置', url: this.getUrl('/profile')},
   ];

   if (this.showSignout) {
     this.orgMenu.push({cssClass: "divider"});
     this.orgMenu.push({text: "注销", url: this.getUrl("/logout"), target: "_self"});
   }
 }

 loadOrgsItems(){
   this.orgItems = [];
   this.orgs.forEach(org => {
     if (org.orgId === this.contextSrv.user.orgId) {
       return;
     }

     if (this.orgItems.length === this.maxShownOrgs) {
       return;
     }

     if (this.orgFilter === '' || (org.name.toLowerCase().indexOf(this.orgFilter.toLowerCase()) !== -1)) {
       this.orgItems.push({
         text: "Switch to " + org.name,
         icon: "fa fa-fw fa-random",
         url: this.getUrl('/profile/switch-org/' + org.orgId),
         target: '_self'
       });
     }
   });
   if (config.allowOrgCreate) {
     this.orgItems.push({text: "New organization", icon: "fa fa-fw fa-plus", url: this.getUrl('/org/new')});
   }
 }
}

export function sideMenuDirective() {
  return {
    restrict: 'E',
    templateUrl: 'public/app/core/components/sidemenu/sidemenu.html',
    controller: SideMenuCtrl,
    bindToController: true,
    controllerAs: 'ctrl',
    scope: {},
    link: function(scope, elem) {
      // hack to hide dropdown menu
      elem.on('click.dropdown', '.dropdown-menu a', function(evt) {
        var menu = $(evt.target).parents('.dropdown-menu');
        var parent = menu.parent();
        menu.detach();

        setTimeout(function() {
          parent.append(menu);
        }, 100);
      });

      scope.$on("$destory", function() {
        elem.off('click.dropdown');
      });
    }
  };
}

coreModule.directive('sidemenu', sideMenuDirective);
