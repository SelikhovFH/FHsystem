import { Tag } from "antd";
import { ReactNode } from "react";
import { ProjectStatus } from "../../shared/project.interface";

export const renderProjectStatus = (status: ProjectStatus): ReactNode => {
    switch (status) {
        case ProjectStatus.planned:
            return <Tag color="default">Planned</Tag>;
        case ProjectStatus.paused:
            return <Tag color="warning">Paused</Tag>;
        case ProjectStatus.finished:
            return <Tag color="success">Finished</Tag>;
        case ProjectStatus.cancelled:
            return <Tag color="error">Cancelled</Tag>;
        case ProjectStatus.ongoing:
            return <Tag color="processing">Ongoing</Tag>;
        default:
            return null;
    }
};
