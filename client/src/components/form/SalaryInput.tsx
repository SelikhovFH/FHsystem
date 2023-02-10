import { FC, useEffect, useState } from "react";
import { SalaryRecord } from "../../shared/user.interface";
import dayjs from "dayjs";
import { Button, DatePicker, InputNumber, List, Space } from "antd";
import { CloseOutlined } from "@ant-design/icons";
import { formatDate, formatMoney } from "../../utils/formatters";

type Props = {
  value?: SalaryRecord[];
  onChange?: (value: SalaryRecord[]) => void;
}

export const SalaryInput: FC<Props> = (props) => {
  const [values, setValues] = useState<SalaryRecord[]>(props.value ?? []);
  const [value, setValue] = useState<number | null>();
  const [date, setDate] = useState<dayjs.Dayjs | null>();

  const onAddSalaryRecord = () => {
    if (!value || !date) {
      return;
    }
    const sortedValues = [...values, { date: date.toISOString(), value }].sort(function(a, b) {
      return +(new Date(b.date)) - +(new Date(a.date));
    });
    setValues(sortedValues);
    setValue(null);
    setDate(null);
  };

  const onRemoveRecord = (index: number) => {
    setValues(values.filter((_, i) => i !== index));
  };

  useEffect(() => {
    props.onChange && props.onChange(values);
  }, [values]);


  return (
    <div>
      <Space>
        <InputNumber
          type="Value"
          value={value}
          min={0}
          onChange={v => setValue(v)}
        />
        <DatePicker
          value={date}
          onChange={v => setDate(v)}
        />
        <Button onClick={onAddSalaryRecord} disabled={!value || !date} type={"primary"}>
          Add salary record
        </Button>
      </Space>
      <List
        size={"small"}
        itemLayout="horizontal"
        dataSource={values}
        renderItem={(record, index) => (
          <List.Item
            actions={[<Button onClick={() => onRemoveRecord(index)} type="link" icon={<CloseOutlined />}></Button>
            ]}
          >
            <List.Item.Meta
              title={formatMoney(record.value)}
              description={formatDate(record.date)}
            />
          </List.Item>
        )}
      />
    </div>
  );
};
