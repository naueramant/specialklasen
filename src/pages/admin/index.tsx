import type { FunctionComponent } from "react";

/*
    Redirect to the admin interface located at /_/
*/

const AdminPage: FunctionComponent = () => {
  window.location.href = "/_/";
  return <></>;
};

export default AdminPage;
