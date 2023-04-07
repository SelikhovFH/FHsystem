import { FC, useState } from "react";
import { AppHeader } from "../../layouts/Header";
import { Gutter } from "../../components/Gutter";
import { Button, Form, Layout, Select, Tabs, TabsProps } from "antd";
import * as yup from "yup";
import { getYupRule } from "../../utils/yupRule";
import styles from "../FormStyles.module.css";
import { SettingsModules } from "../../shared/settings/settingsModules.enum";
import { useMutation, useQuery } from "react-query";
import { API, getRequestConfig } from "../../services/api";
import { OneToOneSettings, OneToOneSettingsPeriod } from "../../shared/settings/oneToOneSettings";
import { useAuth0 } from "@auth0/auth0-react";
import { AxiosError } from "axios";
import { OneToOneSettingsPeriodLabels } from "../../sections/settings";
import { ErrorsBlock } from "../../components/ErrorsBlock";
import { useRequestMessages } from "../../hooks/useRequestMessages";
import { queryClient } from "../../services/queryClient";

const { Content } = Layout;

const oneToOneSchema = yup.object().shape({
  period: yup.string().required(),
  userSpecificPeriods: yup.array().of(yup.object().shape({
    userId: yup.string().required(),
    period: yup.string().required()
  }))
});

type ModuleSettingsType = OneToOneSettings | {}

export const SettingsPage: FC = () => {

  const [selectedModule, setSelectedModule] = useState<string>(SettingsModules.OneToOne);
  const { getAccessTokenSilently } = useAuth0();
  const { onLoad, onError, contextHolder, onSuccess } = useRequestMessages("/settings");
  const moduleSettings = useQuery<ModuleSettingsType>(["/settings/:module", selectedModule],
    async () => {
      const token = await getAccessTokenSilently();
      const res = await API.get(`/settings/${selectedModule}`, getRequestConfig(token));
      return res.data.data;
    });

  const [form] = Form.useForm();
  const moduleMutation = useMutation<ModuleSettingsType, AxiosError, ModuleSettingsType>(
    async (data) => {
      const token = await getAccessTokenSilently();
      const res = await API.patch(`/settings/${selectedModule}`, data, getRequestConfig(token));
      queryClient.invalidateQueries(["/settings/:module", selectedModule]);
      return res.data.data;
    }, {
      onSuccess,
      onError
    });

  const onFinish = (values: ModuleSettingsType) => {
    onLoad();
    moduleMutation.mutate({ ...moduleSettings.data, ...values });
  };

  const items: TabsProps["items"] = [
    {
      key: SettingsModules.OneToOne,
      label: `One to one`,
      children: <>
        {moduleSettings.data &&
          <Form style={{ maxWidth: 600 }} className={styles.form} initialValues={moduleSettings.data} form={form}
                name="item"
                layout={"vertical"}
                onFinish={onFinish}
                autoComplete="off">
            <Form.Item rules={[getYupRule(oneToOneSchema)]} label="One to one period"
                       name="period">
              <Select
                options={Object.values(OneToOneSettingsPeriod).map(v => ({
                  value: v,
                  label: OneToOneSettingsPeriodLabels[v]
                }))}
              />
            </Form.Item>
            {/*TODO User specific periods*/}
            <Form.Item>
              <Button disabled={moduleMutation.isLoading} type="primary" htmlType="submit"
                      loading={moduleMutation.isLoading}>
                Update settings
              </Button>
            </Form.Item>
          </Form>}
      </>
    }
  ];


  return (
    <>
      {contextHolder}
      <AppHeader title={"Manage items"} />
      <Content style={{ margin: 32 }}>
        <ErrorsBlock
          errors={[
            moduleMutation.error as AxiosError,
            moduleSettings.error as AxiosError
          ]} />
        <Gutter size={2} />
        <Tabs items={items} accessKey={selectedModule} onChange={(v) => setSelectedModule(v)} />
      </Content>
    </>
  );
};
