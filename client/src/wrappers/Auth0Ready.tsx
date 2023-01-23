import React, {FC} from 'react';
import {useAuth0} from '@auth0/auth0-react';
import {Loader} from "../components/Loader";
import {ChildrenProp} from '../utils/types';


const Auth0Ready: FC<ChildrenProp> = ({children}) => {
    const {isLoading, error,} = useAuth0();
    if (isLoading) {
        return <Loader/>;
    }
    if (error) {
        return <div>Error: {error.message}</div>;
    }
    return <>{children}</>;
};
export default Auth0Ready;
