import useLocalStorage from "./useLocalStorage";

const useToggle = (key:string, initValue:boolean | (() => boolean)) => {
  const [value, setValue] = useLocalStorage(key, initValue)

  return [value, setValue] as const
}

export default useToggle