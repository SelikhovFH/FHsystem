import { FC, useState } from "react";
import { Empty, List, Segmented, Space } from "antd";
import { formatDate } from "../../utils/formatters";
import { DayOff } from "../../shared/dayOff.interface";
import { AppCalendar } from "../calendar/AppCalendar";
import { Gutter } from "../Gutter";
import { renderDayOffStatus, TypeLabels } from "../../sections/dayOff";

type Props = {
  daysOff?: DayOff[]
}

export const DaysOffTab: FC<Props> = ({ daysOff }) => {
  const [mode, setMode] = useState<string | number>("Calendar");
  const showCalendar = mode === "Calendar";
  if (!daysOff?.length) {
    return <Empty description={"No days off data"} />;
  }

  return (
    <div>
      <Segmented options={["Calendar", "List"]} value={mode} onChange={setMode} />
      <Gutter size={2} />
      {showCalendar && <AppCalendar size={"small"} daysOff={daysOff} />}
      {!showCalendar && <List
        itemLayout="horizontal"
        dataSource={daysOff}
        renderItem={(item) => (
          <List.Item>
            <List.Item.Meta
              title={`${formatDate(item.startDate)} - ${formatDate(item.finishDate)}`}
              description={<Space>
                {TypeLabels[item.type]}
                {renderDayOffStatus(item.status)}
              </Space>}
            />

          </List.Item>
        )}
      />}
    </div>
  );

};
