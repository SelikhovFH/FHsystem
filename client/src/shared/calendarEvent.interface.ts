export interface CalendarEvent {
    _id: string
    createdBy: string
    title: string
    description: string
    date: Date
    isDayOff: boolean
    isRecurring: boolean
}
