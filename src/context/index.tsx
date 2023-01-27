import { createContext } from "react";

export const AuthContext = createContext<SignedInContext>({ signedIn: false });
