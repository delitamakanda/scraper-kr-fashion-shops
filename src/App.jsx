import './App.css'
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Layout  } from "./views/Layout.jsx";

const queryClient = new QueryClient()

function App() {
  return (
    <QueryClientProvider client={queryClient}>
        <ReactQueryDevtools />
        <Layout />
    </QueryClientProvider>
  )
}

export default App
