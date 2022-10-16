import React from "react";
import "./index.css";
import { createRoot } from "react-dom/client";

const container = document.getElementById("root") ?? window.document.body;
const root = createRoot(container);

root.render(<div>Hello hackathon</div>);
