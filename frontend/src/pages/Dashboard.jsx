import UnloggedLayout from '../layouts/UnloggedLayout';
import LoggedRoute from './LoggedRoute';

function Dashboard() {
    return (
        <LoggedRoute>
            <UnloggedLayout>
                <></>
            </UnloggedLayout>
        </LoggedRoute>
    )
}

export default Dashboard;