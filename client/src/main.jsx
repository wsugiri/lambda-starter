import { Container, MantineProvider } from '@mantine/core';
import { Suspense } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

import routes from './routes';

import '@mantine/core/styles.css';
import './assets/css/styles.css';

const root = createRoot(document.getElementById('root'));

const App = (
    <Suspense fallback={<div>loading....</div>}>
        <MantineProvider>
            <Container mih={'calc(100vh)'} bg={'gray.0'} fluid>
                <BrowserRouter>
                    <Routes>
                        {routes.map((route, index) => (
                            <Route key={index} path={route.path} element={<route.component />} />
                        ))}
                    </Routes>
                </BrowserRouter>
            </Container>
        </MantineProvider>
    </Suspense>
);

root.render(App);
