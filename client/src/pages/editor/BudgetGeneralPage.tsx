import { FC, useEffect, useState } from "react";
import { AppHeader } from "../../layouts/Header";
import { ErrorsBlock } from "../../components/ErrorsBlock";
import { AxiosError } from "axios/index";
import { Gutter } from "../../components/Gutter";
import {
  Button,
  Card,
  DatePicker,
  Form,
  Input,
  InputNumber,
  Layout,
  Modal,
  Popover,
  Select,
  Space,
  Table,
} from "antd";
import { DeleteOutlined, EditOutlined, PlusOutlined } from "@ant-design/icons";
import * as yup from "yup";
import { getYupRule } from "../../utils/yupRule";
import styles from "../FormStyles.module.css";
import { ColumnsType } from "antd/es/table";
import { FormProps } from "../../utils/types";
import { Item, ItemSize } from "../../shared/item.interface";
import { useApiFactory } from "../../services/apiFactory";
import { API } from "../../services/api";
import { GetUserTimeTracks } from "../../shared/timeTrack.interface";
import dayjs from "dayjs";
import { MonthlyGeneral } from "../../shared/budget.interface";
import {
  renderUserCell,
  UserCell,
} from "../../components/table/RenderUserCell";
import { formatMoney } from "../../utils/formatters";
import { Treemap } from "@ant-design/charts";
import { getDisplayName } from "../../sections/users/getDisplayName";

const { Content } = Layout;

export const BudgetGeneralPage: FC = () => {
  const [selectedMonth, setSelectedMonth] = useState(dayjs());
  const { data, messageContext } = useApiFactory<
    MonthlyGeneral,
    MonthlyGeneral
  >({
    basePath: "/budget/monthly_general",
    get: {
      queryKeys: ["/budget/monthly_general", selectedMonth],
      fetcher: async (config) => {
        const params = new URLSearchParams({
          date: selectedMonth.toISOString(),
        });
        const res = await API.get(
          `/budget/monthly_general?${params.toString()}`,
          config
        );
        return res.data.data as MonthlyGeneral;
      },
    },
  });

  console.log(data.data);

  const renderZeroAsUndefined = (value: number) => (value ? value : undefined);

  const columns = [
    {
      title: "Worker",
      dataIndex: "user",
      key: "user",
      render: renderUserCell,
    },
    {
      title: "Income Total",
      dataIndex: "incomeTotal",
      key: "incomeTotal",
      render: (incomeTotal: number, record: any) => {
        if (!incomeTotal) return undefined;
        const content = record.income.map((project: any) => (
          <div>
            {project.project} - {formatMoney(project.rate)}x{project.hours} =
            {formatMoney(project.total)}
          </div>
        ));
        return (
          <Popover content={content} title="Title">
            {formatMoney(incomeTotal)}
          </Popover>
        );
      },
    },
    {
      title: "Salary Total",
      dataIndex: "salaryTotal",
      key: "salaryTotal",
      render: renderZeroAsUndefined,
    },
    {
      title: "Unpaid Day Offs (manual)",
      dataIndex: "unpaidDayOffs",
      key: "unpaidDayOffs",
      render: renderZeroAsUndefined,
    },
    {
      title: "Balance",
      dataIndex: "balance",
      key: "balance",
      render: (balance: number) => (
        <b
          style={{ color: balance === 0 ? "" : balance > 0 ? "green" : "red" }}
        >
          {balance.toFixed(2)}
        </b>
      ),
    },
  ];

  const tableData =
    data?.data?.workers.map((worker) => {
      return {
        key: worker.user._id,
        user: worker.user,
        incomeTotal: worker.incomeTotal,
        unpaidDayOffs: worker.unpaidDayOffs,
        salaryTotal: worker.salaryTotal,
        balance: worker.balance,
        income: worker.income,
      };
    }) ?? [];

  const summaryRow = () => (
    <>
      <Table.Summary.Row>
        <Table.Summary.Cell index={0}>Total</Table.Summary.Cell>
        <Table.Summary.Cell index={2}>
          {data?.data?.incomeTotal}
        </Table.Summary.Cell>
        <Table.Summary.Cell index={1}>
          {data?.data?.expenseTotal}
        </Table.Summary.Cell>
        <Table.Summary.Cell index={3}></Table.Summary.Cell>
        <Table.Summary.Cell index={4}>
          <b
            style={{
              color:
                data?.data?.total === 0
                  ? ""
                  : // @ts-ignore
                  data?.data?.total > 0
                  ? "green"
                  : "red",
            }}
          >
            {data?.data?.total.toFixed(2)}
          </b>
        </Table.Summary.Cell>
      </Table.Summary.Row>
    </>
  );

  return (
    <>
      {messageContext}

      <AppHeader title={"General budget overview"} />
      <Content style={{ margin: 32 }}>
        <ErrorsBlock errors={[data.error as AxiosError]} />
        <Gutter size={2} />
        <DatePicker
          allowClear={false}
          value={selectedMonth}
          onChange={(v) => setSelectedMonth(v!)}
          picker="month"
        />
        <Gutter size={4} />
        <Table
          loading={data.isLoading}
          summary={summaryRow}
          columns={columns}
          dataSource={tableData}
          pagination={false}
        />
        <Gutter size={4} />
        <Card
          title={"Employee revenue tree map"}
          bordered={false}
          style={{ boxShadow: "none", borderRadius: 4 }}
        >
          <Treemap
            loading={data.isLoading}
            colorField={"name"}
            data={{
              name: "root",
              children: data?.data?.workers.map((w) => ({
                name: getDisplayName(w.user),
                value: w.incomeTotal,
              })),
            }}
          />
        </Card>
      </Content>
    </>
  );
};
