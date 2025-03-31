// Function to create Bitcoin SVG graphics
function createBitcoinGraphics() {
    // Create Bitcoin SVG elements
    const svgNS = "http://www.w3.org/2000/svg";
    
    // Top right Bitcoin
    const topRightBitcoin = document.createElement('div');
    topRightBitcoin.className = 'bitcoin-graphic top-right';
    topRightBitcoin.innerHTML = `
      <svg xmlns="${svgNS}" viewBox="0 0 64 64" fill="#f7931a">
        <path d="M63.04,39.741c-4.274,17.143-21.638,27.575-38.783,23.301C7.12,58.768-3.313,41.404,0.962,24.262
        C5.234,7.117,22.597-3.317,39.737,0.957C56.882,5.23,67.314,22.597,63.04,39.741z"/>
        <path d="M46.11,27.441c0.636-4.257-2.606-6.546-7.039-8.074l1.438-5.768l-3.512-0.875l-1.4,5.616
        c-0.924-0.23-1.872-0.447-2.813-0.662l1.41-5.653l-3.509-0.875l-1.439,5.766c-0.764-0.174-1.514-0.346-2.242-0.527l0.004-0.018
        l-4.842-1.209l-0.934,3.75c0,0,2.605,0.597,2.55,0.634c1.422,0.355,1.679,1.296,1.636,2.042l-1.638,6.571
        c0.098,0.025,0.225,0.061,0.365,0.117c-0.117-0.029-0.242-0.061-0.371-0.092l-2.296,9.205c-0.174,0.432-0.615,1.08-1.609,0.834
        c0.035,0.051-2.552-0.637-2.552-0.637l-1.743,4.02l4.57,1.139c0.85,0.213,1.683,0.436,2.502,0.646l-1.453,5.835l3.507,0.875
        l1.439-5.772c0.959,0.26,1.888,0.5,2.798,0.726l-1.434,5.745l3.511,0.875l1.453-5.823c5.987,1.133,10.489,0.676,12.384-4.739
        c1.527-4.36-0.076-6.875-3.226-8.515C42.938,32.089,45.657,30.646,46.11,27.441z M38.088,36.604
        c-1.086,4.36-8.426,2.004-10.807,1.412l1.928-7.729C31.59,30.88,39.203,32.083,38.088,36.604z M39.173,27.383
        c-0.99,3.966-7.1,1.951-9.082,1.457l1.748-7.011C33.822,22.323,40.19,23.272,39.173,27.383z" fill="white"/>
      </svg>
    `;
    
    // Bottom left Bitcoin
    const bottomLeftBitcoin = document.createElement('div');
    bottomLeftBitcoin.className = 'bitcoin-graphic bottom-left';
    bottomLeftBitcoin.innerHTML = `
      <svg xmlns="${svgNS}" viewBox="0 0 64 64" fill="#f7931a">
        <path d="M63.04,39.741c-4.274,17.143-21.638,27.575-38.783,23.301C7.12,58.768-3.313,41.404,0.962,24.262
        C5.234,7.117,22.597-3.317,39.737,0.957C56.882,5.23,67.314,22.597,63.04,39.741z"/>
        <path d="M46.11,27.441c0.636-4.257-2.606-6.546-7.039-8.074l1.438-5.768l-3.512-0.875l-1.4,5.616
        c-0.924-0.23-1.872-0.447-2.813-0.662l1.41-5.653l-3.509-0.875l-1.439,5.766c-0.764-0.174-1.514-0.346-2.242-0.527l0.004-0.018
        l-4.842-1.209l-0.934,3.75c0,0,2.605,0.597,2.55,0.634c1.422,0.355,1.679,1.296,1.636,2.042l-1.638,6.571
        c0.098,0.025,0.225,0.061,0.365,0.117c-0.117-0.029-0.242-0.061-0.371-0.092l-2.296,9.205c-0.174,0.432-0.615,1.08-1.609,0.834
        c0.035,0.051-2.552-0.637-2.552-0.637l-1.743,4.02l4.57,1.139c0.85,0.213,1.683,0.436,2.502,0.646l-1.453,5.835l3.507,0.875
        l1.439-5.772c0.959,0.26,1.888,0.5,2.798,0.726l-1.434,5.745l3.511,0.875l1.453-5.823c5.987,1.133,10.489,0.676,12.384-4.739
        c1.527-4.36-0.076-6.875-3.226-8.515C42.938,32.089,45.657,30.646,46.11,27.441z M38.088,36.604
        c-1.086,4.36-8.426,2.004-10.807,1.412l1.928-7.729C31.59,30.88,39.203,32.083,38.088,36.604z M39.173,27.383
        c-0.99,3.966-7.1,1.951-9.082,1.457l1.748-7.011C33.822,22.323,40.19,23.272,39.173,27.383z" fill="white"/>
      </svg>
    `;
    
    // Center right Bitcoin
    const centerRightBitcoin = document.createElement('div');
    centerRightBitcoin.className = 'bitcoin-graphic center-right';
    centerRightBitcoin.innerHTML = `
      <svg xmlns="${svgNS}" viewBox="0 0 64 64" fill="#f7931a">
        <path d="M63.04,39.741c-4.274,17.143-21.638,27.575-38.783,23.301C7.12,58.768-3.313,41.404,0.962,24.262
        C5.234,7.117,22.597-3.317,39.737,0.957C56.882,5.23,67.314,22.597,63.04,39.741z"/>
        <path d="M46.11,27.441c0.636-4.257-2.606-6.546-7.039-8.074l1.438-5.768l-3.512-0.875l-1.4,5.616
        c-0.924-0.23-1.872-0.447-2.813-0.662l1.41-5.653l-3.509-0.875l-1.439,5.766c-0.764-0.174-1.514-0.346-2.242-0.527l0.004-0.018
        l-4.842-1.209l-0.934,3.75c0,0,2.605,0.597,2.55,0.634c1.422,0.355,1.679,1.296,1.636,2.042l-1.638,6.571
        c0.098,0.025,0.225,0.061,0.365,0.117c-0.117-0.029-0.242-0.061-0.371-0.092l-2.296,9.205c-0.174,0.432-0.615,1.08-1.609,0.834
        c0.035,0.051-2.552-0.637-2.552-0.637l-1.743,4.02l4.57,1.139c0.85,0.213,1.683,0.436,2.502,0.646l-1.453,5.835l3.507,0.875
        l1.439-5.772c0.959,0.26,1.888,0.5,2.798,0.726l-1.434,5.745l3.511,0.875l1.453-5.823c5.987,1.133,10.489,0.676,12.384-4.739
        c1.527-4.36-0.076-6.875-3.226-8.515C42.938,32.089,45.657,30.646,46.11,27.441z M38.088,36.604
        c-1.086,4.36-8.426,2.004-10.807,1.412l1.928-7.729C31.59,30.88,39.203,32.083,38.088,36.604z M39.173,27.383
        c-0.99,3.966-7.1,1.951-9.082,1.457l1.748-7.011C33.822,22.323,40.19,23.272,39.173,27.383z" fill="white"/>
      </svg>
    `;
    
    // Append to App div
    const appElement = document.querySelector('.App');
    if (appElement) {
      appElement.appendChild(topRightBitcoin);
      appElement.appendChild(bottomLeftBitcoin);
      appElement.appendChild(centerRightBitcoin);
    }
  }
  
  // Function to handle fade effect on scroll
  function handleScrollFade() {
    const bitcoinGraphics = document.querySelectorAll('.bitcoin-graphic');
    
    window.addEventListener('scroll', () => {
      const scrollPosition = window.scrollY;
      const windowHeight = window.innerHeight;
      
      bitcoinGraphics.forEach(graphic => {
        const graphicPosition = graphic.getBoundingClientRect().top + scrollPosition;
        
        // Calculate distance from viewport
        const distanceFromViewport = graphicPosition - scrollPosition;
        
        // Apply fade class if scrolled past
        if (distanceFromViewport < windowHeight * 0.3 || distanceFromViewport > windowHeight * 0.8) {
          graphic.classList.add('fade-out');
        } else {
          graphic.classList.remove('fade-out');
        }
      });
    });
  }
  
  // Initialize on page load
  document.addEventListener('DOMContentLoaded', () => {
    createBitcoinGraphics();
    handleScrollFade();
  });