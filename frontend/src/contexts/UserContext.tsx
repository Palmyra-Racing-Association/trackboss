import React, { createContext } from 'react';
import { Member } from '../../../src/typedefs/member';

interface UserContextInterface {
    loggedIn: boolean,
    token: string,
    user: Member | undefined,
    storedUser: Member | undefined,
}

export const initialUserContext: UserContextInterface = {
    loggedIn: false,
    token: '',
    user: undefined,
    storedUser: undefined,
};

type UpdateType = React.Dispatch<
    React.SetStateAction<UserContextInterface>
>;
const defaultUpdate: UpdateType = () => initialUserContext;

export const UserContext = createContext({
    state: initialUserContext,
    update: defaultUpdate,
});

export function UserContextProvider(props: React.PropsWithChildren<{}>) {
    const [state, update] = React.useState(initialUserContext);
    // this disable is necessary to allow this to render correctly
    // eslint-disable-next-line
    return <UserContext.Provider value={{ state, update }} {...props} />;
}
