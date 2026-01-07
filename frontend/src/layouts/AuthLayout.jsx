import { Box, Grid } from "@mui/material";
import Header from "../components/Header";
import UnloggedLayout from "./UnloggedLayout";

export default function AuthLayout({children, title, metaContent, metaName}) {
    return (
       <UnloggedLayout>
            <Header
                title={title}
                metaName={metaName}
                metaContent={metaContent}
            />

            <Grid container sx={{ marginY: '5%' }}>
                <Grid
                    sx={{
                        flex: { xs: 1},
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        px: 2,
                    }}
                >
                    <Box 
                        sx={{ 
                            width: '100%',
                            maxWidth: 520,  
                            borderRadius: 6,
                            boxShadow: 3, 
                        }}
                    >
                        {children}
                    </Box>
                </Grid>
            </Grid>
        </UnloggedLayout>
    );
}