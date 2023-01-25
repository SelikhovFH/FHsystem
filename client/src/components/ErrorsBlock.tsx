import {FC} from "react";
import {Alert} from "antd";

type Props = {
    errors: { message: string }[]
}

export const ErrorsBlock: FC<Props> = (props) => {
    const errors = props.errors.filter(Boolean)
    return (
        <div>
            {errors.map(e => {
                return <Alert style={{marginTop: 16}} message={e.message} type="error"/>
            })}
        </div>
    )
}
