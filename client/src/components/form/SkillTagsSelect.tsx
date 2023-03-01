import { ComponentProps, FC } from "react";
import { Select, Tag } from "antd";
import { useQuery } from "react-query";
import { API, getRequestConfig } from "../../services/api";
import { useAuth0 } from "@auth0/auth0-react";
import { SkillTag, SkillTagCategory } from "../../shared/skillTag.interface";
import type { CustomTagProps } from "rc-select/lib/BaseSelect";
import { SkillTagCategoryToColor } from "../../sections/skillTag";

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
    const [name, category] = (label as string)?.split(":") ?? [];
    return (
      <Tag
        color={SkillTagCategoryToColor[category as SkillTagCategory]}
        onMouseDown={onPreventMouseDown}
        closable={closable}
        onClose={onClose}
        style={{ marginRight: 3 }}
      >
        {`${category} | ${name}`}
      </Tag>
    );
  };

  const selected = (props.value as Array<{ _id: string }>)?.map(v => v._id);
  return (
    <Select
      mode={"multiple"}
      loading={isLoading}
      allowClear
      onChange={(v, opt) => {
        const values = v.map(id => data?.find(item => item._id === id));
        props.onChange && props.onChange(values, opt);
      }
      }
      value={selected}
      optionLabelProp="label"
      tagRender={tagRender}
    >
      {data?.map(item => <Select.Option key={item._id} value={item._id} label={`${item.name}:${item.category}`}>
        <Tag color={SkillTagCategoryToColor[item.category]}>{`${item.category} | ${item.name}`}</Tag>
      </Select.Option>)}

    </Select>
  );
};
