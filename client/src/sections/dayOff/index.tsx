import { DayOffStatus, DayOffType } from "../../shared/dayOff.interface";
import { ReactNode } from "react";
import { Tag } from "antd";

export const StatusLabels: Record<DayOffStatus, string> = {
    approved: "Approved",
    declined: "Declined",
    pending: "Pending"
};

export const TypeLabels: Record<DayOffType, string> = {
    vacation: "🏖️ Vacation",
    sickLeave: "🤒 Sick leave",
    dayOff: "📆 Day off",
    unpaid: "💰 Unpaid day off"
};

export const renderDayOffStatus = (status: DayOffStatus): ReactNode => {
    switch (status) {
        case DayOffStatus.pending:
            return <Tag color="processing">{StatusLabels.pending}</Tag>;
        case DayOffStatus.approved:
            return <Tag color="success">{StatusLabels.approved}</Tag>;
        case DayOffStatus.declined:
            return <Tag color="error">{StatusLabels.declined}</Tag>;
        default:
            return null;
    }
};
