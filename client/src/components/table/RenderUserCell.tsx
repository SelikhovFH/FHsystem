import {User} from "../../shared/user.interface";
import {ReactNode} from "react";


export const renderUserCell = (user: User): ReactNode => {
    if (!user) {
        return null
    }
    return (
        <div>
            {user._id}
        </div>
    )
}
