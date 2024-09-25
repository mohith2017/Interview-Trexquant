import { ReactFlowProvider } from "@xyflow/react";
import Image from "next/image";
import ReactFlowNode from "./components/Node/ReactFlowNode";


export default function Home() {
  return (
    <ReactFlowProvider>
    <ReactFlowNode />
  </ReactFlowProvider>
  );
}
