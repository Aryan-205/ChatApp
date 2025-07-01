import { useState, useRef, useEffect } from "react";

export default function App() {
  const [msg, setMsg] = useState<string[]>([]);
  const [text, setText] = useState("");

  const bottomRef = useRef<HTMLDivElement>(null);
  const ws = useRef<WebSocket | null>(null);

  // Create WebSocket connection only once
  useEffect(() => {
    ws.current = new WebSocket("ws://localhost:3030");

    ws.current.onopen = () => {
      // Join a room once connected
      ws.current?.send(
        JSON.stringify({
          type: "join",
          payload: {
            roomId: "123"
          }
        })
      );
    };

    ws.current.onmessage = (event) => {
      setMsg((m) => [...m, event.data]);
    };

    return () => {
      ws.current?.close();
    };
  }, []);

  // Scroll to bottom when message list changes
  useEffect(() => {
    requestAnimationFrame(() => {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    });
  }, [msg]);

  function postMsg() {
    if (text.trim() === "") return;

    // Send chat message to server
    ws.current?.send(
      JSON.stringify({
        type: "chat",
        payload: {
          message: text
        }
      })
    );

    setText("");
  }

  return (
    <div className="w-full h-screen flex justify-center items-center">
      <div className="w-[40%] h-[80%] p-8 border rounded-xl flex flex-col justify-between items-center bg-slate-950">
        <div className="w-full h-[90%] overflow-y-auto flex flex-col gap-2 scrollbar-none">
          {msg.map((m, index) => (
            <div key={index} className="bg-gray-200 p-2 rounded-md w-fit max-w-[80%]">
              {m}
            </div>
          ))}
          <div ref={bottomRef} />
        </div>

        <div className="flex w-full h-12 gap-4">
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="p-2 flex-[2] border rounded-xl"
            placeholder="Type..."
          />
          <button
            className="rounded-xl border text-white bg-blue-500 flex-1 hover:bg-blue-600"
            onClick={postMsg}
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}