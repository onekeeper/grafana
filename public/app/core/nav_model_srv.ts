///<reference path="../headers/common.d.ts" />

import coreModule from 'app/core/core_module';

export interface NavModelItem {
  title: string;
  url: string;
  icon?: string;
  iconUrl?: string;
}

export interface NavModel {
  section: NavModelItem;
  menu: NavModelItem[];
}

export class NavModelSrv {


  /** @ngInject */
  constructor(private contextSrv) {
  }

  getAlertingNav(subPage) {
    return {
      section: {
        title: 'Alerting',
        url: 'plugins',
        icon: 'icon-gf icon-gf-alert'
      },
      menu: [
        {title: 'Alert List', active: subPage === 0, url: 'alerting/list', icon: 'fa fa-list-ul'},
        {title: 'Notification channels', active: subPage === 1, url: 'alerting/notifications', icon: 'fa fa-bell-o'},
      ]
    };
  }

  getDatasourceNav(subPage) {
    return {
      section: {
        title: '数据源',
        url: 'datasources',
        icon: 'icon-gf icon-gf-datasources'
      },
      menu: [
        {title: '清单', active: subPage === 0, url: 'datasources', icon: 'fa fa-list-ul'},
        {title: '新建', active: subPage === 1, url: 'datasources/new', icon: 'fa fa-plus'},
      ]
    };
  }

  getPlaylistsNav(subPage) {
    return {
      section: {
        title: '播放列表',
        url: 'playlists',
        icon: 'fa fa-fw fa-film'
      },
      menu: [
        {title: '清单', active: subPage === 0, url: 'playlists', icon: 'fa fa-list-ul'},
        {title: '新建', active: subPage === 1, url: 'playlists/create', icon: 'fa fa-plus'},
      ]
    };
  }

  getProfileNav() {
    return {
      section: {
        title: '个人设置',
        url: 'profile',
        icon: 'fa fa-fw fa-user'
      },
      menu: []
    };
  }

  getNotFoundNav() {
    return {
      section: {
        title: 'Page',
        url: '',
        icon: 'fa fa-fw fa-warning'
      },
      menu: []
    };
  }

  getOrgNav(subPage) {
    return {
      section: {
        title: 'Organization',
        url: 'org',
        icon: 'icon-gf icon-gf-users'
      },
      menu: [
        {title: 'Preferences', active: subPage === 0, url: 'org', icon: 'fa fa-fw fa-cog'},
        {title: 'Org Users', active: subPage === 1, url: 'org/users', icon: 'fa fa-fw fa-users'},
        {title: 'API Keys', active: subPage === 2, url: 'org/apikeys', icon: 'fa fa-fw fa-key'},
      ]
    };
  }

  getAdminNav(subPage) {
    return {
      section: {
        title: '管理',
        url: 'admin',
        icon: 'fa fa-fw fa-cogs'
      },
      menu: [
        {title: '用户管理', active: subPage === 0, url: 'admin/users', icon: 'fa fa-fw fa-user'},
        {title: '统计信息', active: subPage === 2, url: 'admin/stats', icon: 'fa fa-fw fa-line-chart'},
      ]
    };
  }

  getPluginsNav() {
    return {
      section: {
        title: '插件',
        url: 'plugins',
        icon: 'icon-gf icon-gf-apps'
      },
      menu: []
    };
  }

  getDashboardNav(dashboard, dashNavCtrl) {
    // special handling for snapshots
    if (dashboard.meta.isSnapshot) {
      return {
        section: {
          title: dashboard.title,
          icon: 'icon-gf icon-gf-snapshot'
        },
        menu: [
          {
            title: 'Go to original dashboard',
            icon: 'fa fa-fw fa-external-link',
            url: dashboard.snapshot.originalUrl,
          }
        ]
      };
    }

    var menu = [];

    if (dashboard.meta.canEdit) {
      menu.push({
        title: '设置',
        icon: 'fa fa-fw fa-cog',
        clickHandler: () => dashNavCtrl.openEditView('settings')
      });

      menu.push({
        title: '模板',
        icon: 'fa fa-fw fa-code',
        clickHandler: () => dashNavCtrl.openEditView('templating')
      });

      if (!dashboard.meta.isHome) {
        menu.push({
          title: '版本',
          icon: 'fa fa-fw fa-history',
          clickHandler: () => dashNavCtrl.openEditView('history')
        });
      }
    }

    if (this.contextSrv.isEditor && !dashboard.editable) {
      menu.push({
        title: '设为可写',
        icon: 'fa fa-fw fa-edit',
        clickHandler: () => dashNavCtrl.makeEditable()
      });
    }

    if (this.contextSrv.isEditor) {
      menu.push({
        title: '另存为...',
        icon: 'fa fa-fw fa-save',
        clickHandler: () => dashNavCtrl.saveDashboardAs()
      });
    }

    if (dashboard.meta.canSave) {
      menu.push({
        title: '删除',
        icon: 'fa fa-fw fa-trash',
        clickHandler: () => dashNavCtrl.deleteDashboard()
      });

    }

    return {
      section: {
        title: dashboard.title,
        icon: 'icon-gf icon-gf-dashboard'
      },
      menu: menu
    };
  }
}

coreModule.service('navModelSrv', NavModelSrv);
