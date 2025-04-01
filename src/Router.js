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
import ViewUpdateOrder from "./menuWaiter/ViewUpdateOrder";
import WaiterViewBills from "./menuWaiter/WaiterViewBills";
import TrackBills from "./menuAdmin/TrackBills";


const Router = () => {
  return (
    <UserAuthContextProvider>
      <Routes>
        <Route path="/QR-Restaurant-Menu/" element={<QRLoginPage />} />
        <Route path="/QR-Restaurant-Menu/404" element={<PageNotFound />} />
        <Route path="/QR-Restaurant-Menu/:id" element={<CustomerMenu />} />

        <Route element={<ProtectedRoute />}>
          <Route path="/QR-Restaurant-Menu/admindashboard" element={<AdminDashboard />} />
          <Route path="/QR-Restaurant-Menu/manage-waiter" element={<ManageWaiters />} />
          <Route path="/QR-Restaurant-Menu/manage-table" element={<ManageTables />} />
          <Route path="/QR-Restaurant-Menu/add-menu" element={<AddMenuItems />} />
          <Route path="/QR-Restaurant-Menu/manage-menu" element={<ManageMenu />} />
          <Route path="/QR-Restaurant-Menu/track-bills" element={<TrackBills />} />

          <Route path="/QR-Restaurant-Menu/waiter-dashboard" element={<WaiterDashboard />} />
          <Route path="/QR-Restaurant-Menu/manage-orders" element={<ManageOrders />} />
          <Route path="/QR-Restaurant-Menu/view-update-order/:id" element={<ViewUpdateOrder />} />
          <Route path="/QR-Restaurant-Menu/waiter-view-bills" element={<WaiterViewBills />} />
        </Route>
        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </UserAuthContextProvider>
  );
};

export default Router;
