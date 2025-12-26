import { setupServer } from 'msw/node';
import { handlers } from './handlers';

// Create MSW server but don't start it automatically
// Tests should start/stop the server explicitly
export const server = setupServer(...handlers);
