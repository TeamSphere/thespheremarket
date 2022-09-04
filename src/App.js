import logo from './theSphereLogo.png';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import React, { Component } from 'react';
import 'sf-font';

function App() {
  return (
    <div className="App">
      <body>
        <header class="p-3 text-bg-light">
          <div class="container">
            <div class="d-flex flex-wrap align-items-center justify-content-center justify-content-lg-start" style={{ fontFamily: "SF Pro Display" }}>
              <a href="/" class="d-flex align-items-center mb-2 mb-lg-0 text-dark text-decoration-none" style={{ fontWeight: "600", fontSize: '25px' }}>
              <svg height="60" width="60">
                <circle cx="30" cy="30" r="20" fill="#ffa700" />
              </svg>
              </a>

              <ul class="nav col-12 col-lg-auto me-lg-auto mb-2 justify-content-center mb-md-0" style={{ fontWeight: "400" }}>
                <li><a href="#" class="nav-link px-2 text-secondary">Dashboard</a></li>
                <li><a href="#" class="nav-link px-2 text-black">List NFTs</a></li>
                <li><a href="#" class="nav-link px-2 text-black">Bridge NFTs</a></li>
              </ul>

              <div class="text-end">
                <button id="connectbtn" type="button" class="connectbutton">Connect Wallet</button>
              </div>
            </div>
          </div>
        </header>

        <div class="container">
          <footer class="d-flex flex-wrap justify-content-between align-items-center py-3 my-4 border-top">
            <div style={{ fontFamily: "SF Pro Display" }} class="col-md-4 d-flex align-items-center">
              <a href="/" class="mb-3 me-2 mb-md-0 text-muted text-decoration-none lh-1">
                <svg height="60" width="60">
                  <circle cx="30" cy="30" r="20" fill="#ffa700" />
                </svg>
              </a>
              <span class="mb-3 mb-md-0 text-muted">© 2022 The Sphere</span>
            </div>

            <ul class="nav col-md-4 justify-content-end list-unstyled d-flex">
              <li class="ms-3"><a class="text-muted " href="https://github.com/TeamSphere/thespheremarket">
                <i class="bi bi-github"></i> Made with 🧡</a>
              </li>
            </ul>
          </footer>
        </div>
      </body>
    </div>
  );
}

export default App;
