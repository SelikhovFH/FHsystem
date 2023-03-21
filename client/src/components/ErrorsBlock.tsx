import { FC, useEffect, useMemo, useState } from "react";
import { Alert } from "antd";
import { AxiosError } from "axios";

type Props = {
  errors: (AxiosError | null | undefined)[]
}

export const ErrorsBlock: FC<Props> = (props) => {

  const definedErrors = useMemo(() => props.errors.filter(Boolean) as AxiosError[], [props.errors]);

  const [shouldDisplayError, setShouldDisplayError] = useState(true);

  useEffect(() => {
    setShouldDisplayError(true);
    let timer = setTimeout(() => setShouldDisplayError(false), 10 * 1000);

    return () => {
      clearTimeout(timer);
    };
  }, [definedErrors]);

  if (!shouldDisplayError) {
    return null;
  }

  return (
    <div>
      {definedErrors.map(e => {
        return <Alert style={{ marginTop: 16 }} message={e.message}
                      description={(e.response?.data as any)?.message} type="error" />;
      })}
    </div>
  );
};
