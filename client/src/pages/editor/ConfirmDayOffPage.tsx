import { FC } from "react";
import { AppHeader } from "../../layouts/Header";
import { Layout, Tabs, TabsProps, Typography } from "antd";
import { ConfirmDayOffWidget } from "../../components/confirmDayOff/ConfirmDayOffWidget";
import { DayOffTableWidget } from "../../components/confirmDayOff/DayOffTableWidget";

type Props = {}
const { Content } = Layout;
const { Title } = Typography;

export const ConfirmDayOffPage: FC<Props> = (props) => {
  const items: TabsProps["items"] = [
    {
      key: "1",
      label: `Confirm days off`,
      children: <ConfirmDayOffWidget />
    },
    {
      key: "2",
      label: `Managage days off`,
      children: <DayOffTableWidget />
    }

  ];

  return (
    <>
      <AppHeader title={"Confirm day off"} />
      <Content style={{ margin: 32 }}>
        <Tabs destroyInactiveTabPane defaultActiveKey="1" items={items} />
      </Content>
    </>
  )
};
