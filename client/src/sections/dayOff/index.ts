import {DayOffStatus, DayOffType} from "../../shared/dayOff.interface";

export const StatusLabels: Record<DayOffStatus, string> = {
    approved: "Approved",
    declined: "Declined",
    pending: "Pending"
}

export const TypeLabels: Record<DayOffType, string> = {
    vacation: "🏖️ Vacation",
    sickLeave: "🤒 Sick leave",
    dayOff: "📆 Day off",
    unpaid: "💰 Unpaid day off",
}
