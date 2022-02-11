import React, { createContext } from 'react';

interface UserContextInterface {
    loggedIn: boolean,
    token: string,
}

export const initialUserContext: UserContextInterface = {
    loggedIn: false,
    token: '',
};

type UpdateType = React.Dispatch<
    React.SetStateAction<UserContextInterface>
>;
const defaultUpdate: UpdateType = () => initialUserContext;

export const UserContext = createContext({
    state: initialUserContext,
    update: defaultUpdate,
});

export const UserContextProvider = (props: React.PropsWithChildren<{}>) => {
    const [state, update] = React.useState(initialUserContext);
    // this ignore is necessary to allow this to render correctly
    // eslint-disable-next-line react/jsx-props-no-spreading
    return <UserContext.Provider value={{ state, update }} {...props} />;
};
