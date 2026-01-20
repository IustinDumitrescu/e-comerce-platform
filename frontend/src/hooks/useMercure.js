import { useEffect, useRef } from "react";

export default function useMercure(topics = [], onMessage) {
  const eventSourceRef = useRef(null);

  useEffect(() => {
    if (!topics.length || !onMessage) return;

    if (eventSourceRef.current) {
      eventSourceRef.current.close();
      eventSourceRef.current = null;
    }

    const url = new URL(import.meta.env.VITE_MERCURE_PUBLIC_URL);
    topics.forEach((topic) => url.searchParams.append("topic", topic));

    const eventSource = new EventSource(url.toString());
    eventSourceRef.current = eventSource;

    eventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        console.log(data);
        onMessage(data);
      } catch (e) {
        console.error("Failed to parse Mercure message", e);
      }
    };

    eventSource.onerror = (err) => {
      console.error("Mercure error", err);
    };

    return () => {
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
        eventSourceRef.current = null;
      }
    };

  }, [JSON.stringify(topics)]);
}
