import { FC, ReactNode } from "react";
import { Popover, theme, Typography } from "antd";
import { formatDate } from "../../utils/formatters";
import { CalendarEvent } from "../../shared/calendarEvent.interface";

const {Text} = Typography

type EventType = FC<{ event: CalendarEvent, popoverContent: ReactNode }> & { DefaultPopoverContent: FC<CalendarEvent> }

export const Event: EventType = ({event, popoverContent}) => {
    const {token} = theme.useToken()
    return (
        <div onClick={e => e.stopPropagation()}>
            <Popover placement={'left'} title={`${event.title} on ${formatDate(event.date)}`} trigger="click"
                     content={popoverContent}>
                <div style={{
                    border: `1px solid ${token.colorPrimary}`,
                    background: event.isDayOff ? token.colorPrimary : "unset",
                    color: token.colorPrimary,
                    padding: 4,
                    borderRadius: 4,
                    marginBottom: 4
                }}>
                    <Text style={{color: event.isDayOff ? token.colorWhite : token.colorPrimary}}>{event.title}</Text>
                </div>
            </Popover>
        </div>
    )
}

Event.DefaultPopoverContent = (event) =>
    <>
        <Text>
            {event.description}
        </Text>
        <br/>
        <Text>
            Day off: {event.isDayOff ? '✅' : '❌'}
        </Text>
        <br/>
        <Text>
            Recurring: {event.isRecurring ? '✅' : '❌'}
        </Text>
    </>
