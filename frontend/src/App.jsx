import {BrowserRouter, Route, Routes} from 'react-router-dom';
import {routes} from './config/routes'
import { createTheme, ThemeProvider, CssBaseline } from '@mui/material'
import themeConfig from './config/theme';

const theme = createTheme(themeConfig);

function App() {
  return (
       <ThemeProvider theme={theme}>
        <CssBaseline/>
        <BrowserRouter>
          <Routes>
              {routes.map((route, idx) => (
                <Route 
                  path={route.path} 
                  element={<route.component/>} 
                  key={'route_' + idx}
                />
              ))}
          </Routes>
         </BrowserRouter>
      </ThemeProvider>
  )
}

export default App
