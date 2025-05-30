import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Box, Container } from '@chakra-ui/react';
import Home from './pages/Home';
import HeroDetails from './pages/HeroDetails';

function App() {
  return (
    <Router>
      <Box bg="gray.50" minH="100vh">
        <Container maxW="container.lg" py={6}>
          <Routes>
            
      <Route path="/" element={<Home />} />
      <Route path="/:id" element={<HeroDetails />} />
    </Routes>
        </Container>
      </Box>
    </Router>
  );
}

export default App;

