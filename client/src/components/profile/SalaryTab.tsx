import { FC } from "react";
import { SalaryRecord } from "../../shared/user.interface";
import { Col, Empty, List, Row, Statistic, Typography } from "antd";
import { formatDate, formatMoney } from "../../utils/formatters";
import { Gutter } from "../Gutter";
import { Line, LineConfig } from "@ant-design/charts";

const { Text } = Typography;
type Props = {
  salaryHistory?: Array<SalaryRecord>
}

export const SalaryTab: FC<Props> = ({ salaryHistory }) => {
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
        <Col span={4}>
          <Statistic title="Current salary" value={formatMoney(salaryHistory[0].value)} />
        </Col>
        <Col span={4}>
          <Statistic title="Last salary update" value={formatDate(salaryHistory[0].date)!} />
        </Col>
      </Row>
      <Gutter size={2} />
      <List
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
      />
      <Gutter size={4} />
      <Line {...config} />
    </div>
  );
};
