import { FC, ReactNode } from "react";
import { Calendar, theme } from "antd";
import dayjs, { Dayjs } from "dayjs";
import styles from "./AppCalendar.module.css";
import { Gutter } from "../Gutter";
import { CalendarEvent } from "../../shared/calendarEvent.interface";
import { DayOff as DayOffT, DayOffStatus, DayOffType } from "../../shared/dayOff.interface";
import { Event } from "./Event";
import { DayOff } from "./DayOff";

type Props = {

  onSelect?: (value: Dayjs) => void
  events?: Array<CalendarEvent>
  daysOff?: Array<DayOffT>
  renderEvent?: (event: CalendarEvent) => ReactNode

  renderDateCell?: (value: Dayjs, children: ReactNode) => ReactNode
  showDaysOff?: boolean

  size?: "default" | "small"

}

type AppCalendarType = FC<Props> & { DayCell: FC<{ value: Dayjs, children: ReactNode }> }

export const AppCalendar: AppCalendarType = ({
                                               onSelect,
                                               renderDateCell,
                                               renderEvent,
                                               showDaysOff = true,
                                               events = [],
                                               daysOff = [],
                                               size = "default"
                                             }) => {
  const dateFullCellRender = (value: Dayjs) => {
    const eventsForThisDay = events.filter(d => {
      if (value.isSame(new Date(d.date), "day")) {
        return true;
      }
      if (!d.isRecurring) {
        return false;
      }
      // @ts-ignore
      return dayjs(d.date).date() === value.date() && dayjs(d.date).month() === value.month();
    }) ?? [];


    const children = renderEvent ? eventsForThisDay.map(e => renderEvent(e)) : eventsForThisDay.map(e => <Event
      key={e._id}
      event={e} popoverContent={<Event.DefaultPopoverContent {...e} />} />);

    const dayOffFromEvent = eventsForThisDay.find(e => e.isDayOff);

    if (showDaysOff) {
      if (dayOffFromEvent) {
        children.push(<DayOff dayOff={{ type: DayOffType.dayOff, status: DayOffStatus.approved }} />);
      } else {
        const dayOffForDate = daysOff.find(d => {
          return dayjs(value).isBetween(d.startDate, d.finishDate, "day", "[]");
        });
        if (dayOffForDate) {
          children.push(<DayOff dayOff={dayOffForDate} />);
        }
      }
    }


    return renderDateCell ? renderDateCell(value, children) :
      <DayCell value={value}>{children}</DayCell>;

  };
  return (
    <Calendar className={size === "small" ? styles.small : ""} onSelect={onSelect} mode={"month"}
              dateFullCellRender={dateFullCellRender} />
  );
};

const DayCell: FC<{ value: Dayjs, children: ReactNode }> = ({ children, value }) => {
  const { token } = theme.useToken();
  return <div className={styles.day} style={{ borderTop: `2px solid ${token.colorBorderSecondary}` }}>
    {value.date()}
    <Gutter size={0.5} />
    {children}
  </div>;
};

AppCalendar.DayCell = DayCell;
