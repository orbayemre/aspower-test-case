import AdminLogin from "./pages/admin/AdminLogin";
import AdminPanel from "./pages/admin/AdminPanel";
import CreateEvent from "./pages/admin/CreateEvent";
import UpdateEvent from "./pages/admin/UpdateEvent";
import Home from "./pages/Home";
import UserLogin from "./pages/user/UserLogin";
import UserRegister from "./pages/user/UserRegister";

const Routes = [
  {
    index: true,
    element: 
    <Home/>
  },
  {
    path:'/user/login',
    element: 
    <UserLogin/>
  },
  {
    path:'/user/register',
    element: 
    <UserRegister/>
  },
  {
    path:'/user/reset-password/:token',
    element: <>
      Reset Password Page
    </>
  },
  {
    path:'/admin/login',
    element:
    <AdminLogin/>
  },
  {
    path:'/admin/panel',
    element:
    <AdminPanel/>
  },
  {
    path:'/admin/panel/create-event',
    element: 
    <CreateEvent/>
  },
  {
    path:'/admin/panel/update-event/:id',
    element: 
    <UpdateEvent/>
  },
  {
    path:'*',
    element: <div>Not Found</div>
  }
];

export default Routes;