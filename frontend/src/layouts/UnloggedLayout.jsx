import { Box } from "@mui/material";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer"
import useUser from "../hooks/useUser";

export default function UnloggedLayout({children}) {
    const {user, logout} = useUser();

    return (
        <Box
            sx={{
                minHeight: '100vh',
                display: 'flex',
                flexDirection: 'column',
                backgroundColor: 'background.default',
            }}
        >  
            <Navbar user={user} logout={logout}/>
             {children}
            <Footer/>
        </Box>
    );
}