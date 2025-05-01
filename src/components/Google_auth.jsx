import GoogleButton from "react-google-button";

const onGoogleLoginSuccess = () => {
  const GOOGLE_AUTH_URL = 'https://accounts.google.com/o/oauth2/v2/auth';
  const REDIRECT_URI = 'auth/api/login/google/';
  const BASE_API_URL = import.meta.env.VITE_BASE_API_URL;

  if (!BASE_API_URL) {
    console.error('BASE_API_URL is not defined in environment variables');
    return;
  }

  const scope = [
    'https://www.googleapis.com/auth/userinfo.email',
    'https://www.googleapis.com/auth/userinfo.profile'
  ].join(' ');

  const params = {
    response_type: 'code',
    client_id: import.meta.env.VITE_GOOGLE_OAUTH2_CLIENT_ID,
    redirect_uri: `${BASE_API_URL}/${REDIRECT_URI}`,
    prompt: 'select_account',
    access_type: 'offline',
    scope
  };

  console.log('Redirect URI:', params.redirect_uri);

  const urlParams = new URLSearchParams(params).toString();
  window.location = `${GOOGLE_AUTH_URL}?${urlParams}`;
};

const LoginButton = () => {
  return <GoogleButton onClick={onGoogleLoginSuccess} label="Sign in with Google"/>
}

export default LoginButton
