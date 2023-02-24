import { Tag } from "antd";


export const renderColorCell = (color: string) => {
    return <Tag color={color}>{color}</Tag>;
};
