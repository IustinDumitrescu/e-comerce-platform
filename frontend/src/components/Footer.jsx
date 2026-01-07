import {Box, Typography} from '@mui/material'

export default function Footer() {
    return (
        <Box
            component="footer"
            sx={{
                py: 2,
                mt: 'auto',
                textAlign: 'center',
                backgroundColor: 'background.paper',
                borderTop: '1px solid #e5e7eb',
            }}
            id='footer'
        >
            <Typography variant="body2" color="text.secondary">
                © {new Date().getFullYear()} Iustin Dumitrescu
            </Typography>
        </Box>
    );
}