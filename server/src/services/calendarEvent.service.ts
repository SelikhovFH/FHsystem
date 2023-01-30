import calendarEventModel from "@models/calendarEvent.model";
import {CreateCalendarEventBackendDto, UpdateCalendarEventDto} from "@dtos/calendarEvent.dto";
import {CalendarEvent} from "@interfaces/calendarEvent.interface";
import {getStartOfCurrentYear} from "@utils/dayOff.helpers";

class CalendarEventService {
  public calendarEvent = calendarEventModel;

  public async createCalendarEvent(data: CreateCalendarEventBackendDto): Promise<CalendarEvent> {
    return this.calendarEvent.create({...data, date: new Date(data.date)});
  }

  public async updateCalendarEvent(id: string, data: Partial<UpdateCalendarEventDto>): Promise<CalendarEvent> {
    return this.calendarEvent.findOneAndUpdate({_id: id}, {...data, date: new Date(data.date)});
  }

  public async deleteCalendarEvent(id: string) {
    return this.calendarEvent.findOneAndDelete({id})
  }

  public async getCalendarEventsForCurrentYear(): Promise<CalendarEvent[]> {
    return this.calendarEvent.find({
      $or: [
        {
          date: {
            $gte: getStartOfCurrentYear(),
          }
        },
        {
          isRecurring: true
        }
      ]
    })
  }

  public async getHolidaysForCurrentYear(): Promise<CalendarEvent[]> {
    return this.calendarEvent.find({
      isDayOff: true,
      $or: [
        {
          date: {
            $gte: getStartOfCurrentYear(),
          }
        },
        {
          isRecurring: true
        }
      ]
    })
  }

}

export default CalendarEventService;
