import { Anchor, Container, Group } from '@mantine/core';
import { Link, Route, Routes } from 'react-router-dom';
import React from 'react';

import routes from '../routes/app';

const NotFound = React.lazy(() => import('../views/not-found'));

const App = () => {
    return (
        <div>
            <Container>
                <Group>
                    <Link to={'/app/home'}>Home</Link>
                    <Link to={'/app/story'}>Story</Link>
                    <Link to={'/app/about'}>About</Link>
                </Group>
            </Container>

            <Routes>
                {routes.map((route, index) => (
                    <Route key={index} path={route.path} element={<route.component />} />
                ))}
            </Routes >

            <Container />
        </div >
    );
};

export default App;