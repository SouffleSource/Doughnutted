import { defineStorage } from '@aws-amplify/backend';

export const storage = defineStorage({
  name: 'amplifyTeamDrive',
  access: (allow) => ({
    'uploads/{entity_id}/*': [
      allow.guest.to(['write']),
      allow.authenticated.to(['write']),
    ],
  })
});
