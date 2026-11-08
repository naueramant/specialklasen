import type { FunctionComponent } from 'react';

/*
  Redirect to the PocketBase admin interface located at /_/
*/

const AdminPage: FunctionComponent = () => {
  window.location.href = '/_/';
  return <></>;
};

export default AdminPage;
