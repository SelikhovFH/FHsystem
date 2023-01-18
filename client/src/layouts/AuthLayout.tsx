import {FC} from "react";
import {Outlet} from "react-router-dom";
import {Card, Col, Row, theme} from "antd";

type Props = {}

export const AuthLayout: FC<Props> = (props) => {
    const {token} = theme.useToken()
    return (
        <div style={{backgroundColor: token.colorBgLayout}}>
            <Row align={"middle"} style={{minHeight: "100vh"}}>
                <Col span={6} offset={9}>
                    <Card>
                        <Outlet/>
                    </Card>
                </Col>
            </Row>
        </div>
    )
}
