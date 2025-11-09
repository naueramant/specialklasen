const isLoggedInAsAdmin = () => {
  return !!localStorage.getItem("__pb_superuser_auth__");
};

export { isLoggedInAsAdmin };
