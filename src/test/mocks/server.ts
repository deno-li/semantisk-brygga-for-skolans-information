import { setupServer } from 'msw/node';
import { handlers } from './handlers';

export const server = setupServer(...handlers);

// Start server automatically when this module is imported
server.listen({ onUnhandledRequest: 'warn' });
