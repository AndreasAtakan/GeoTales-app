type SignedInContext = {
	signedIn: boolean;
	signIn?: (data?: any) => Promise<void>;
	signOut?: () => void;
	signUp?: (data?: any) => Promise<void>;
};
