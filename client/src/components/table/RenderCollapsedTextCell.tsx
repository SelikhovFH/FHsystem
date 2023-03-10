import { Popover, Typography } from "antd";
import { truncate } from "lodash";
import { FC } from "react";


export const CollapsedTextCell: FC<{ text: string; title?: string }> = ({ title, text }) => {
  return <Popover title={title} content={<Typography.Paragraph style={{ width: 400 }}>{text}</Typography.Paragraph>}>
    <Typography.Paragraph>{truncate(text, { length: 32 })}</Typography.Paragraph>
  </Popover>;
};
