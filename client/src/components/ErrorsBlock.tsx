import { FC } from "react";
import { Alert } from "antd";
import { AxiosError } from "axios";

type Props = {
    errors: (AxiosError | null | undefined)[]
}

export const ErrorsBlock: FC<Props> = (props) => {
  const errors = props.errors.filter(Boolean) as AxiosError[];
    return (
        <div>
            {errors.map(e => {
                return <Alert style={{marginTop: 16}} message={e.message}
                              description={(e.response?.data as any)?.message} type="error"/>
            })}
        </div>
    )
}
