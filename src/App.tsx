import { RouterProvider } from "@tanstack/react-router";
import { router } from "./router";
import "./index.css";
import { Toaster } from "./components/ui/sonner";

function App() {
  return (
    <>
      <RouterProvider router={router} />
      <Toaster />
    </>
  );
}

export default App;
