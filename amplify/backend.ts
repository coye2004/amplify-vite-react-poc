import { defineBackend } from '@aws-amplify/backend';

// Temporarily disable backend resources to test frontend-only deployment
// defineBackend({
//   auth,
//   data,
// });

defineBackend({});
