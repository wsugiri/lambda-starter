import React from 'react';

const routes = [
    { path: '/app/home', component: React.lazy(() => import('../views/app/home')) },
    { path: '/app/about', component: React.lazy(() => import('../views/app/about')) },
    { path: '/app/*', component: React.lazy(() => import('../views/not-found')) },
];

export default routes;
