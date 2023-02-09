import { FC, useState } from "react";
import { Button, Modal, Space } from "antd";
import { EditOutlined, LogoutOutlined } from "@ant-design/icons";
import { useAuth0 } from "@auth0/auth0-react";
import { AppHeader } from "../layouts/Header";
import { useApiFactory } from "../services/apiFactory";
import { User, UserProfile } from "../shared/user.interface";
import { Profile } from "../components/profile/Profile";
import dayjs from "dayjs";
import { UpdateMyProfileForm } from "../components/profile/UpdateMyProfileForm";
import { ErrorsBlock } from "../components/ErrorsBlock";

type Props = {}


export const MyProfilePage: FC<Props> = (props) => {
  const { logout } = useAuth0();
  const [isOpen, setIsOpen] = useState(false);

  const {
    data: profile,
    form,
    messageContext,
    editMutation
  } = useApiFactory<UserProfile, Partial<User>>({
    basePath: "/users/me",
    edit: {
      onSuccess: () => {
        setIsOpen(false);
      }
    }
  });

  const onEditFinish = (_values: User) => {
    if (!profile.data) {
      return;
    }
    const { name, surname, birthDate, location, phone, emergencyContact } = _values;
    editMutation.mutate({ name, surname, birthDate, location, phone, emergencyContact });
  };

  const handleEditCancel = () => {
    form.resetFields();
    setIsOpen(false);
  };

  const onEditClick = () => {
    setIsOpen(true);
  };

  return (
    <>
      {messageContext}
      <Modal footer={[]} title={"Update profile"} open={isOpen}
             onCancel={handleEditCancel}>
        <UpdateMyProfileForm
          initialValues={{ ...profile.data, birthDate: dayjs(profile.data?.birthDate) }}
          form={form}
          onFinish={onEditFinish}
          buttonDisabled={editMutation.isLoading}
        />
      </Modal>
      <AppHeader title={"My profile"} />
      <ErrorsBlock errors={[profile.error, editMutation.error]} />
      <Profile profile={profile.data} isLoading={profile.isLoading}
               myProfileAddon={<Space>
                 <Button onClick={onEditClick} icon={<EditOutlined />}>
                   Edit profile
                 </Button>
                 <Button onClick={() => logout({ returnTo: window.location.origin })} type="primary" danger
                         icon={<LogoutOutlined />}>
                   Logout
                 </Button>
               </Space>} />
    </>
  );
};
