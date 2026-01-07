import RegisterForm from "../components/forms/RegisterForm";
import AuthLayout from "../layouts/AuthLayout";
import UnloggedRoute from '../pages/UnloggedRoute';

function Register() {
  return (
    <UnloggedRoute>
       <AuthLayout
        title="Register | My Portfolio App"
        metaName="description"
        metaContent="Create an account to access your portfolio dashboard."
      > 
        <RegisterForm/>
      </AuthLayout>
    </UnloggedRoute>
  );
}

export default Register;
