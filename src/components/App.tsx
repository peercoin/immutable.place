import Camera from "./Camera";
import PixelCanvas from "./PixelCanvas";

export default function App() {
  return (
    <Camera onClick={() => console.log("Clicked")}>
      <PixelCanvas></PixelCanvas>
    </Camera>
  );
}
