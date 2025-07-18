// frontend/src/lib/echo.js
import Echo from 'laravel-echo';
import Pusher from 'pusher-js';

const initializePusher = () => {
  const pusher = new Pusher('n8njdfja1rccxlxk9dr9', {
    wsHost: 'localhost',
    wsPort: 8080,
    forceTLS: false,
    enabledTransports: ['ws'],
    cluster: '', // Reverb doesn't use this
    // No auth for local dev
  });
  return pusher;
};

export default initializePusher;
