import DashboardLayout from "../../components/DashboardLayout";
import UserProfile from "../../components/UserProfile";

const UserProfilePage = () => {
  return (
    <DashboardLayout activeTab="profile" userType="user">
      <UserProfile />
    </DashboardLayout>
  );
};

export default UserProfilePage;
