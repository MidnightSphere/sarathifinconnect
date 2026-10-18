import { useContext } from "react";
import { SplashContext } from "./splashContext";

export default function useSplashDone() {
  return useContext(SplashContext);
}
