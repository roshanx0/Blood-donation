import DashboardLayout from "../../components/DashboardLayout";
import BloodBankProfile from "../../components/BloodBankProfile";

const BloodBankProfilePage = () => {
  return (
    <DashboardLayout activeTab="profile" userType="bloodbank">
      <BloodBankProfile />
    </DashboardLayout>
  );
};

export default BloodBankProfilePage;
