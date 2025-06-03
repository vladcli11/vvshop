import { useContext } from "react";
import CartContext from "./CartContext";

const useCart = () => useContext(CartContext);
export default useCart;
