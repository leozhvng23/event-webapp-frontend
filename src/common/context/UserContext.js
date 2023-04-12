import { createContext } from "react";

const UserContext = createContext({
  user: null,
  setUser: () => {},
});

export default UserContext;

// user.attributes: {
//     sub: '6945243a-77fd-4404-9403-7ed47d718d1c',
//     email_verified: true,
//     name: 'Leo Zhang',
//     email: 'leozhvng@gmail.com'
// }
