import { FC, useState } from "react";
import { AppHeader } from "../../layouts/Header";
import { ErrorsBlock } from "../../components/ErrorsBlock";
import { AxiosError } from "axios/index";
import { Gutter } from "../../components/Gutter";
import { Badge, Button, Card, Col, DatePicker, Layout, List, Row, Statistic, Typography } from "antd";
import { useApiFactory } from "../../services/apiFactory";
import { GetTimeTracksResponse } from "../../shared/timeTrack.interface";
import dayjs from "dayjs";
import { API } from "../../services/api";
import { formatMonth } from "../../utils/formatters";
import { renderUserCell } from "../../components/table/RenderUserCell";
import { Link } from "react-router-dom";
import { EditorRoutes, getUserTracksRoute } from "../../router/AppRoutes";
import { User } from "../../shared/user.interface";

const { Content } = Layout;
const { Title, Text } = Typography;

const getRibbonProps = (totalHours: number, userHours: number) => {
  if (userHours === totalHours) {
    return { text: "Normal hours", color: "" };
  } else if (userHours > totalHours) {
    return { text: "Overtime hours", color: "green" };
  } else if (userHours < totalHours) {
    return { text: "Insufficient hours", color: "orange" };
  }
};

export const TimeTrackOverviewPage: FC = () => {
  const [selectedMonth, setSelectedMonth] = useState(dayjs());

  const {
    data: timeTrackData
  } = useApiFactory<GetTimeTracksResponse>({
    basePath: "/time_tracks",
    get: {
      queryKeys: ["/time_tracks/my", selectedMonth],
      fetcher: async (config) => {
        const params = new URLSearchParams({
          date: selectedMonth.toISOString()
        });
        const res = await API.get(`/time_tracks/?${params.toString()}`, config);
        return res.data.data as GetTimeTracksResponse;
      }
    }
  });
  const { data, isLoading } = timeTrackData;
  const usersTracked = data?.timeTracks.length;
  const totalUsers = (usersTracked ?? 0) + (data?.usersWithNoTracks.length ?? 0);

  return (
    <>
      <AppHeader title={"Time tracks overview"} />
      <Content style={{ margin: 32 }}>
        <ErrorsBlock
          errors={[
            timeTrackData.error as AxiosError
          ]} />
        <Gutter size={2} />
        <Card bordered={false} style={{ boxShadow: "none", borderRadius: 4 }}>
          <Title level={4}>Time tracking statistics in {formatMonth(selectedMonth)}</Title>
          <Gutter size={1} />
          <Row gutter={16}>
            <Col span={6}>
              <Statistic title="Users with time tracked / total users" value={usersTracked} suffix={`/ ${totalUsers}`}
                         loading={isLoading} />
            </Col>
            <Col span={6}>
              <Statistic title="Hours to be tracked" value={data?.workingDays.totalHours} loading={isLoading} />
            </Col>
            <Col span={6}>
              <Statistic title="Business days in this months (excluding holidays and days off)"
                         value={data?.workingDays.workingDays} loading={isLoading} />
            </Col>
            <Col span={6}>
              <Statistic title="Holidays & celebrations with day off in this month"
                         value={data?.workingDays.eventsDays}
                         loading={isLoading} />
              <Link to={EditorRoutes.holidaysAndCelebrations}>
                <Button style={{ marginTop: 16 }} type="default">
                  Add celebration
                </Button>
              </Link>
            </Col>
          </Row>
        </Card>
        <Gutter size={2} />
        <Card bordered={false} style={{ boxShadow: "none", borderRadius: 4 }}>
          <DatePicker allowClear={false} value={selectedMonth} onChange={v => setSelectedMonth(v!)} picker="month" />
        </Card>
        <Gutter size={2} />
        <List
          loading={timeTrackData.isLoading}
          grid={{
            gutter: 0,
            xs: 1,
            sm: 2,
            md: 2,
            lg: 3,
            xl: 4,
            xxl: 4
          }}
          // @ts-ignore
          dataSource={data?.timeTracks.concat(data?.usersWithNoTracks)}
          renderItem={(item) => {
            if (!item.tracks) {
              return <List.Item style={{ height: "100%" }}>
                <Badge.Ribbon color={"red"} text={"No tracked hours"}>
                  <Card bordered={false} style={{ boxShadow: "none", borderRadius: 4, height: "100%" }}
                  >
                    {renderUserCell(item as unknown as User)}
                    <Gutter size={4} />
                  </Card>
                </Badge.Ribbon>
              </List.Item>;
            }

            return (
              <List.Item>
                <Badge.Ribbon {...getRibbonProps(data?.workingDays.totalHours ?? 0, item.totalHours)}>
                  <Card bordered={false} style={{ boxShadow: "none", borderRadius: 4 }}
                  >
                    {renderUserCell(item.user)}
                    <Text strong>
                      Total hours: {item.totalHours}
                    </Text>
                    <Link to={getUserTracksRoute(item.user._id)}>
                      <Button type="link">
                        Details
                      </Button>
                    </Link>

                  </Card>
                </Badge.Ribbon>
              </List.Item>
            );
          }}
        />
      </Content>
    </>
  );
};
