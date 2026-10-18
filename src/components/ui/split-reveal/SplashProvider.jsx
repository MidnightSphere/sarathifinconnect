import { SplashContext } from "./splashContext";

export default function SplashProvider({ value, children }) {
  return <SplashContext.Provider value={value}>{children}</SplashContext.Provider>;
}
