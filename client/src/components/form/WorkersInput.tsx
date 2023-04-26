import { FC, useEffect, useState } from "react";
import { User } from "../../shared/user.interface";
import dayjs from "dayjs";
import { Button, DatePicker, Divider, Form, InputNumber, List } from "antd";
import { CloseOutlined } from "@ant-design/icons";
import { formatDate, formatMoney } from "../../utils/formatters";
import { ProjectWorker } from "../../shared/project.interface";
import { getDisplayName } from "../../sections/users/getDisplayName";
import { UserSelect } from "./UserSelect";
import { useAuth0 } from "@auth0/auth0-react";
import { useQuery } from "react-query";
import { API, getRequestConfig } from "../../services/api";

type Props = {
  value?: ProjectWorker[];
  onChange?: (value: ProjectWorker[]) => void;
};

export const WorkersInput: FC<Props> = (props) => {
  const [values, setValues] = useState<ProjectWorker[]>(props.value ?? []);
  const [startDate, setStartDate] = useState<dayjs.Dayjs | null>(null);
  const [finishDate, setFinishDate] = useState<dayjs.Dayjs | null>(null);
  const [rate, setRate] = useState<number | null>(null);
  const [user, setUser] = useState<string | null>(null);

  const { getAccessTokenSilently } = useAuth0();
  const { data, isLoading } = useQuery<User[]>(["users"], async () => {
    const token = await getAccessTokenSilently();
    const res = await API.get(`/users/display_info`, getRequestConfig(token));
    return res.data.data;
  });

  const disabled = Boolean(!startDate || !rate || !user);

  const onAddSalaryRecord = () => {
    if (disabled) {
      return;
    }
    const userIndex = values.findIndex(
      ({ user: _user }) => _user === user || (_user as any)?._id === user
    );

    console.log(userIndex, user, values);

    const newTitle = {
      startDate: startDate!.toISOString(),
      finishDate: finishDate?.toISOString(),
      rate: rate!,
    };

    if (userIndex !== -1) {
      values[userIndex].titles.push(newTitle);
      setValues([...values]);
    } else {
      // @ts-ignore
      setValues([...values, { user: user!, titles: [newTitle] }]);
    }
    setFinishDate(null);
    setStartDate(null);
    setRate(null);
    setUser(null);
  };

  const onRemoveRecord = (index: number) => {
    const newValues = values.filter((_, i) => i !== index);
    setValues(newValues);
  };

  const onRemoveTitle = (recordIndex: number, index: number) => {
    const newTitles = values[recordIndex].titles.filter((_, i) => i !== index);
    if (newTitles.length === 0) {
      onRemoveRecord(recordIndex);
      return;
    }
    values[recordIndex].titles = newTitles;
    setValues([...values]);
  };

  useEffect(() => {
    props.onChange && props.onChange(values);
  }, [values]);

  return (
    <div>
      <Divider />
      <List
        size={"small"}
        itemLayout="horizontal"
        dataSource={values}
        renderItem={(record, recorIndex) => (
          <List.Item
            actions={[
              <Button
                onClick={() => onRemoveRecord(recorIndex)}
                type="link"
                icon={<CloseOutlined />}
              ></Button>,
            ]}
          >
            <List.Item.Meta
              title={getDisplayName(
                data?.find(
                  (user) =>
                    // @ts-ignore
                    user._id === record.user || user._id === record.user?._id
                )!
              )}
              description={
                <>
                  <List
                    size={"small"}
                    itemLayout="horizontal"
                    dataSource={record.titles}
                    renderItem={(title, index) => (
                      <List.Item
                        actions={[
                          <Button
                            onClick={() => onRemoveTitle(recorIndex, index)}
                            type="link"
                            icon={<CloseOutlined />}
                          ></Button>,
                        ]}
                      >
                        <List.Item.Meta
                          title={`${formatDate(title.startDate)} ${
                            title.finishDate &&
                            `- ${formatDate(title.finishDate)}`
                          }`}
                          description={formatMoney(title.rate)}
                        />
                      </List.Item>
                    )}
                  />
                </>
              }
            />
          </List.Item>
        )}
      />
      <Divider />
      <Form.Item style={{ margin: 4 }} label={"Employee"}>
        <UserSelect value={user} onChange={(v) => setUser(v as string)} />
      </Form.Item>
      <Form.Item style={{ margin: 4 }} label={"Work start date"}>
        <DatePicker value={startDate} onChange={(v) => setStartDate(v)} />
      </Form.Item>
      <Form.Item style={{ margin: 4 }} label={"Work finish date"}>
        <DatePicker value={finishDate} onChange={(v) => setFinishDate(v)} />
      </Form.Item>
      <Form.Item style={{ margin: 4 }} label={"Rate"}>
        <InputNumber
          type="Value"
          value={rate}
          min={0}
          onChange={(v) => setRate(v)}
        />
      </Form.Item>
      <Form.Item style={{ margin: 4 }} label={"Employee"}>
        <Button
          onClick={onAddSalaryRecord}
          disabled={disabled}
          type={"primary"}
        >
          Add worker or title
        </Button>
      </Form.Item>
    </div>
  );
};
