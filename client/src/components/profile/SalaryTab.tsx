import { FC, useState } from "react";
import { SalaryRecord } from "../../shared/user.interface";
import { Col, Empty, List, Row, Segmented, Statistic, Typography } from "antd";
import { formatDate, formatMoney } from "../../utils/formatters";
import { Gutter } from "../Gutter";
import { Line, LineConfig } from "@ant-design/charts";

const { Text } = Typography;
type Props = {
  salaryHistory?: Array<SalaryRecord>
}

export const SalaryTab: FC<Props> = ({ salaryHistory }) => {
  const [mode, setMode] = useState<string | number>("List");
  const showChart = mode === "Chart";
  if (!salaryHistory?.length) {
    return <Empty description={"No salary data"} />;
  }

  const config: LineConfig = {
    data: salaryHistory.map(d => ({ ...d, date: formatDate(d.date) })).reverse(),
    padding: "auto",
    xField: "date",
    yField: "value",
    autoFit: true,
    height: 200
  };

  return (
    <div>
      <Row gutter={16}>
        <Col sm={8} xl={6} xxl={4}>
          <Statistic title="Current salary" value={formatMoney(salaryHistory[0].value)} />
        </Col>
        <Col sm={8} xl={6} xxl={4}>
          <Statistic title="Last salary update" value={formatDate(salaryHistory[0].date)!} />
        </Col>
      </Row>
      <Gutter size={2} />
      <Segmented options={["List", "Chart"]} value={mode} onChange={setMode} />
      <Gutter size={2} />
      {!showChart && <List
        header={<Text>Salary history</Text>}
        size={"small"}
        itemLayout="horizontal"
        dataSource={salaryHistory}
        renderItem={(record, index) => (
          <List.Item>
            <List.Item.Meta
              title={formatMoney(record.value)}
              description={formatDate(record.date)}
            />
          </List.Item>
        )}
      />}
      {showChart && <Line {...config} />}
    </div>
  );
};
