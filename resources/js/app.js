// Incluye en el manifiesto las imágenes utilizadas directamente desde Blade.
import.meta.glob([
    '../assets/buttonLogout.png',
    '../assets/backButton.png',
    '../assets/osoDancer/corazonEntero.png',
], { eager: true, query: '?url', import: 'default' });
