import { FC, useState } from "react";
import { AppHeader } from "../../layouts/Header";
import { ErrorsBlock } from "../../components/ErrorsBlock";
import { AxiosError } from "axios/index";
import { Gutter } from "../../components/Gutter";
import { Card, Col, DatePicker, Descriptions, Layout, List, Row, Statistic, Typography } from "antd";
import { useApiFactory } from "../../services/apiFactory";
import { GetUserTimeTracks } from "../../shared/timeTrack.interface";
import dayjs from "dayjs";
import { API } from "../../services/api";
import { formatBoolean, formatDate, formatMonth } from "../../utils/formatters";
import { UserCell } from "../../components/table/RenderUserCell";
import { useParams } from "react-router-dom";

const { Content } = Layout;
const { Title, Text } = Typography;


export const UserTimeTracksPage: FC = () => {
  const [selectedMonth, setSelectedMonth] = useState(dayjs());
  const { id } = useParams();

  const {
    data: userTimeTracksData
  } = useApiFactory<GetUserTimeTracks>({
    basePath: "/time_tracks",
    get: {
      queryKeys: ["/time_tracks", id, selectedMonth],
      fetcher: async (config) => {
        const params = new URLSearchParams({
          date: selectedMonth.toISOString()
        });
        const res = await API.get(`/time_tracks/${id}?${params.toString()}`, config);
        return res.data.data as GetUserTimeTracks;
      }
    }
  });
  const { data, isLoading } = userTimeTracksData;

  return (
    <>
      <AppHeader title={"Employee time tracks"} />
      <Content style={{ margin: 32 }}>
        <ErrorsBlock
          errors={[
            userTimeTracksData.error as AxiosError
          ]} />
        <Gutter size={2} />
        <Card bordered={false} style={{ boxShadow: "none", borderRadius: 4 }}>
          {data && <UserCell user={data?.user} title />}
          <DatePicker allowClear={false} value={selectedMonth} onChange={v => setSelectedMonth(v!)} picker="month" />
        </Card>
        <Gutter size={1} />
        <Card bordered={false} style={{ boxShadow: "none", borderRadius: 4 }}>
          <Title level={4}>Employee time tracking statistics in {formatMonth(selectedMonth)}</Title>
          <Gutter size={1} />
          <Row gutter={[16, 16]}>
            <Col span={8}>
              <Statistic title="Hours tracked" value={data?.info.trackedHours} loading={isLoading} />
            </Col>
            <Col span={8}>
              <Statistic title="Calculated user hours to track" value={data?.info.totalUserHours} loading={isLoading} />
            </Col>
            <Col span={8}>
              <Statistic title="Calculated hours to track (without user days off)" value={data?.info.totalHours}
                         loading={isLoading} />
            </Col>
            <Col span={8}>
              <Statistic title="Business days in month" value={data?.info.workingDays} loading={isLoading} />
            </Col>
            <Col span={8}>
              <Statistic title="User days off in month" value={data?.info.dayOffDays} loading={isLoading} />
            </Col>
            <Col span={8}>
              <Statistic title="Holidays & events in month" value={data?.info.eventsDays} loading={isLoading} />
            </Col>
          </Row>
        </Card>
        <Gutter size={1} />
        {data?.timeTracks.map(track => <>
          <List
            loading={isLoading}
            itemLayout="horizontal"
            grid={{
              gutter: 16,
              xs: 1,
              sm: 2,
              md: 2,
              lg: 3,
              xl: 4,
              xxl: 4
            }}
            style={{ marginTop: 8 }}
            dataSource={track.tracks}
            header={<Title level={4}>Project {track.project.name}</Title>}
            renderItem={(track) => (
              <List.Item style={{ padding: 0, margin: 0, marginTop: 16 }}>
                <Card size={"small"}>
                  <List.Item.Meta
                    title={`${formatDate(track.date)}`}
                    description={
                      <Descriptions size={"small"} column={1}>
                        <Descriptions.Item label="Hours">{track.hours}</Descriptions.Item>
                        <Descriptions.Item
                          label="Is month track">{formatBoolean(track.isMonthTrack)}</Descriptions.Item>
                        {track.comment && <Descriptions.Item label="Comment">{track.comment}</Descriptions.Item>}
                      </Descriptions>
                    }
                  />
                </Card>
              </List.Item>
            )}
          />
        </>)}
      </Content>
    </>
  );
};
