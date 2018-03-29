import Calendar from 'layouts/Calendar'
import Day from 'pages/Day'

export default [
  {
    path: '/',
    component: () => import('layouts/default'),
    children: [
      { path: '', component: () => import('pages/index') }
    ]
  },

  {
    path: '/calendar',

    // we use /src/layouts/Calendar component which is imported above
    component: Calendar,

    // hey, it has children routes and Calendar has <router-view> in it;
    // It is really a Layout then!
    children: [
      // Day page
      {
        path: 'day', // here it is, route /user/day
        component: Day // we reference /src/pages/Day.vue imported above
      }
    ]
  },

  { // Always leave this as last one
    path: '*',
    component: () => import('pages/404')
  }
]
