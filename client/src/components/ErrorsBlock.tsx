import { FC, useMemo } from "react";
import { Alert } from "antd";
import { AxiosError } from "axios";

type Props = {
  errors: (AxiosError | null | undefined)[]
}

export const ErrorsBlock: FC<Props> = (props) => {
  const definedErrors = useMemo(() => props.errors.filter(Boolean) as AxiosError[], [props.errors]);

  return (
    <div>
      {definedErrors.map(e => {
        return <Alert style={{ marginTop: 16 }} message={e.message}
                      description={(e.response?.data as any)?.message} type="error" />;
      })}
    </div>
  );
};
