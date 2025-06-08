import BrandModels from "../components/BrandModels";
import { samsungModels } from "../data/models";

export default function Samsung() {
  return <BrandModels brandSlug="samsung" models={samsungModels} />;
}
