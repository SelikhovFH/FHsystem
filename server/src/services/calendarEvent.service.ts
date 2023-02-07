import calendarEventModel from "@models/calendarEvent.model";
import { CreateCalendarEventBackendDto, UpdateCalendarEventDto } from "@dtos/calendarEvent.dto";
import { CalendarEvent } from "@interfaces/calendarEvent.interface";
import { getStartOfCurrentYear } from "@utils/dayOff.helpers";
import { CreateDayOffDto } from "@dtos/dayOff.dto";
import { HttpException } from "@exceptions/HttpException";
import dayjs from "dayjs";

class CalendarEventService {
  public calendarEvent = calendarEventModel;

  public async createCalendarEvent(data: CreateCalendarEventBackendDto): Promise<CalendarEvent> {
    return this.calendarEvent.create({ ...data, date: new Date(data.date) });
  }

  public async updateCalendarEvent(_id: string, data: Partial<UpdateCalendarEventDto>): Promise<CalendarEvent> {
    return this.calendarEvent.findOneAndUpdate({ _id }, { ...data, date: new Date(data.date) });
  }

  public async deleteCalendarEvent(_id: string) {
    return this.calendarEvent.findOneAndDelete({ _id });
  }

  public async getCalendarEventsForCurrentYear(): Promise<CalendarEvent[]> {
    return this.calendarEvent.find({
      $or: [
        {
          date: {
            $gte: getStartOfCurrentYear()
          }
        },
        {
          isRecurring: true
        }
      ]
    });
  }

  public async getHolidaysForCurrentYear(): Promise<CalendarEvent[]> {
    return this.calendarEvent.find({
      isDayOff: true,
      $or: [
        {
          date: {
            $gte: getStartOfCurrentYear()
          }
        },
        {
          isRecurring: true
        }
      ]
    });
  }

  public async validateDayOff(data: CreateDayOffDto): Promise<boolean> {
    const holidays = await this.getHolidaysForCurrentYear();
    const dayOffYear = dayjs(data.startDate).year();

    const isIntersecting = holidays.find(h => dayjs(h.date).set("year", dayOffYear).isBetween(data.startDate, data.finishDate, "day", "[]"));

    if (isIntersecting) {
      throw new HttpException(409, "New day off intersects with calendar event that is day off");
    }
    return true;
  }
}

export default CalendarEventService;
