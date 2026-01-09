import { Paper } from "@mui/material";
import Flash from "../Flash";

export default function FormTemplate({children, flash, setFlash}) {
    return (
       <Paper
            elevation={3}
            sx={{
                p: 4,
                width: '100%',
                borderRadius: 4
            }}
        >
            <Flash
                open={flash.message.length > 0}
                message={flash.message}
                severity={flash.type}
                onClose={() => setFlash({...flash, message: ''})}
            />
            {children}
        </Paper>
    );
}