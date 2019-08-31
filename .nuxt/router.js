import Vue from 'vue'
import Router from 'vue-router'
import { interopDefault } from './utils'
import scrollBehavior from './router.scrollBehavior.js'

const _0da9d3eb = () => interopDefault(import('../pages/user.vue' /* webpackChunkName: "pages/user" */))
const _5e3703a4 = () => interopDefault(import('../pages/user/index.vue' /* webpackChunkName: "pages/user/index" */))
const _cdb68182 = () => interopDefault(import('../pages/user/inactive.vue' /* webpackChunkName: "pages/user/inactive" */))
const _373ccbe2 = () => interopDefault(import('../pages/user/no-mic.vue' /* webpackChunkName: "pages/user/no-mic" */))
const _e5790296 = () => interopDefault(import('../pages/user/shout.vue' /* webpackChunkName: "pages/user/shout" */))

Vue.use(Router)

export const routerOptions = {
  mode: 'history',
  base: decodeURI('/'),
  linkActiveClass: 'nuxt-link-active',
  linkExactActiveClass: 'nuxt-link-exact-active',
  scrollBehavior,

  routes: [{
      path: "/user",
      component: _0da9d3eb,
      children: [{
        path: "",
        component: _5e3703a4,
        name: "user"
      }, {
        path: "inactive",
        component: _cdb68182,
        name: "user-inactive"
      }, {
        path: "no-mic",
        component: _373ccbe2,
        name: "user-no-mic"
      }, {
        path: "shout",
        component: _e5790296,
        name: "user-shout"
      }]
    }],

  fallback: false
}

export function createRouter() {
  return new Router(routerOptions)
}
