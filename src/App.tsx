import { ApolloProvider } from "@apollo/client";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.scss";
import { Navbar } from "./components/page/Navbar";
import { expoClient } from "./lib/expo/client";
import { HomePage } from "./pages/HomePage";
import { RoutePage } from "./pages/routes/RoutePage";
import { RoutesPage } from "./pages/routes/RoutesPages";
import mapboxgl from "mapbox-gl";
import { config } from "./config";
import { MapPage } from "./pages/map/MapPage";

mapboxgl.accessToken = config.mapboxToken;

function App() {
  return (
    <BrowserRouter>
      <ApolloProvider client={expoClient}>
        <div className="App">
          <Navbar />
          <Routes>
            <Route path="/">
              <Route index element={<HomePage />} />

              <Route path="routes" element={<RoutesPage />} />
              <Route path="routes/:routeNumber" element={<RoutePage />} />

              <Route path="map" element={<MapPage />} />
            </Route>
          </Routes>
        </div>
      </ApolloProvider>
    </BrowserRouter>
  );
}

export default App;
