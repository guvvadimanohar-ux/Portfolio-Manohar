import { lazy, Suspense } from "react";
import "./App.css";
import { SpeedInsights } from "@vercel/speed-insights/react";
import ChatLauncher from "./components/ChatLauncher";

const CharacterModel = lazy(() => import("./components/Character"));
const MainContainer = lazy(() => import("./components/MainContainer"));
import { LoadingProvider } from "./context/LoadingProvider";

const App = () => {
  return (
    <>
      <LoadingProvider>
        <Suspense>
          <MainContainer>
            <Suspense>
              <CharacterModel />
            </Suspense>
          </MainContainer>
        </Suspense>
      </LoadingProvider>
      <SpeedInsights />
      <ChatLauncher />
    </>
  );
};

export default App;
