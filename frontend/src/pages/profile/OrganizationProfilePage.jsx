import DashboardLayout from "../../components/DashboardLayout";
import OrganizationProfile from "../../components/OrganizationProfile";

const OrganizationProfilePage = () => {
  return (
    <DashboardLayout activeTab="profile" userType="organization">
      <OrganizationProfile />
    </DashboardLayout>
  );
};

export default OrganizationProfilePage;
