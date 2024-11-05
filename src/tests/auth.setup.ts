import { pathToAuthFile } from '@constants';
import { test as setup } from '@fixtures/base-test';
import { getCsrfTokenFromHtml } from 'api/helper';

setup('authenticate test user', async ({ request }) => {
  const csrfTokenFromHtml = await getCsrfTokenFromHtml(request, '/login');

  const data = new URLSearchParams();
  data.append('_csrf', csrfTokenFromHtml);
  data.append('LoginForm[username]', process.env.USER_NAME);
  data.append('LoginForm[password]', process.env.USER_PASSWORD);
  data.append('LoginForm[rememberMe]', '0');
  data.append('login-button', '');

  await request.post('/login', {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    data: data.toString(),
    failOnStatusCode: true
  });

  await request.storageState({ path: pathToAuthFile });
});
