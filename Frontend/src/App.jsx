import AppRouter from "./app/router/AppRouter";
import { Toaster } from "react-hot-toast";

function App() {
  return (
    <>
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            borderRadius: "16px",
            padding: "14px",
          },
        }}
      />
      <AppRouter />
    </>
  );
}

export default App;
