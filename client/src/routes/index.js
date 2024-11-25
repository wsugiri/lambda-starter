import React from 'react';

const routes = [
    { path: '/login', component: React.lazy(() => import('../views/login')) },
    { path: '/*', component: React.lazy(() => import('../views')) },
];

export default routes;
