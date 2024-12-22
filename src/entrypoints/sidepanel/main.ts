import { mount } from "svelte";
import Sidepanel from "./Sidepanel.svelte";
import "./app.css";

export default mount(Sidepanel, {
  target: document.getElementById("sidepanel")!,
});
