// this is used when storing a user record as a user of a project
// or sending a list of all users from the server to the client.
// must not contain anything personal

export function getPublicUserProps(user) {
  return {
    name: user.name,
    email: user.email,
    profileImageURL: user.profileImageURL,
  };
}
