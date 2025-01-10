import './App.css'
import {QueryClient } from "@tanstack/react-query";
import { PersistQueryClientProvider } from "@tanstack/react-query-persist-client";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Layout  } from "./views/Layout.jsx";
import { createSyncStoragePersister } from "@tanstack/query-sync-storage-persister";

const persister = createSyncStoragePersister({
    storage: window.localStorage,
})

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            cacheTime: 1000 * 60 * 5, // 5 minutes
        }
    }
})

function App() {
  return (
    <PersistQueryClientProvider client={queryClient} persistOptions={{ persister }} onSuccess={async () => {
        await queryClient.resumePausedMutations();
    }}>
        <ReactQueryDevtools />
        <Layout />
    </PersistQueryClientProvider>
  )
}

export default App
