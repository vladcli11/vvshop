import BrandModels from "../components/BrandModels";
import { appleModels } from "../data/models";

export default function Apple() {
  return <BrandModels brandSlug="apple" models={appleModels} />;
}
