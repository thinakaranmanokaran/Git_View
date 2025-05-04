import React from 'react'
import { BrowserRouter } from 'react-router-dom'
import Routes from './Routes'
import { Helmet } from 'react-helmet';

const App = () => {
  return (
    <div>
      <Helmet>
        <meta charSet="utf-8" />
        <title>PrettyHub - Your GitHub Repo Viewer</title>
        <meta name="description" content="PrettyHub is a sleek and user-friendly GitHub repository viewer that lets you browse, explore, and view code files with ease." />
        <meta name="keywords" content="GitHub, repository viewer, PrettyHub, GitHub viewer, code viewer, GitHub exploration" />
        <meta property="og:title" content="PrettyHub - GitHub Repository Viewer" />
        <meta property="og:description" content="Explore and view your GitHub repositories in a beautiful, organized, and efficient interface with PrettyHub." />
        <meta property="og:url" content="https://prettyhub.vercel.app" />
        <meta property="og:image" content="https://prettyhub.vercel.app/preview.png" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="PrettyHub - GitHub Repository Viewer" />
        <meta name="twitter:description" content="PrettyHub makes browsing GitHub repositories easy and intuitive." />
        <meta name="twitter:image" content="https://prettyhub.vercel.app/preview.png" />
      </Helmet>
      <BrowserRouter>
        <Routes />
      </BrowserRouter>
    </div>
  )
}

export default App