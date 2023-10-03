import { MoonLoader } from "react-spinners"

const override = {
    display: "block",
    borderColor: "orange",
    zIndex : 99,
    margin:"auto",
    left:0,
    right:0,
    top:0,
    bottom:0,
    position:"fixed"
  };

  
export const Loader = ({loading}) => {
    return (<MoonLoader
    loading={loading}
    size={100}
    aria-label="Loading Spinner"
    data-testid="loader"
    cssOverride={override}
  />);
}