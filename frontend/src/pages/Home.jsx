import { Button, Typography, Box } from '@mui/material';
import UnloggedLayout from '../layouts/UnloggedLayout';
import Header from '../components/Header';

function Home() {
    return (
      <UnloggedLayout>
        <Header
          title={"Home | My Portfolio App"}
          metaName={"description"}
          metaContent={"Welcome to my portfolio built with React, Symfony and Docker."}
        />

        <Box display="flex" flexDirection="column" gap={2} mt={8}>
          <Typography variant="h3" align="center" color="primary">
            Welcome to My Portfolio App
          </Typography>
          <Button variant="contained" color="primary">Primary Button</Button>
          <Button variant="outlined" color="secondary">Secondary Button</Button>
        </Box>
      </UnloggedLayout>
  );
}

export default Home;