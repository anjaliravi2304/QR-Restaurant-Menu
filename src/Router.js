import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import { UserAuthContextProvider } from "./context/UserAuthContext";
import PageNotFound from "./Pages/PageNotFound";

import QRLoginPage from "./qrMain/QRLoginPage";
import AdminDashboard from "./menuAdmin/AdminDashboard";
import ManageWaiters from "./menuAdmin/ManageWaiters";
import ManageTables from "./menuAdmin/ManageTables";
import AddMenuItems from "./menuAdmin/AddMenuItems";
import ManageMenu from "./menuAdmin/ManageMenu";
import CustomerMenu from "./qrMain/CustomerMenu";
import WaiterDashboard from "./menuWaiter/WaiterDashboard";
import ManageOrders from "./menuWaiter/ManageOrders";


const Router = () => {
  return (
    <UserAuthContextProvider>
      <Routes>
        <Route path="/" element={<QRLoginPage />} />
        <Route path="/404" element={<PageNotFound />} />
        {/* <Route path="/profile/:id" element={<ProfilePage />} /> */}
        <Route path="/customer-menu/:id" element={<CustomerMenu />} />

        {/* <Route path="/login" element={<LoginPage />} /> */}
        {/* <Route path="/logintest" element={<LoginTest />} /> */}
        {/* <Route path="/register-now" element={<PhoneSignUp />} /> */}

        {/* <Route path="/compatible-phones" element={<CompatablePage />} /> */}

        <Route element={<ProtectedRoute />}>
          <Route path="/admindashboard" element={<AdminDashboard />} />
          <Route path="/manage-waiter" element={<ManageWaiters />} />
          <Route path="/manage-table" element={<ManageTables />} />
          <Route path="/add-menu" element={<AddMenuItems />} />
          <Route path="/manage-menu" element={<ManageMenu />} />



          <Route path="/waiter-dashboard" element={<WaiterDashboard />} />
          <Route path="/manage-orders" element={<ManageOrders />} />

          {/* <Route path="/fill-social-profiles" element={<SubmitMediaDetails />} /> */}
          {/* <Route path="/select-nfctype" element={<NFCDesignPricing />} /> */}
          {/* <Route path="/nfc-display" element={<NFCCardDisplay />} /> */}

          {/* <Route path="/user-profile" element={<UserProfile />} /> */}
          {/* <Route path="/update-personal-info" element={<UpdatePersonalDetails />} /> */}
          {/* <Route path="/update-social-info" element={<UpdateSocialDetails />} /> */}
          {/* <Route path="/update-other" element={<UpdateOther />} /> */}
        </Route>
        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </UserAuthContextProvider>
  );
};

export default Router;
