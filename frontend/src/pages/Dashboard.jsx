import UnloggedLayout from '../layouts/UnloggedLayout';
import LoggedRoute from './LoggedRoute';

function Dashboard() {
    console.log('heelo');

    return (
        <LoggedRoute>
            <UnloggedLayout>
                <></>
            </UnloggedLayout>
        </LoggedRoute>
    )
}

export default Dashboard;