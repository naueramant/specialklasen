import { QueryClientProvider } from '@tanstack/react-query';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router';
import Page from './components/Page';
import './index.scss';
import IndexPage from './pages';
import AdminPage from './pages/admin';
import ArticleOfAssociationPage from './pages/articleOfAssociation';
import CalendarPage from './pages/calendar';
import CellarPage from './pages/cellar';
import { queryClient } from './services/api/client';
import AlbumsPage from './pages/albums';
import AlbumDetailsPage from './pages/albums/AlbumDetails';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {new Date().getMonth() === 11 && <div className="snowfall" aria-hidden="true"></div>}

    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Page>
          <Routes>
            <Route path="/" element={<IndexPage />} />
            <Route path="/cellar" element={<CellarPage />} />
            <Route path="/calendar" element={<CalendarPage />} />
            <Route path="/articles-of-association" element={<ArticleOfAssociationPage />} />
            <Route path="/albums" element={<AlbumsPage />} />
            <Route path="/albums/:id" element={<AlbumDetailsPage />} />
            <Route path="/admin" element={<AdminPage />} />

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Page>
      </BrowserRouter>
    </QueryClientProvider>
  </StrictMode>
);
