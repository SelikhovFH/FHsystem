import { FC } from "react";
import { AppHeader } from "../../layouts/Header";
import { useApiFactory } from "../../services/apiFactory";
import { User, UserProfile } from "../../shared/user.interface";
import { Profile } from "../../components/profile/Profile";
import { ErrorsBlock } from "../../components/ErrorsBlock";
import { useParams } from "react-router-dom";

type Props = {}


export const UserProfilePage: FC<Props> = (props) => {
  const { id } = useParams();

  const {
    data: profile
  } = useApiFactory<UserProfile, Partial<User>>({
    basePath: `/users/${id}`
  });

  return (
    <>
      <AppHeader title={"User profile"} />
      <ErrorsBlock errors={[profile.error]} />
      <Profile profile={profile.data} isLoading={profile.isLoading} />
    </>
  );
};
