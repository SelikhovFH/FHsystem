import { ComponentProps, FC } from "react";
import { Select, Tag } from "antd";
import { useQuery } from "react-query";
import { API, getRequestConfig } from "../../services/api";
import { useAuth0 } from "@auth0/auth0-react";
import { SkillTag } from "../../shared/skillTag.interface";
import type { CustomTagProps } from "rc-select/lib/BaseSelect";

type Props = ComponentProps<typeof Select>

export const SkillTagsSelect: FC<Props> = (props) => {
  const { getAccessTokenSilently } = useAuth0();
  const { data, isLoading } = useQuery<SkillTag[]>(["/skill_tags"], async () => {
    const token = await getAccessTokenSilently();
    // TODO dont forget about pagination later
    const res = await API.get(`/skill_tags`, getRequestConfig(token));
    return res.data.data;
  });

  const tagRender = (props: CustomTagProps) => {
    const { label, value, closable, onClose } = props;
    const onPreventMouseDown = (event: React.MouseEvent<HTMLSpanElement>) => {
      event.preventDefault();
      event.stopPropagation();
    };
    return (
      <Tag
        color={value}
        onMouseDown={onPreventMouseDown}
        closable={closable}
        onClose={onClose}
        style={{ marginRight: 3 }}
      >
        {label}
      </Tag>
    );
  };
  return (
    <Select
      mode={"multiple"}
      {...props}
      loading={isLoading}
      allowClear
      tagRender={tagRender}
    >
      {data?.map(item => <Select.Option key={item._id} value={item._id} label={item.name}>
        <Tag color={item.color}>{item.name}</Tag>
      </Select.Option>)}

    </Select>
  );
};
