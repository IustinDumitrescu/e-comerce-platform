import LoginForm from "../components/forms/LoginForm";
import AuthLayout from "../layouts/AuthLayout";
import UnloggedRoute from '../pages/UnloggedRoute';

function Login() {
    return (
      <UnloggedRoute>
        <AuthLayout
          title="Login | My Portfolio App"
          metaName="description"
          metaContent="Log in into your account."
        >
            <LoginForm/>
       </AuthLayout>
      </UnloggedRoute>
    );
}

export default Login;